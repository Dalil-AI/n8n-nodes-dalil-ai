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
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple opportunities',
				action: 'Create many opportunities',
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
		description: 'The opportunity name',
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
				description: 'Opportunity amount in micros',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: 'USD',
				description: 'Currency code for the amount (e.g., USD, EUR)',
			},


			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Opportunity close date',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunityStageOptions',
				},
				default: 'DISCOVERY',
				description: 'Opportunity stage',
			},


			{
				displayName: 'Point of Contact ID',
				name: 'pointOfContactId',
				type: 'string',
				default: '',
				description: 'ID of the point of contact person',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the associated company',
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
								description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Text value for the custom property',
							},
						],
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                             opportunity:createMany                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunities Data',
		name: 'opportunitiesData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of opportunity objects to create',
		placeholder: '[{"name": "Opportunity Name", "amount": {"amountMicros": 100000, "currencyCode": "USD"}}]',
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
		description: 'ID of the opportunity to update',
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
				description: 'The opportunity name',
			},
			{
				displayName: 'Amount',
				name: 'amountMicros',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Opportunity amount in micros',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: '',
				description: 'Currency code for the amount (e.g., USD, EUR)',
			},



			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Opportunity close date',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunityStageOptions',
				},
				default: 'DISCOVERY',
				description: 'Opportunity stage',
			},


			{
				displayName: 'Point of Contact ID',
				name: 'pointOfContactId',
				type: 'string',
				default: '',
				description: 'ID of the point of contact person',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the associated company',
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
								description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Text value for the custom property',
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
		description: 'Determines the level of nested related objects to include in the response',
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
		description: 'ID of the opportunity to delete',
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
		description: 'ID of the opportunity to retrieve',
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
		description: 'Determines the level of nested related objects to include in the response',
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
			maxValue: 60,
		},
		default: 60,
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
				description: 'Sorts objects returned. Format: field_name_1,field_name_2[DIRECTION_2]',
				placeholder: 'createdAt,name[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filters objects returned. Format: field_1[COMPARATOR]:value_1,field_2[COMPARATOR]:value_2',
				placeholder: 'name[eq]:OpportunityName,score[gt]:5',
			},
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDepthOptions',
				},
				default: 1,
				description: 'Determines the level of nested related objects to include in the response',
			},
			{
				displayName: 'Starting After',
				name: 'startingAfter',
				type: 'string',
				default: '',
				description: 'Cursor for pagination - start after this ID',
			},
			{
				displayName: 'Ending Before',
				name: 'endingBefore',
				type: 'string',
				default: '',
				description: 'Cursor for pagination - end before this ID',
			},
		],
	},
]; 