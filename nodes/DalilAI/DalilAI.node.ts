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

import { dalilAiApiRequest } from './GenericFunctions';
import { peopleFields, peopleOperations } from './PeopleDescription';

export class DalilAI implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dalil AI',
		name: 'dalilAI',
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
						name: 'People',
						value: 'people',
					},
				],
				default: 'people',
			},
			...peopleOperations,
			...peopleFields,
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
					if (field.isCustom === true && field.isActive === true) {
						// Encode field metadata in the value for dynamic type rendering
						const fieldMetadata = {
							name: field.name,
							type: field.type,
							options: field.options || null,
							isNullable: field.isNullable,
							defaultValue: field.defaultValue
						};
						
						const option = {
							name: field.label || field.name,
							value: JSON.stringify(fieldMetadata),
							description: field.description || `${field.type} field`,
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

		async getPeopleCustomPropertiesWithType(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			// This returns the same data but can be used for type-aware components
			const personStandardId = '20202020-e674-48e5-a542-72570eee7213';
			const endpoint = `/rest/metadata/objects/standard-id/${personStandardId}`;
			const returnData: INodePropertyOptions[] = [];
			
			try {
				const response = await dalilAiApiRequest.call(this, 'GET', endpoint, {});
				const fields = response.data.getObjectMetadataByStandardId.fields;
				
				for (const field of fields) {
					if (field.isCustom === true && field.isActive === true) {
						returnData.push({
							name: `${field.label || field.name} (${field.type})`,
							value: field.name,
							description: field.description || `${field.type} field`,
						});
					}
				}
			} catch (error) {
				throw new Error(`Failed to load custom properties: ${error}`);
			}
			
			return returnData.sort((a, b) => a.name.localeCompare(b.name));
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
						const lastName = this.getNodeParameter('lastName', i) as string;
						const primaryEmail = this.getNodeParameter('primaryEmail', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

						const body: any = {
							name: {
								firstName,
								lastName,
							},
							emails: {
								primaryEmail,
								additionalEmails: additionalFields.additionalEmails || [],
							},
						};

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
							const customProperties = additionalFields.customPropertiesUi.customPropertiesValues as Array<{
								property: string;
								value: string;
							}>;
							
							for (const customProp of customProperties) {
								body[customProp.property] = customProp.value;
							}
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/people', body);
						
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});

					} else if (operation === 'createMany') {
						// Create many people
						const peopleData = this.getNodeParameter('peopleData', i) as string;
						let parsedData;
						
						try {
							parsedData = JSON.parse(peopleData);
						} catch (error) {
							throw new Error('Invalid JSON in people data');
						}

						const responseData = await dalilAiApiRequest.call(this, 'POST', '/rest/batch/people', parsedData);
						
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
						if (updateFields.primaryEmail) {
							body.emails = {
								primaryEmail: updateFields.primaryEmail,
								additionalEmails: [],
							};
						}
						if (updateFields.avatarUrl !== undefined) body.avatarUrl = updateFields.avatarUrl;
						if (updateFields.score !== undefined) body.score = updateFields.score;
						if (updateFields.jobTitle !== undefined) body.jobTitle = updateFields.jobTitle;
						if (updateFields.city !== undefined) body.city = updateFields.city;

						// Handle custom properties
						if (updateFields.customPropertiesUi?.customPropertiesValues) {
							const customProperties = updateFields.customPropertiesUi.customPropertiesValues as Array<{
								property: string;
								value: string;
							}>;
							
							for (const customProp of customProperties) {
								body[customProp.property] = customProp.value;
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