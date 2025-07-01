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
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: 'USD',
				description: 'Three-letter currency code for the amount (e.g., "USD", "EUR", "GBP")',
			},


			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Expected or actual opportunity close date (ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunityStageOptions',
				},
				default: 'DISCOVERY',
				description: 'Current opportunity stage. Options include "DISCOVERY", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"',
			},


			{
				displayName: 'Point of Contact ID',
				name: 'pointOfContactId',
				type: 'string',
				default: '',
				description: 'UUID string of the person who is the main point of contact for this opportunity',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'UUID string of the company associated with this opportunity',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				description: 'UUID string of the team member responsible for managing this opportunity',
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
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, select fields accept specific option values, boolean fields accept true/false',
				options: [
					{
						name: 'customPropertiesValues',
						displayName: 'Custom Property',
						values: [
							{
								displayName: 'Property Name or ID',
								name: 'property',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getOpportunityCustomProperties',
								},
								default: '',
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "HIGH_PRIORITY"), dates (ISO format), booleans (true/false)',
							},
						],
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                               opportunity:update                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['update'],
			},
		},
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
				displayName: 'Opportunity Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The opportunity name (e.g., "Q1 Software License Deal", "Enterprise Implementation Project")',
			},
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
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: '',
				description: 'Three-letter currency code for the amount (e.g., "USD", "EUR", "GBP")',
			},



			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Expected or actual opportunity close date (ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunityStageOptions',
				},
				default: 'DISCOVERY',
				description: 'Current opportunity stage. Options include "DISCOVERY", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"',
			},


			{
				displayName: 'Point of Contact ID',
				name: 'pointOfContactId',
				type: 'string',
				default: '',
				description: 'UUID string of the person who is the main point of contact for this opportunity',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'UUID string of the company associated with this opportunity',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				description: 'UUID string of the team member responsible for managing this opportunity',
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
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, select fields accept specific option values, boolean fields accept true/false',
				options: [
					{
						name: 'customPropertiesValues',
						displayName: 'Custom Property',
						values: [
							{
								displayName: 'Property Name or ID',
								name: 'property',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getOpportunityCustomProperties',
								},
								default: '',
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "HIGH_PRIORITY"), dates (ISO format), booleans (true/false)',
							},
						],
					},
				],
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
		default: 1,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['update'],
			},
		},
		description: 'Level of nested related objects to include: 0 (opportunity only), 1 (opportunity + direct relations), 2 (opportunity + relations + their relations)',
	},

	/* -------------------------------------------------------------------------- */
	/*                               opportunity:delete                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'UUID string of the opportunity to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                opportunity:get                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['get'],
			},
		},
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
		default: 1,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['get'],
			},
		},
		description: 'Level of nested related objects to include: 0 (opportunity only), 1 (opportunity + direct relations), 2 (opportunity + relations + their relations)',
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
		description: 'Whether to return all results or only up to the specified limit (maximum 60 per request)',
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
			maxValue: 60,
		},
		default: 60,
		description: 'Maximum number of opportunities to return (1-60)',
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
				default: 1,
				description: 'Level of nested related objects to include: 0 (opportunities only), 1 (opportunities + direct relations), 2 (opportunities + relations + their relations)',
			},
		],
	},
]; 