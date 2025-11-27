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
// Generate a simple UUID-like string
function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export async function dalilAiApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {
	const baseUrl = 'https://app.usedalil.ai';

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

export async function dalilAiGraphqlRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	query: string,
	variables: any = {},
): Promise<any> {
	const baseUrl = 'https://app.usedalil.ai/';

	const options = {
		method: 'POST' as IHttpRequestMethods,
		headers: {
			'Content-Type': 'application/json',
		},
		uri: `${baseUrl}graphql`,
		body: {
			query,
			variables,
		},
		json: true,
	} satisfies IRequestOptions;

	try {
		const response = await this.helpers.requestWithAuthentication.call(this, 'dalilAiApi', options);
		if (response.errors) {
			throw new NodeApiError(this.getNode(), { errors: response.errors } as JsonObject);
		}
		return response.data;
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

/**
 * Formats plain text into blocknote JSON format
 */
export function formatTextToBlocknote(text: string): string {
	if (!text || text.trim() === '') {
		return JSON.stringify([{
			id: generateUUID(),
			type: 'paragraph',
			props: {
				textColor: 'default',
				backgroundColor: 'default',
				textAlignment: 'left'
			},
			content: [],
			children: []
		}]);
	}

	// Split text by newlines and create a paragraph for each line
	const lines = text.split('\n');
	const blocks = lines.map(line => ({
		id: generateUUID(),
		type: 'paragraph',
		props: {
			textColor: 'default',
			backgroundColor: 'default',
			textAlignment: 'left'
		},
		content: line.trim() === '' ? [] : [{
			type: 'text',
			text: line,
			styles: {}
		}],
		children: []
	}));

	return JSON.stringify(blocks);
} 