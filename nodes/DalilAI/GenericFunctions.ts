import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function dalilAiApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {
	const credentials = await this.getCredentials('dalilAiApi');
	const baseUrl = credentials.baseUrl || 'http://localhost:3000';
	
	const options = {
		method,
		qs: query,
		headers: {
			'Content-Type': 'application/json',
		},
		uri: uri || `${baseUrl}${endpoint}`,
		body,
		json: true,
	} satisfies IRequestOptions;

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'dalilAiApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function dalilAiApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];
	let responseData;
	
	query.limit = query.limit || 60;
	let hasMore = true;
	
	do {
		responseData = await dalilAiApiRequest.call(this, method, endpoint, body, query);
		
		if (Array.isArray(responseData)) {
			returnData.push(...responseData);
			hasMore = responseData.length === query.limit;
			
			// Update pagination parameters
			if (hasMore && responseData.length > 0) {
				const lastItem = responseData[responseData.length - 1];
				query.startingAfter = lastItem.id;
			}
		} else {
			returnData.push(responseData);
			hasMore = false;
		}
	} while (hasMore);
	
	return returnData;
}

export function cleanEmptyFields(obj: any): any {
	const cleaned: any = {};
	
	for (const key in obj) {
		if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
			if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
				const nested = cleanEmptyFields(obj[key]);
				if (Object.keys(nested).length > 0) {
					cleaned[key] = nested;
				}
			} else {
				cleaned[key] = obj[key];
			}
		}
	}
	
	return cleaned;
} 