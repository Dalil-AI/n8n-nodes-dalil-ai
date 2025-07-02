import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { dalilAiApiRequest, formatTextToBlocknote } from './GenericFunctions';
import { peopleFields, peopleOperations } from './PeopleDescription';
import { companyFields, companyOperations } from './CompanyDescription';
import { opportunityFields, opportunityOperations } from './OpportunityDescription';
import { noteFields, noteOperations } from './NoteDescription';
import { noteTargetFields, noteTargetOperations } from './NoteTargetDescription';
import { taskFields, taskOperations } from './TaskDescription';
import { taskTargetFields, taskTargetOperations } from './TaskTargetDescription';
import { pipelineFields, pipelineOperations } from './PipelineDescription';
import { processFieldValue, parseFieldMetadata, filterFieldMetadata } from './FieldTypeHelper';

export class DalilAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dalil AI',
		name: 'dalilAi',
		icon: 'file:dalil-ai.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Dalil AI API',
		defaults: {
			name: 'Dalil AI',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'dalilAiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Note Relation',
						value: 'noteTarget',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Person',
						value: 'people',
					},
					{
						name: 'Pipeline',
						value: 'pipeline',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Task Relation',
						value: 'taskTarget',
					},
				],
				default: 'people',
			},
			...peopleOperations,
			...peopleFields,
			...companyOperations,
			...companyFields,
			...noteOperations,
			...noteFields,
			...noteTargetOperations,
			...noteTargetFields,
			...taskOperations,
			...taskFields,
			...taskTargetOperations,
			...taskTargetFields,
			...pipelineOperations,
			...pipelineFields,
			...opportunityOperations,
			...opportunityFields,
		],
	};

	methods = {
		loadOptions: {
			async getPeopleCustomProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const personStandardId = '20202020-e674-48e5-a542-72570eee7213';
				const endpoint = `/rest/metadata/objects/standard-id/${personStandardId}`;
				
				try {
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					// Check if response has the expected structure
					if (!response || !response.data || !response.data.getObjectMetadataByStandardId) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const fields = response.data.getObjectMetadataByStandardId.fields;
					
					if (!Array.isArray(fields)) {
						throw new Error(`Fields is not an array: ${JSON.stringify(fields)}`);
					}
					
					for (const field of fields) {
						if (field.isCustom === true && field.isActive === true && filterFieldMetadata(field, 'create')) {
							// Encode field metadata in the value for dynamic type rendering
							const fieldMetadata = {
								name: field.name,
								type: field.type,
								options: field.options || null,
								isNullable: field.isNullable,
								defaultValue: field.defaultValue
							};
							
							// Create a user-friendly display name that includes the type
							let typeSuffix = '';
							switch (field.type) {
								case 'TEXT':
									typeSuffix = ' (Text)';
									break;
								case 'NUMBER':
									typeSuffix = ' (Number)';
									break;
								case 'DATE_TIME':
									typeSuffix = ' (Date/Time)';
									break;
								case 'BOOLEAN':
									typeSuffix = ' (Yes/No)';
									break;
								case 'RATING':
									typeSuffix = ' (Rating 1-5)';
									break;
								case 'SELECT':
									typeSuffix = ' (Select One)';
									break;
								case 'MULTI_SELECT':
									typeSuffix = ' (Select Multiple)';
									break;
								case 'EMAILS':
									typeSuffix = ' (Email Addresses)';
									break;
								case 'PHONES':
									typeSuffix = ' (Phone Numbers)';
									break;
								case 'LINKS':
									typeSuffix = ' (Web Links)';
									break;
								case 'FULL_NAME':
									typeSuffix = ' (Full Name)';
									break;
								default:
									typeSuffix = ` (${field.type})`;
							}
							
							const option = {
								name: `${field.label || field.name}${typeSuffix}`,
								value: JSON.stringify(fieldMetadata),
								description: field.description || `${field.type} field${field.isNullable ? ' (optional)' : ' (required)'}`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					// Re-throw the error so user can see what's wrong in n8n UI
					throw new Error(`Failed to load custom properties: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getCustomPropertyOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				// Get the selected property metadata
				const propertyMetadataStr = this.getCurrentNodeParameter('property') as string;
				
				if (!propertyMetadataStr) {
					return returnData;
				}
				
				try {
					const propertyMetadata = JSON.parse(propertyMetadataStr);
					
					if (propertyMetadata.options && Array.isArray(propertyMetadata.options)) {
						for (const option of propertyMetadata.options) {
							returnData.push({
								name: option.label,
								value: option.value,
								description: `Position: ${option.position}`,
							});
						}
					}
				} catch (error) {
					// Return empty array if parsing fails
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getCreatedBySourceOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				// Try to get from field metadata first, if not available fall back to hardcoded values
				try {
					const personStandardId = '20202020-e674-48e5-a542-72570eee7213';
					const endpoint = `/rest/metadata/objects/standard-id/${personStandardId}`;
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (response?.data?.getObjectMetadataByStandardId?.fields) {
						const fields = response.data.getObjectMetadataByStandardId.fields;
						const createdBySourceField = fields.find((field: any) => field.name === 'createdBySource');
						
						if (createdBySourceField?.options && Array.isArray(createdBySourceField.options)) {
							for (const option of createdBySourceField.options) {
								returnData.push({
									name: option.label,
									value: option.value,
									description: `Position: ${option.position}`,
								});
							}
							return returnData.sort((a, b) => a.name.localeCompare(b.name));
						}
					}
				} catch (error) {
					// Fall through to hardcoded values
				}
				
				// Fallback to hardcoded values if API doesn't have the field options
				return [
					{
						name: 'Email',
						value: 'EMAIL',
						description: 'Created from email source',
					},
					{
						name: 'Manual',
						value: 'MANUAL', 
						description: 'Manually created',
					},
				];
			},

			async getCompanyCustomProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const companyStandardId = '20202020-b374-4779-a561-80086cb2e17f';
				const endpoint = `/rest/metadata/objects/standard-id/${companyStandardId}`;
				
				try {
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (!response || !response.data || !response.data.getObjectMetadataByStandardId) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const fields = response.data.getObjectMetadataByStandardId.fields;
					
					if (!Array.isArray(fields)) {
						throw new Error(`Fields is not an array: ${JSON.stringify(fields)}`);
					}
					
					for (const field of fields) {
						if (field.isCustom === true && field.isActive === true && filterFieldMetadata(field, 'create')) {
							const fieldMetadata = {
								name: field.name,
								type: field.type,
								options: field.options || null,
								isNullable: field.isNullable,
								defaultValue: field.defaultValue
							};
							
							let typeSuffix = '';
							switch (field.type) {
								case 'TEXT':
									typeSuffix = ' (Text)';
									break;
								case 'NUMBER':
									typeSuffix = ' (Number)';
									break;
								case 'DATE_TIME':
									typeSuffix = ' (Date/Time)';
									break;
								case 'BOOLEAN':
									typeSuffix = ' (Yes/No)';
									break;
								case 'MULTI_SELECT':
									typeSuffix = ' (Select Multiple)';
									break;
								case 'LINKS':
									typeSuffix = ' (Web Links)';
									break;
								default:
									typeSuffix = ` (${field.type})`;
							}
							
							const option = {
								name: `${field.label || field.name}${typeSuffix}`,
								value: JSON.stringify(fieldMetadata),
								description: field.description || `${field.type} field${field.isNullable ? ' (optional)' : ' (required)'}`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					throw new Error(`Failed to load company custom properties: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getWorkPolicyOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// Try to get from field metadata first, if not available fall back to hardcoded values
				try {
					const companyStandardId = '20202020-b374-4779-a561-80086cb2e17f';
					const endpoint = `/rest/metadata/objects/standard-id/${companyStandardId}`;
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (response?.data?.getObjectMetadataByStandardId?.fields) {
						const fields = response.data.getObjectMetadataByStandardId.fields;
						const workPolicyField = fields.find((field: any) => field.name === 'workPolicy');
						
						if (workPolicyField?.options && Array.isArray(workPolicyField.options)) {
							const returnData: INodePropertyOptions[] = [];
							for (const option of workPolicyField.options) {
								returnData.push({
									name: option.label,
									value: option.value,
									description: `Position: ${option.position}`,
								});
							}
							return returnData.sort((a, b) => a.name.localeCompare(b.name));
						}
					}
				} catch (error) {
					// Fall through to hardcoded values
				}
				
				// Fallback to hardcoded values
				return [
					{
						name: 'On-Site',
						value: 'ON_SITE',
						description: 'Work from company office',
					},
					{
						name: 'Hybrid',
						value: 'HYBRID',
						description: 'Mix of office and remote work',
					},
					{
						name: 'Remote Work',
						value: 'REMOTE_WORK',
						description: 'Work from anywhere',
					},
				];
			},

			async getOpportunityCustomProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const opportunityStandardId = '20202020-9549-49dd-b2b2-883999db8938';
				const endpoint = `/rest/metadata/objects/standard-id/${opportunityStandardId}`;
				
				try {
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (!response || !response.data || !response.data.getObjectMetadataByStandardId) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const fields = response.data.getObjectMetadataByStandardId.fields;
					
					if (!Array.isArray(fields)) {
						throw new Error(`Fields is not an array: ${JSON.stringify(fields)}`);
					}
					
					for (const field of fields) {
						if (field.isCustom === true && field.isActive === true && filterFieldMetadata(field, 'create')) {
							const fieldMetadata = {
								name: field.name,
								type: field.type,
								options: field.options || null,
								isNullable: field.isNullable,
								defaultValue: field.defaultValue
							};
							
							let typeSuffix = '';
							switch (field.type) {
								case 'TEXT':
									typeSuffix = ' (Text)';
									break;
								case 'NUMBER':
									typeSuffix = ' (Number)';
									break;
								case 'DATE_TIME':
									typeSuffix = ' (Date/Time)';
									break;
								case 'BOOLEAN':
									typeSuffix = ' (Yes/No)';
									break;
								case 'SELECT':
									typeSuffix = ' (Select One)';
									break;
								case 'CURRENCY':
									typeSuffix = ' (Currency)';
									break;
								default:
									typeSuffix = ` (${field.type})`;
							}
							
							const option = {
								name: `${field.label || field.name}${typeSuffix}`,
								value: JSON.stringify(fieldMetadata),
								description: field.description || `${field.type} field${field.isNullable ? ' (optional)' : ' (required)'}`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					throw new Error(`Failed to load opportunity custom properties: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getOpportunityStageOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// Try to get from field metadata first, if not available fall back to hardcoded values
				try {
					const opportunityStandardId = '20202020-9549-49dd-b2b2-883999db8938';
					const endpoint = `/rest/metadata/objects/standard-id/${opportunityStandardId}`;
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (response?.data?.getObjectMetadataByStandardId?.fields) {
						const fields = response.data.getObjectMetadataByStandardId.fields;
						const stageField = fields.find((field: any) => field.name === 'stage');
						
						if (stageField?.options && Array.isArray(stageField.options)) {
							const returnData: INodePropertyOptions[] = [];
							for (const option of stageField.options) {
								returnData.push({
									name: option.label,
									value: option.value,
									description: `${option.type} stage - Position: ${option.position}`,
								});
							}
							return returnData.sort((a, b) => a.name.localeCompare(b.name));
						}
					}
				} catch (error) {
					// Fall through to hardcoded values
				}
				
				// Fallback to hardcoded values
				return [
					{
						name: 'Discovery',
						value: 'DISCOVERY',
						description: 'Initial discovery stage',
					},
					{
						name: 'Proposal',
						value: 'PROPOSAL',
						description: 'Proposal stage',
					},
					{
						name: 'Negotiation',
						value: 'NEGOTIATION',
						description: 'Negotiation stage',
					},
					{
						name: 'Closed Won',
						value: 'CLOSED_WON',
						description: 'Successfully closed opportunity',
					},
					{
						name: 'Closed Lost',
						value: 'CLOSED_LOST',
						description: 'Lost opportunity',
					},
				];
			},



			async getTaskStatusOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// Try to get from field metadata first, if not available fall back to hardcoded values
				try {
					const taskStandardId = '20202020-1ba1-48ba-bc83-ef7e5990ed10';
					const endpoint = `/rest/metadata/objects/standard-id/${taskStandardId}`;
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (response?.data?.getObjectMetadataByStandardId?.fields) {
						const fields = response.data.getObjectMetadataByStandardId.fields;
						const statusField = fields.find((field: any) => field.name === 'status');
						
						if (statusField?.options && Array.isArray(statusField.options)) {
							const returnData: INodePropertyOptions[] = [];
							for (const option of statusField.options) {
								returnData.push({
									name: option.label,
									value: option.value,
									description: `${option.color} - Position: ${option.position}`,
								});
							}
							return returnData.sort((a, b) => a.name.localeCompare(b.name));
						}
					}
				} catch (error) {
					// Fall through to hardcoded values
				}
				
				// Fallback to hardcoded values
				return [
					{
						name: 'To Do',
						value: 'TODO',
						description: 'Task is pending',
					},
					{
						name: 'In Progress',
						value: 'IN_PROGRESS',
						description: 'Task is being worked on',
					},
					{
						name: 'Done',
						value: 'DONE',
						description: 'Task is completed',
					},
				];
			},

			async getNoteCustomProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const noteStandardId = '20202020-0b00-45cd-b6f6-6cd806fc6804';
				const endpoint = `/rest/metadata/objects/standard-id/${noteStandardId}`;
				
				try {
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (!response || !response.data || !response.data.getObjectMetadataByStandardId) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const fields = response.data.getObjectMetadataByStandardId.fields;
					
					if (!Array.isArray(fields)) {
						throw new Error(`Fields is not an array: ${JSON.stringify(fields)}`);
					}
					
					for (const field of fields) {
						if (field.isCustom === true && field.isActive === true && filterFieldMetadata(field, 'create')) {
							const fieldMetadata = {
								name: field.name,
								type: field.type,
								options: field.options || null,
								isNullable: field.isNullable,
								defaultValue: field.defaultValue
							};
							
							let typeSuffix = '';
							switch (field.type) {
								case 'TEXT':
									typeSuffix = ' (Text)';
									break;
								case 'NUMBER':
									typeSuffix = ' (Number)';
									break;
								case 'DATE_TIME':
									typeSuffix = ' (Date/Time)';
									break;
								case 'BOOLEAN':
									typeSuffix = ' (Yes/No)';
									break;
								case 'RICH_TEXT_V2':
									typeSuffix = ' (Rich Text)';
									break;
								default:
									typeSuffix = ` (${field.type})`;
							}
							
							const option = {
								name: `${field.label || field.name}${typeSuffix}`,
								value: JSON.stringify(fieldMetadata),
								description: field.description || `${field.type} field${field.isNullable ? ' (optional)' : ' (required)'}`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					throw new Error(`Failed to load note custom properties: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getNoteTargetCustomProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const noteTargetStandardId = '20202020-fff0-4b44-be82-bda313884400';
				const endpoint = `/rest/metadata/objects/standard-id/${noteTargetStandardId}`;
				
				try {
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (!response || !response.data || !response.data.getObjectMetadataByStandardId) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const fields = response.data.getObjectMetadataByStandardId.fields;
					
					if (!Array.isArray(fields)) {
						throw new Error(`Fields is not an array: ${JSON.stringify(fields)}`);
					}
					
					for (const field of fields) {
						// Only include ID fields that are not the main three relationship fields or core system fields
						if (field.isActive === true && 
							field.name.toLowerCase().includes('id') && 
							!['personId', 'companyId', 'opportunityId', 'id', 'noteId'].includes(field.name) &&
							filterFieldMetadata(field, 'create')) {
							
							const fieldMetadata = {
								name: field.name,
								type: field.type,
								options: field.options || null,
								isNullable: field.isNullable,
								defaultValue: field.defaultValue
							};
							
							const option = {
								name: `${field.label || field.name} (ID)`,
								value: JSON.stringify(fieldMetadata),
								description: field.description || `${field.type} field${field.isNullable ? ' (optional)' : ' (required)'}`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					throw new Error(`Failed to load note relation custom properties: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getTaskTargetCustomProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const taskTargetStandardId = '20202020-5a9a-44e8-95df-771cd06d0fb1';
				const endpoint = `/rest/metadata/objects/standard-id/${taskTargetStandardId}`;
				
				try {
					const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
					
					if (!response || !response.data || !response.data.getObjectMetadataByStandardId) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const fields = response.data.getObjectMetadataByStandardId.fields;
					
					if (!Array.isArray(fields)) {
						throw new Error(`Fields is not an array: ${JSON.stringify(fields)}`);
					}
					
					for (const field of fields) {
						// Only include ID fields that are not the main three relationship fields or core system fields
						if (field.isActive === true && 
							field.name.toLowerCase().includes('id') && 
							!['personId', 'companyId', 'opportunityId', 'id', 'taskId'].includes(field.name) &&
							filterFieldMetadata(field, 'create')) {
							
							const fieldMetadata = {
								name: field.name,
								type: field.type,
								options: field.options || null,
								isNullable: field.isNullable,
								defaultValue: field.defaultValue
							};
							
							const option = {
								name: `${field.label || field.name} (ID)`,
								value: JSON.stringify(fieldMetadata),
								description: field.description || `${field.type} field${field.isNullable ? ' (optional)' : ' (required)'}`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					throw new Error(`Failed to load task relation custom properties: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				try {
					const response = await dalilAiApiRequest.call(this, 'GET', '/rest/metadata/pipelines', {});
					
					if (!response || !response.data || !response.data.pipelines) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const pipelines = response.data.pipelines;
					
					if (!Array.isArray(pipelines)) {
						throw new Error(`Pipelines is not an array: ${JSON.stringify(pipelines)}`);
					}
					
					for (const pipeline of pipelines) {
						if (pipeline.isActive === true) {
							// Encode pipeline metadata in the value for later use
							const pipelineMetadata = {
								id: pipeline.id,
								namePlural: pipeline.namePlural,
								labelSingular: pipeline.labelSingular,
								labelPlural: pipeline.labelPlural
							};
							
							const option = {
								name: pipeline.labelPlural || pipeline.namePlural,
								value: JSON.stringify(pipelineMetadata),
								description: pipeline.description || `${pipeline.labelSingular} pipeline`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					throw new Error(`Failed to load pipelines: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getPipelineCustomProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				// Get the selected pipeline metadata
				const selectedPipelineStr = this.getCurrentNodeParameter('selectedPipeline') as string;
				
				if (!selectedPipelineStr) {
					return returnData;
				}
				
				try {
					const pipelineMetadata = JSON.parse(selectedPipelineStr);
					const pipelineId = pipelineMetadata.id;
					
					const response = await dalilAiApiRequest.call(this, 'GET', `/rest/metadata/pipelines/${pipelineId}`, {});
					
					if (!response || !response.data || !response.data.pipeline) {
						throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
					}
					
					const fields = response.data.pipeline.fields;
					
					if (!Array.isArray(fields)) {
						throw new Error(`Fields is not an array: ${JSON.stringify(fields)}`);
					}
					
					for (const field of fields) {
						if (field.isActive === true && filterFieldMetadata(field, 'create')) {
							const fieldMetadata = {
								name: field.name,
								type: field.type,
								options: field.options || null,
								isNullable: field.isNullable,
								defaultValue: field.defaultValue
							};
							
							let typeSuffix = '';
							switch (field.type) {
								case 'TEXT':
									typeSuffix = ' (Text)';
									break;
								case 'NUMBER':
									typeSuffix = ' (Number)';
									break;
								case 'DATE_TIME':
									typeSuffix = ' (Date/Time)';
									break;
								case 'BOOLEAN':
									typeSuffix = ' (Yes/No)';
									break;
								case 'SELECT':
									typeSuffix = ' (Select One)';
									break;
								case 'MULTI_SELECT':
									typeSuffix = ' (Select Multiple)';
									break;
								case 'CURRENCY':
									typeSuffix = ' (Currency)';
									break;
								case 'ACTOR':
									typeSuffix = ' (Actor)';
									break;
								case 'POSITION':
									typeSuffix = ' (Position)';
									break;
								case 'UUID':
									typeSuffix = ' (ID)';
									break;
								default:
									typeSuffix = ` (${field.type})`;
							}
							
							const option = {
								name: `${field.label || field.name}${typeSuffix}`,
								value: JSON.stringify(fieldMetadata),
								description: field.description || `${field.type} field${field.isNullable ? ' (optional)' : ' (required)'}`,
							};
							
							returnData.push(option);
						}
					}
					
				} catch (error) {
					throw new Error(`Failed to load pipeline custom properties: ${error}`);
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getDepthOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// Depth options are typically standard across the API
				return [
					{
						name: '0',
						value: 0,
						description: 'Returns only the primary object information',
					},
					{
						name: '1', 
						value: 1,
						description: 'Returns the primary object along with its directly related objects',
					},
					{
						name: '2',
						value: 2,
						description: 'Returns the primary object, its directly related objects, and the related objects of those related objects',
					},
				];
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'people') {
					if (operation === 'create') {
						// Create person
						const firstName = this.getNodeParameter('firstName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							name: {
								firstName,
							},
						};

						if (additionalFields.lastName) {
							body.name.lastName = additionalFields.lastName;
						}

						if (additionalFields.primaryEmail || (additionalFields.additionalEmails && additionalFields.additionalEmails.length > 0)) {
							body.emails = {
								primaryEmail: additionalFields.primaryEmail || '',
								additionalEmails: additionalFields.additionalEmails || [],
							};
						}

						// Add standard fields
						if (additionalFields.avatarUrl) body.avatarUrl = additionalFields.avatarUrl;
						if (additionalFields.score !== undefined) body.score = additionalFields.score;
						if (additionalFields.visibilityLevel !== undefined) body.visibilityLevel = additionalFields.visibilityLevel;
						if (additionalFields.groupId) body.groupId = additionalFields.groupId;
						if (additionalFields.jobTitle) body.jobTitle = additionalFields.jobTitle;
						if (additionalFields.city) body.city = additionalFields.city;
						if (additionalFields.position !== undefined) body.position = additionalFields.position;
						if (additionalFields.lastContactedAt) body.lastContactedAt = additionalFields.lastContactedAt;
						if (additionalFields.companyId) body.companyId = additionalFields.companyId;
						if (additionalFields.ownerId) body.ownerId = additionalFields.ownerId;

						// Handle LinkedIn
						if (additionalFields.linkedinUrl || additionalFields.linkedinLabel) {
							body.linkedinLink = {
								primaryLinkUrl: additionalFields.linkedinUrl || '',
								primaryLinkLabel: additionalFields.linkedinLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle X (Twitter)
						if (additionalFields.xUrl || additionalFields.xLabel) {
							body.xLink = {
								primaryLinkUrl: additionalFields.xUrl || '',
								primaryLinkLabel: additionalFields.xLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle phones
						if (additionalFields.primaryPhoneNumber) {
							body.phones = {
								primaryPhoneNumber: additionalFields.primaryPhoneNumber,
								primaryPhoneCountryCode: additionalFields.primaryPhoneCountryCode || '',
								primaryPhoneCallingCode: additionalFields.primaryPhoneCallingCode || '',
								additionalPhones: [],
							};
						}

						// Handle created by
						if (additionalFields.createdBySource) {
							body.createdBy = {
								source: additionalFields.createdBySource,
							};
						}

						// Handle custom properties
						if (additionalFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = additionalFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									// Only add the field if it has a value or is nullable
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										// Use default value if available
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/people', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update person
						const personId = this.getNodeParameter('personId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Add update fields
						if (updateFields.firstName || updateFields.lastName) {
							body.name = {
								firstName: updateFields.firstName || '',
								lastName: updateFields.lastName || '',
							};
						}
						if (updateFields.primaryEmail || updateFields.additionalEmails) {
							body.emails = {
								primaryEmail: updateFields.primaryEmail || '',
								additionalEmails: updateFields.additionalEmails || [],
							};
						}
						if (updateFields.avatarUrl !== undefined) body.avatarUrl = updateFields.avatarUrl;
						if (updateFields.score !== undefined) body.score = updateFields.score;
						if (updateFields.visibilityLevel !== undefined) body.visibilityLevel = updateFields.visibilityLevel;
						if (updateFields.groupId !== undefined) body.groupId = updateFields.groupId;
						if (updateFields.jobTitle !== undefined) body.jobTitle = updateFields.jobTitle;
						if (updateFields.city !== undefined) body.city = updateFields.city;
						if (updateFields.position !== undefined) body.position = updateFields.position;
						if (updateFields.lastContactedAt !== undefined) body.lastContactedAt = updateFields.lastContactedAt;
						if (updateFields.companyId !== undefined) body.companyId = updateFields.companyId;
						if (updateFields.ownerId !== undefined) body.ownerId = updateFields.ownerId;

						// Handle LinkedIn
						if (updateFields.linkedinUrl || updateFields.linkedinLabel) {
							body.linkedinLink = {
								primaryLinkUrl: updateFields.linkedinUrl || '',
								primaryLinkLabel: updateFields.linkedinLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle X (Twitter)
						if (updateFields.xUrl || updateFields.xLabel) {
							body.xLink = {
								primaryLinkUrl: updateFields.xUrl || '',
								primaryLinkLabel: updateFields.xLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle phones
						if (updateFields.primaryPhoneNumber) {
							body.phones = {
								primaryPhoneNumber: updateFields.primaryPhoneNumber,
								primaryPhoneCountryCode: updateFields.primaryPhoneCountryCode || '',
								primaryPhoneCallingCode: updateFields.primaryPhoneCallingCode || '',
								additionalPhones: [],
							};
						}

						// Handle created by
						if (updateFields.createdBySource) {
							body.createdBy = {
								source: updateFields.createdBySource,
							};
						}

						// Handle custom properties
						if (updateFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = updateFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									// Only add the field if it has a value or is nullable
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										// Use default value if available
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`/rest/people/${personId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete person
						const personId = this.getNodeParameter('personId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `/rest/people/${personId}`);
						
						returnData.push({
							json: { success: true, id: personId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get person
						const personId = this.getNodeParameter('personId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`/rest/people/${personId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all people
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/people', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/people', {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((person) => {
								returnData.push({
									json: person,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				} else if (resource === 'company') {
					if (operation === 'create') {
						// Create company
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							name,
						};

						// Handle domain name
						if (additionalFields.domainUrl || additionalFields.domainLabel) {
							body.domainName = {
								primaryLinkUrl: additionalFields.domainUrl || '',
								primaryLinkLabel: additionalFields.domainLabel || '',
								secondaryLinks: [],
							};
						}

						// Add standard fields
						if (additionalFields.score !== undefined) body.score = additionalFields.score;
						if (additionalFields.visibilityLevel !== undefined) body.visibilityLevel = additionalFields.visibilityLevel;
						if (additionalFields.groupId) body.groupId = additionalFields.groupId;
						if (additionalFields.industry) body.industry = additionalFields.industry;
						if (additionalFields.employees !== undefined) body.employees = additionalFields.employees;
						if (additionalFields.idealCustomerProfile !== undefined) body.idealCustomerProfile = additionalFields.idealCustomerProfile;
						if (additionalFields.position !== undefined) body.position = additionalFields.position;
						if (additionalFields.accountOwnerId) body.accountOwnerId = additionalFields.accountOwnerId;
						if (additionalFields.tagline) body.tagline = additionalFields.tagline;
						if (additionalFields.visaSponsorship !== undefined) body.visaSponsorship = additionalFields.visaSponsorship;

						// Handle LinkedIn
						if (additionalFields.linkedinUrl || additionalFields.linkedinLabel) {
							body.linkedinLink = {
								primaryLinkUrl: additionalFields.linkedinUrl || '',
								primaryLinkLabel: additionalFields.linkedinLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle X (Twitter)
						if (additionalFields.xUrl || additionalFields.xLabel) {
							body.xLink = {
								primaryLinkUrl: additionalFields.xUrl || '',
								primaryLinkLabel: additionalFields.xLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle ARR
						if (additionalFields.arrAmount !== undefined || additionalFields.currencyCode) {
							body.annualRecurringRevenue = {
								amountMicros: additionalFields.arrAmount || 0,
								currencyCode: additionalFields.currencyCode || 'USD',
							};
						}

						// Handle address
						if (additionalFields.addressStreet1 || additionalFields.addressCity || additionalFields.addressCountry) {
							body.address = {
								addressStreet1: additionalFields.addressStreet1 || '',
								addressStreet2: additionalFields.addressStreet2 || '',
								addressCity: additionalFields.addressCity || '',
								addressPostcode: additionalFields.addressPostcode || '',
								addressState: additionalFields.addressState || '',
								addressCountry: additionalFields.addressCountry || '',
								addressLat: additionalFields.addressLat || 0,
								addressLng: additionalFields.addressLng || 0,
							};
						}

						// Handle intro video
						if (additionalFields.introVideoUrl || additionalFields.introVideoLabel) {
							body.introVideo = {
								primaryLinkUrl: additionalFields.introVideoUrl || '',
								primaryLinkLabel: additionalFields.introVideoLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle work policy
						if (additionalFields.workPolicy && Array.isArray(additionalFields.workPolicy)) {
							body.workPolicy = additionalFields.workPolicy;
						}

						// Handle created by
						if (additionalFields.createdBySource) {
							body.createdBy = {
								source: additionalFields.createdBySource,
							};
						}

						// Handle custom properties
						if (additionalFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = additionalFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/companies', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update company
						const companyId = this.getNodeParameter('companyId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Add update fields
						if (updateFields.name !== undefined) body.name = updateFields.name;
						if (updateFields.domainUrl || updateFields.domainLabel) {
							body.domainName = {
								primaryLinkUrl: updateFields.domainUrl || '',
								primaryLinkLabel: updateFields.domainLabel || '',
								secondaryLinks: [],
							};
						}
						if (updateFields.score !== undefined) body.score = updateFields.score;
						if (updateFields.visibilityLevel !== undefined) body.visibilityLevel = updateFields.visibilityLevel;
						if (updateFields.groupId !== undefined) body.groupId = updateFields.groupId;
						if (updateFields.industry !== undefined) body.industry = updateFields.industry;
						if (updateFields.employees !== undefined) body.employees = updateFields.employees;
						if (updateFields.idealCustomerProfile !== undefined) body.idealCustomerProfile = updateFields.idealCustomerProfile;
						if (updateFields.position !== undefined) body.position = updateFields.position;
						if (updateFields.accountOwnerId !== undefined) body.accountOwnerId = updateFields.accountOwnerId;
						if (updateFields.tagline !== undefined) body.tagline = updateFields.tagline;
						if (updateFields.visaSponsorship !== undefined) body.visaSponsorship = updateFields.visaSponsorship;

						// Handle LinkedIn
						if (updateFields.linkedinUrl || updateFields.linkedinLabel) {
							body.linkedinLink = {
								primaryLinkUrl: updateFields.linkedinUrl || '',
								primaryLinkLabel: updateFields.linkedinLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle X (Twitter)
						if (updateFields.xUrl || updateFields.xLabel) {
							body.xLink = {
								primaryLinkUrl: updateFields.xUrl || '',
								primaryLinkLabel: updateFields.xLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle ARR
						if (updateFields.arrAmount !== undefined || updateFields.currencyCode) {
							body.annualRecurringRevenue = {
								amountMicros: updateFields.arrAmount || 0,
								currencyCode: updateFields.currencyCode || 'USD',
							};
						}

						// Handle address
						if (updateFields.addressStreet1 !== undefined || updateFields.addressCity !== undefined || updateFields.addressCountry !== undefined) {
							body.address = {
								addressStreet1: updateFields.addressStreet1 || '',
								addressStreet2: updateFields.addressStreet2 || '',
								addressCity: updateFields.addressCity || '',
								addressPostcode: updateFields.addressPostcode || '',
								addressState: updateFields.addressState || '',
								addressCountry: updateFields.addressCountry || '',
								addressLat: updateFields.addressLat || 0,
								addressLng: updateFields.addressLng || 0,
							};
						}

						// Handle intro video
						if (updateFields.introVideoUrl || updateFields.introVideoLabel) {
							body.introVideo = {
								primaryLinkUrl: updateFields.introVideoUrl || '',
								primaryLinkLabel: updateFields.introVideoLabel || '',
								secondaryLinks: [],
							};
						}

						// Handle work policy
						if (updateFields.workPolicy && Array.isArray(updateFields.workPolicy)) {
							body.workPolicy = updateFields.workPolicy;
						}

						// Handle created by
						if (updateFields.createdBySource) {
							body.createdBy = {
								source: updateFields.createdBySource,
							};
						}

						// Handle custom properties
						if (updateFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = updateFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`/rest/companies/${companyId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete company
						const companyId = this.getNodeParameter('companyId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `/rest/companies/${companyId}`);
						
						returnData.push({
							json: { success: true, id: companyId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get company
						const companyId = this.getNodeParameter('companyId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`/rest/companies/${companyId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all companies
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/companies', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/companies', {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((company) => {
								returnData.push({
									json: company,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				} else if (resource === 'note') {
					if (operation === 'create') {
						// Create note
						const title = this.getNodeParameter('title', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							title,
						};

						// Add standard fields
						if (additionalFields.position !== undefined) body.position = additionalFields.position;
						if (additionalFields.visibilityLevel !== undefined) body.visibilityLevel = additionalFields.visibilityLevel;
						if (additionalFields.groupId) body.groupId = additionalFields.groupId;
						
						// Handle body formatting
						if (additionalFields.body) {
							const bodyText = additionalFields.body as string;
							body.bodyV2 = {
								markdown: bodyText,
								blocknote: formatTextToBlocknote(bodyText),
							};
						}

						// Handle created by
						if (additionalFields.createdBySource) {
							body.createdBy = {
								source: additionalFields.createdBySource,
							};
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/notes', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update note
						const noteId = this.getNodeParameter('noteId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Add update fields
						if (updateFields.title !== undefined) body.title = updateFields.title;
						if (updateFields.position !== undefined) body.position = updateFields.position;
						if (updateFields.visibilityLevel !== undefined) body.visibilityLevel = updateFields.visibilityLevel;
						if (updateFields.groupId !== undefined) body.groupId = updateFields.groupId;
						
						// Handle body formatting
						if (updateFields.body !== undefined) {
							const bodyText = updateFields.body as string;
							body.bodyV2 = {
								markdown: bodyText,
								blocknote: formatTextToBlocknote(bodyText),
							};
						} 

						// Handle created by
						if (updateFields.createdBySource) {
							body.createdBy = {
								source: updateFields.createdBySource,
							};
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`/rest/notes/${noteId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete note
						const noteId = this.getNodeParameter('noteId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `/rest/notes/${noteId}`);
						
						returnData.push({
							json: { success: true, id: noteId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get note
						const noteId = this.getNodeParameter('noteId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`/rest/notes/${noteId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all notes
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/notes', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/notes', {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((note) => {
								returnData.push({
									json: note,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				} else if (resource === 'noteTarget') {
					if (operation === 'create') {
						// Create note relation
						const noteId = this.getNodeParameter('noteId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							noteId,
						};

						// Add relationship fields
						if (additionalFields.personId) body.personId = additionalFields.personId;
						if (additionalFields.companyId) body.companyId = additionalFields.companyId;
						if (additionalFields.opportunityId) body.opportunityId = additionalFields.opportunityId;
						if (additionalFields.petId) body.petId = additionalFields.petId;
						if (additionalFields.surveyResultId) body.surveyResultId = additionalFields.surveyResultId;

						// Handle custom properties
						if (additionalFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = additionalFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/noteTargets', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update note relation
						const noteTargetId = this.getNodeParameter('noteTargetId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Add update fields
						if (updateFields.noteId !== undefined) body.noteId = updateFields.noteId;
						if (updateFields.personId !== undefined) body.personId = updateFields.personId;
						if (updateFields.companyId !== undefined) body.companyId = updateFields.companyId;
						if (updateFields.opportunityId !== undefined) body.opportunityId = updateFields.opportunityId;
						if (updateFields.petId !== undefined) body.petId = updateFields.petId;
						if (updateFields.surveyResultId !== undefined) body.surveyResultId = updateFields.surveyResultId;

						// Handle custom properties
						if (updateFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = updateFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`/rest/noteTargets/${noteTargetId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete note relation
						const noteTargetId = this.getNodeParameter('noteTargetId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `/rest/noteTargets/${noteTargetId}`);
						
						returnData.push({
							json: { success: true, id: noteTargetId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get note relation
						const noteTargetId = this.getNodeParameter('noteTargetId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`/rest/noteTargets/${noteTargetId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all note relations
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/noteTargets', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/noteTargets', {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((noteTarget) => {
								returnData.push({
									json: noteTarget,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				} else if (resource === 'task') {
					if (operation === 'create') {
						// Create task
						const title = this.getNodeParameter('title', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							title,
						};

						// Add standard fields
						if (additionalFields.position !== undefined) body.position = additionalFields.position;
						if (additionalFields.visibilityLevel !== undefined) body.visibilityLevel = additionalFields.visibilityLevel;
						if (additionalFields.groupId) body.groupId = additionalFields.groupId;
						if (additionalFields.dueAt) body.dueAt = additionalFields.dueAt;
						if (additionalFields.status) body.status = additionalFields.status;
						if (additionalFields.assigneeId) body.assigneeId = additionalFields.assigneeId;

						// Handle body formatting
						if (additionalFields.body) {
							const bodyText = additionalFields.body as string;
							body.bodyV2 = {
								markdown: bodyText,
								blocknote: formatTextToBlocknote(bodyText),
							};
						}

						// Handle created by
						if (additionalFields.createdBySource) {
							body.createdBy = {
								source: additionalFields.createdBySource,
							};
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/tasks', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update task
						const taskId = this.getNodeParameter('taskId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Add update fields
						if (updateFields.title !== undefined) body.title = updateFields.title;
						if (updateFields.position !== undefined) body.position = updateFields.position;
						if (updateFields.visibilityLevel !== undefined) body.visibilityLevel = updateFields.visibilityLevel;
						if (updateFields.groupId !== undefined) body.groupId = updateFields.groupId;
						if (updateFields.dueAt !== undefined) body.dueAt = updateFields.dueAt;
						if (updateFields.status !== undefined) body.status = updateFields.status;
						if (updateFields.assigneeId !== undefined) body.assigneeId = updateFields.assigneeId;

						// Handle body formatting
						if (updateFields.body !== undefined) {
							const bodyText = updateFields.body as string;
							body.bodyV2 = {
								markdown: bodyText,
								blocknote: formatTextToBlocknote(bodyText),
							};
						}

						// Handle created by
						if (updateFields.createdBySource) {
							body.createdBy = {
								source: updateFields.createdBySource,
							};
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`/rest/tasks/${taskId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete task
						const taskId = this.getNodeParameter('taskId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `/rest/tasks/${taskId}`);
						
						returnData.push({
							json: { success: true, id: taskId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get task
						const taskId = this.getNodeParameter('taskId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`/rest/tasks/${taskId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all tasks
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/tasks', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/tasks', {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((task) => {
								returnData.push({
									json: task,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				} else if (resource === 'taskTarget') {
					if (operation === 'create') {
						// Create task relation
						const taskId = this.getNodeParameter('taskId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							taskId,
						};

						// Add relationship fields
						if (additionalFields.personId) body.personId = additionalFields.personId;
						if (additionalFields.companyId) body.companyId = additionalFields.companyId;
						if (additionalFields.opportunityId) body.opportunityId = additionalFields.opportunityId;
						if (additionalFields.petId) body.petId = additionalFields.petId;
						if (additionalFields.surveyResultId) body.surveyResultId = additionalFields.surveyResultId;

						// Handle custom properties
						if (additionalFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = additionalFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/taskTargets', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update task relation
						const taskTargetId = this.getNodeParameter('taskTargetId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Add update fields
						if (updateFields.taskId !== undefined) body.taskId = updateFields.taskId;
						if (updateFields.personId !== undefined) body.personId = updateFields.personId;
						if (updateFields.companyId !== undefined) body.companyId = updateFields.companyId;
						if (updateFields.opportunityId !== undefined) body.opportunityId = updateFields.opportunityId;
						if (updateFields.petId !== undefined) body.petId = updateFields.petId;
						if (updateFields.surveyResultId !== undefined) body.surveyResultId = updateFields.surveyResultId;

						// Handle custom properties
						if (updateFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = updateFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`/rest/taskTargets/${taskTargetId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete task relation
						const taskTargetId = this.getNodeParameter('taskTargetId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `/rest/taskTargets/${taskTargetId}`);
						
						returnData.push({
							json: { success: true, id: taskTargetId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get task relation
						const taskTargetId = this.getNodeParameter('taskTargetId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`/rest/taskTargets/${taskTargetId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all task relations
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/taskTargets', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/taskTargets', {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((taskTarget) => {
								returnData.push({
									json: taskTarget,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				} else if (resource === 'opportunity') {
					if (operation === 'create') {
						// Create opportunity
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							name,
						};

						// Add standard fields
						if (additionalFields.amountMicros !== undefined || additionalFields.currencyCode) {
							body.amount = {
								amountMicros: additionalFields.amountMicros || 0,
								currencyCode: additionalFields.currencyCode || 'USD',
							};
						}
						if (additionalFields.score !== undefined) body.score = additionalFields.score;
						if (additionalFields.visibilityLevel !== undefined) body.visibilityLevel = additionalFields.visibilityLevel;
						if (additionalFields.groupId) body.groupId = additionalFields.groupId;
						if (additionalFields.closeDate) body.closeDate = additionalFields.closeDate;
						if (additionalFields.stage) body.stage = additionalFields.stage;
						if (additionalFields.position !== undefined) body.position = additionalFields.position;
						if (additionalFields.pointOfContactId) body.pointOfContactId = additionalFields.pointOfContactId;
						if (additionalFields.companyId) body.companyId = additionalFields.companyId;
						if (additionalFields.ownerId) body.ownerId = additionalFields.ownerId;

						// Handle created by
						if (additionalFields.createdBySource) {
							body.createdBy = {
								source: additionalFields.createdBySource,
							};
						}

						// Handle custom properties
						if (additionalFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = additionalFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/opportunities', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update opportunity
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Add update fields
						if (updateFields.name !== undefined) body.name = updateFields.name;
						if (updateFields.amountMicros !== undefined || updateFields.currencyCode !== undefined) {
							body.amount = {
								amountMicros: updateFields.amountMicros || 0,
								currencyCode: updateFields.currencyCode || 'USD',
							};
						}
						if (updateFields.score !== undefined) body.score = updateFields.score;
						if (updateFields.visibilityLevel !== undefined) body.visibilityLevel = updateFields.visibilityLevel;
						if (updateFields.groupId !== undefined) body.groupId = updateFields.groupId;
						if (updateFields.closeDate !== undefined) body.closeDate = updateFields.closeDate;
						if (updateFields.stage !== undefined) body.stage = updateFields.stage;
						if (updateFields.position !== undefined) body.position = updateFields.position;
						if (updateFields.pointOfContactId !== undefined) body.pointOfContactId = updateFields.pointOfContactId;
						if (updateFields.companyId !== undefined) body.companyId = updateFields.companyId;
						if (updateFields.ownerId !== undefined) body.ownerId = updateFields.ownerId;

						// Handle created by
						if (updateFields.createdBySource) {
							body.createdBy = {
								source: updateFields.createdBySource,
							};
						}

						// Handle custom properties
						if (updateFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = updateFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`/rest/opportunities/${opportunityId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete opportunity
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `/rest/opportunities/${opportunityId}`);
						
						returnData.push({
							json: { success: true, id: opportunityId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get opportunity
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`/rest/opportunities/${opportunityId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all opportunities
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/opportunities', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', '/rest/opportunities', {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((opportunity) => {
								returnData.push({
									json: opportunity,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				} else if (resource === 'pipeline') {
					// Get pipeline metadata from selected pipeline
					const selectedPipelineStr = this.getNodeParameter('selectedPipeline', i) as string;
					let pipelineMetadata;
					try {
						pipelineMetadata = JSON.parse(selectedPipelineStr);
					} catch (error) {
						throw new Error('Invalid pipeline selection');
					}
					
					const namePlural = pipelineMetadata.namePlural;
					const pipelineEndpoint = `/rest/${namePlural}`;

					if (operation === 'create') {
						// Create pipeline record
						const customPropertiesUi = this.getNodeParameter('customPropertiesUi', i, {}) as any;
						const body: any = {};

						// Handle custom properties
						if (customPropertiesUi?.customPropertiesValues) {
							const customProperties = customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', pipelineEndpoint, body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'update') {
						// Update pipeline record
						const recordId = this.getNodeParameter('recordId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as any;
						const depth = this.getNodeParameter('depth', i) as number;

						const body: any = {};

						// Handle custom properties
						if (updateFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = updateFields.customPropertiesUi.customPropertiesValues as Array<any>;
							
							for (const customProp of customProperties) {
								try {
									const propertyMetadata = parseFieldMetadata(customProp.property);
									if (!propertyMetadata) {
										throw new Error(`Invalid property metadata: ${customProp.property}`);
									}
									
									const fieldName = propertyMetadata.name;
									const fieldValue = processFieldValue(propertyMetadata, customProp);
									
									if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
										body[fieldName] = fieldValue;
									} else if (propertyMetadata.defaultValue !== null && propertyMetadata.defaultValue !== undefined) {
										body[fieldName] = propertyMetadata.defaultValue;
									}
									
								} catch (error) {
									throw new Error(`Failed to process custom property: ${error}`);
								}
							}
						}

						const responseData = await dalilAiApiRequest.call(
							this,
							'PATCH',
							`${pipelineEndpoint}/${recordId}`,
							body,
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'delete') {
						// Delete pipeline record
						const recordId = this.getNodeParameter('recordId', i) as string;
						
						await dalilAiApiRequest.call(this, 'DELETE', `${pipelineEndpoint}/${recordId}`);
						
						returnData.push({
							json: { success: true, id: recordId },
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get pipeline record
						const recordId = this.getNodeParameter('recordId', i) as string;
						const depth = this.getNodeParameter('depth', i) as number;
						
						const responseData = await dalilAiApiRequest.call(
							this,
							'GET',
							`${pipelineEndpoint}/${recordId}`,
							{},
							{ depth },
						);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all pipeline records
						const returnAll = this.getNodeParameter('returnAll', i);
						const options = this.getNodeParameter('options', i, {}) as any;
						
						const query: any = {};
						if (options.orderBy) query.order_by = options.orderBy;
						if (options.filter) query.filter = options.filter;
						if (options.depth !== undefined) query.depth = options.depth;
						if (options.startingAfter) query.starting_after = options.startingAfter;
						if (options.endingBefore) query.ending_before = options.endingBefore;

						let responseData;
						if (returnAll) {
							responseData = await dalilAiApiRequest.call(this, 'GET', pipelineEndpoint, {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							responseData = await dalilAiApiRequest.call(this, 'GET', pipelineEndpoint, {}, query);
						}
						
						// If responseData is an array, add each item
						if (Array.isArray(responseData)) {
							responseData.forEach((record) => {
								returnData.push({
									json: record,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData,
								pairedItem: { item: i },
							});
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as JsonObject).message,
						},
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
} 