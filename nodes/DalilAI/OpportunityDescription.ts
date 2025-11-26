import type { INodeProperties } from 'n8n-workflow';

export const opportunityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new opportunity',
				action: 'Create an opportunity',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an opportunity',
				action: 'Delete an opportunity',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an opportunity',
				action: 'Get an opportunity',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many opportunities',
				action: 'Get many opportunities',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an opportunity',
				action: 'Update an opportunity',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for opportunities by name',
				action: 'Search for opportunities',
			},
		],
		default: 'create',
	},
];

export const opportunityFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                               opportunity:create                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The opportunity name (e.g., "Q1 Software License Deal", "Enterprise Implementation Project")',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amountMicros',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Opportunity amount in micros (e.g., 50000000 for $50.00, 1000000 for $1.00)',
			},
			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Expected or actual opportunity close date (ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)',
			},
			{
				displayName: 'Company Name or ID',
				name: 'companyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCompanies',
				},
				noDataExpression: false,
				default: '',
				description: 'UUID string of the company associated with this opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: 'USD',
				description: 'Three-letter currency code for the amount (e.g., "USD", "EUR", "GBP")',
			},
			{
				displayName: 'Custom Properties',
				name: 'customPropertiesUi',
				placeholder: 'Add Custom Property',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, select fields accept specific option values, boolean fields accept true/false.',
				options: [
					{
						name: 'customPropertiesValues',
						displayName: 'Custom Property',
						values: [
							{
								displayName: 'Property Name',
								name: 'property',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getOpportunityCustomProperties',
								},
								default: '',
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "HIGH_PRIORITY"), dates (ISO format), booleans (true/false).',
							},
						],
					},
				],
			},
			{
				displayName: 'Owner Name or ID',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaceMembers',
				},
				noDataExpression: false,
				default: '',
				description: 'UUID string of the team member responsible for managing this opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Point of Contact Name or ID',
				name: 'pointOfContactId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPeople',
				},
				noDataExpression: false,
				default: '',
				description: 'UUID string of the person who is the main point of contact for this opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Stage Name or ID',
				name: 'stage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunityStageOptions',
				},
				noDataExpression: false,
				default: '',
				description: 'Current opportunity stage. Options include "DISCOVERY", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST". Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                               opportunity:update                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity Name or ID',
		name: 'opportunityId',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['update'],
			},
		},
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOpportunities',
		},
		noDataExpression: false,
		default: '',
		description: 'UUID string of the opportunity to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amountMicros',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Opportunity amount in micros (e.g., 50000000 for $50.00, 1000000 for $1.00)',
			},
			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Expected or actual opportunity close date (ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)',
			},
			{
				displayName: 'Company Name or ID',
				name: 'companyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCompanies',
				},
				noDataExpression: false,
				default: '',
				description: 'UUID string of the company associated with this opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: '',
				description: 'Three-letter currency code for the amount (e.g., "USD", "EUR", "GBP")',
			},
			{
				displayName: 'Custom Properties',
				name: 'customPropertiesUi',
				placeholder: 'Add Custom Property',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, select fields accept specific option values, boolean fields accept true/false.',
				options: [
					{
						name: 'customPropertiesValues',
						displayName: 'Custom Property',
						values: [
							{
								displayName: 'Property Name',
								name: 'property',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getOpportunityCustomProperties',
								},
								default: '',
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "HIGH_PRIORITY"), dates (ISO format), booleans (true/false).',
							},
						],
					},
				],
			},
			{
				displayName: 'Opportunity Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The opportunity name (e.g., "Q1 Software License Deal", "Enterprise Implementation Project")',
			},
			{
				displayName: 'Owner Name or ID',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaceMembers',
				},
				noDataExpression: false,
				default: '',
				description: 'UUID string of the team member responsible for managing this opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Point of Contact Name or ID',
				name: 'pointOfContactId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPeople',
				},
				noDataExpression: false,
				default: '',
				description: 'UUID string of the person who is the main point of contact for this opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Stage Name or ID',
				name: 'stage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunityStageOptions',
				},
				noDataExpression: false,
				default: '',
				description: 'Current opportunity stage. Options include "DISCOVERY", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST". Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepthOptions',
		},
		noDataExpression: false,
		default: 0,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['update'],
			},
		},
		description: 'Level of nested related objects to include: 0 (opportunity only), 1 (opportunity + direct relations), 2 (opportunity + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	/* -------------------------------------------------------------------------- */
	/*                               opportunity:delete                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity Name or ID',
		name: 'opportunityId',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['delete'],
			},
		},
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOpportunities',
		},
		noDataExpression: false,
		default: '',
		description: 'UUID string of the opportunity to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                opportunity:get                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity Name or ID',
		name: 'opportunityId',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['get'],
			},
		},
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOpportunities',
		},
		noDataExpression: false,
		default: '',
		description: 'UUID string of the opportunity to retrieve',
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepthOptions',
		},
		noDataExpression: false,
		default: 0,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['get'],
			},
		},
		description: 'Level of nested related objects to include: 0 (opportunity only), 1 (opportunity + direct relations), 2 (opportunity + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	/* -------------------------------------------------------------------------- */
	/*                               opportunity:getAll                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,

		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				default: '',
				description: 'Sort results by field(s). Format: "field1,field2[Direction]". Directions: AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast. Example: "closeDate,name[DescNullsLast]"',
				placeholder: 'closeDate,name[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter results using field conditions. Format: "field[comparator]:value". Comparators: eq, neq, in, gt, gte, lt, lte, startsWith, like, ilike, is (for NULL/NOT_NULL). Example: "stage[eq]:DISCOVERY,amount.amountMicros[gt]:1000000"',
				placeholder: 'stage[eq]:DISCOVERY,amount.amountMicros[gt]:1000000',
			},
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDepthOptions',
				},
				noDataExpression: false,
				default: 0,
				description: 'Level of nested related objects to include: 0 (opportunities only), 1 (opportunities + direct relations), 2 (opportunities + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                               opportunity:search                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity Name',
		name: 'searchName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['search'],
			},
		},
		default: '',
		description: 'Name of the opportunity to search for (e.g., "Q1 Deal", "Enterprise Sale")',
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['search'],
			},
		},
		default: 0,
		description: 'Depth of the search query',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['search'],
			},
		},
		default: 1,
		description: 'Maximum number of results to return',
	},
];