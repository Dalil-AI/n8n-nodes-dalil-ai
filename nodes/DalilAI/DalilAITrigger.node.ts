import {
	type IHookFunctions,
	type IWebhookFunctions,
	type IDataObject,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { dalilAiApiRequest } from './GenericFunctions';

const entityOptions = [
	{
		name: 'Company',
		value: 'company',
	},
	{
		name: 'People',
		value: 'people',
	},
	{
		name: 'Opportunity',
		value: 'opportunity',
	},
	{
		name: 'Task',
		value: 'task',
	},
];

const actionOptions = [
	{
		name: 'All',
		value: '*',
		description: 'Any change',
		action: 'Any change',
	},
	{
		name: 'Create',
		value: 'created',
		description: 'Data got created',
		action: 'Data was created',
	},
	{
		name: 'Update',
		value: 'updated',
		description: 'Data got updated',
		action: 'Data was updated',
	},
	{
		name: 'Delete',
		value: 'deleted',
		description: 'Data got deleted',
		action: 'Data was deleted',
	},
];

export class DalilAiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dalil AI Trigger',
		name: 'dalilAiTrigger',
		icon: 'file:dalil-ai.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Dalil AI events occur',
		defaults: {
			name: 'Dalil AI Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'dalilAiApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Entity',
				name: 'entity',
				type: 'options',
				options: entityOptions,
				default: 'company',
				description: 'Type of object to receive notifications about',
			},
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				options: actionOptions,
				default: '*',
				description: 'Type of action to receive notifications about',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Debug: checkExists method called
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const entity = this.getNodeParameter('entity') as string;
				const action = this.getNodeParameter('action') as string;
		
				// Build the operation string based on entity and action
				const operation = entity === '*' && action === '*' ? '*' :
					entity === '*' ? `*.${action}` :
					action === '*' ? `${entity}.*` :
					`${entity}.${action}`;

				// Check if webhook already exists
				const endpoint = '/rest/webhooks';
				const query = {
					filter: `targetUrl[eq]:${webhookUrl}`,
					limit: 60,
				};

				try {
					const responseData = await dalilAiApiRequest.call(this, 'GET', endpoint, {}, query);

					if (responseData && Array.isArray(responseData)) {
						for (const webhook of responseData) {
							if (webhook.targetUrl === webhookUrl && 
								webhook.operations && 
								webhook.operations.includes(operation)) {
								// Webhook exists already
								webhookData.webhookId = webhook.id;
								return true;
							}
						}
					}
				} catch (error) {
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				
				const webhookUrl = this.getNodeWebhookUrl('default');
				const entity = this.getNodeParameter('entity') as string;
				const action = this.getNodeParameter('action') as string;

				// Build the operation string based on entity and action
				const operation = entity === '*' && action === '*' ? '*' :
					entity === '*' ? `*.${action}` :
					action === '*' ? `${entity}.*` :
					`${entity}.${action}`;

				const endpoint = '/rest/webhooks';

				const body: IDataObject = {
					targetUrl: webhookUrl,
					operations: [operation],
					description: `n8n webhook for ${entity} ${action} events`,
					secret: '',
				};

				try {
					const responseData = await dalilAiApiRequest.call(this, 'POST', endpoint, body);

					// Extract webhook ID from nested response structure
					const webhookId = responseData?.data?.createWebhook?.id;
					
					if (webhookId) {
						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookId = webhookId as string;
						
						return true;
					} else {
						return false;
					}
				} catch (error) {
					return false;
				}

				return false;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				
				if (webhookData.webhookId !== undefined) {
					const endpoint = `/rest/webhooks/${webhookData.webhookId}`;

					try {
						await dalilAiApiRequest.call(this, 'DELETE', endpoint, {});
					} catch (error) {
						
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject[])],
		};
	}
} 