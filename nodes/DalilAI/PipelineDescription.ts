import type { INodeProperties } from 'n8n-workflow';

export const pipelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new pipeline record',
				action: 'Create a pipeline record',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a pipeline record',
				action: 'Delete a pipeline record',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a pipeline record',
				action: 'Get a pipeline record',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many pipeline records',
				action: 'Get many pipeline records',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a pipeline record',
				action: 'Update a pipeline record',
			},
		],
		default: 'create',
	},
];

export const pipelineFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                               pipeline:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Select Pipeline',
		name: 'selectedPipeline',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Choose which pipeline to create a record in (e.g., "Startup Fundraising", "Sales Pipeline", "Recruitment Process")',
	},
	{
		displayName: 'Custom Properties',
		name: 'customPropertiesUi',
		placeholder: 'Add Custom Property',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['create'],
			},
		},
		default: {},
		description: 'Pipeline-specific fields that vary by pipeline type. Each pipeline has unique properties like stage, status, amounts, dates, and custom fields based on the pipeline template.',
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
							loadOptionsMethod: 'getPipelineCustomProperties',
							loadOptionsDependsOn: ['selectedPipeline'],
						},
						default: '',
						description: 'Select a property specific to this pipeline. Properties vary by pipeline type and include stages, statuses, amounts, dates, and other custom fields.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value for the property. Format depends on field type: text (plain text), select fields (e.g., "FUNDED", "DEMO", "SERIES_A"), currency amounts (micros), dates (ISO format), booleans (true/false)',
					},
				],
			},
		],
	},


	/* -------------------------------------------------------------------------- */
	/*                              pipeline:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Select Pipeline',
		name: 'selectedPipeline',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Choose which pipeline contains the record to update (e.g., "Startup Fundraising", "Sales Pipeline", "Recruitment Process")',
	},
	{
		displayName: 'ID',
		name: 'recordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'UUID string of the pipeline record to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Custom Properties',
				name: 'customPropertiesUi',
				placeholder: 'Add Custom Property',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Pipeline-specific fields to update. Each pipeline has unique properties like stage, status, amounts, dates, and custom fields based on the pipeline template.',
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
									loadOptionsMethod: 'getPipelineCustomProperties',
									loadOptionsDependsOn: ['selectedPipeline'],
								},
								default: '',
								description: 'Select a property specific to this pipeline. Properties vary by pipeline type and include stages, statuses, amounts, dates, and other custom fields.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the property. Format depends on field type: text (plain text), select fields (e.g., "FUNDED", "DEMO", "SERIES_A"), currency amounts (micros), dates (ISO format), booleans (true/false)',
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
				resource: ['pipeline'],
				operation: ['update'],
			},
		},
		description: 'Level of nested related objects to include: 0 (record only), 1 (record + direct relations), 2 (record + relations + their relations)',
	},

	/* -------------------------------------------------------------------------- */
	/*                              pipeline:delete                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Select Pipeline',
		name: 'selectedPipeline',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'Choose which pipeline contains the record to delete (e.g., "Startup Fundraising", "Sales Pipeline", "Recruitment Process")',
	},
	{
		displayName: 'ID',
		name: 'recordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'UUID string of the pipeline record to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                pipeline:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Select Pipeline',
		name: 'selectedPipeline',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'Choose which pipeline contains the record to retrieve (e.g., "Startup Fundraising", "Sales Pipeline", "Recruitment Process")',
	},
	{
		displayName: 'ID',
		name: 'recordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'UUID string of the pipeline record to retrieve',
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
				resource: ['pipeline'],
				operation: ['get'],
			},
		},
		description: 'Level of nested related objects to include: 0 (record only), 1 (record + direct relations), 2 (record + relations + their relations)',
	},

	/* -------------------------------------------------------------------------- */
	/*                              pipeline:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Select Pipeline',
		name: 'selectedPipeline',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Choose which pipeline to retrieve records from (e.g., "Startup Fundraising", "Sales Pipeline", "Recruitment Process")',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['pipeline'],
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
				resource: ['pipeline'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 60,
		},
		default: 60,
		description: 'Maximum number of pipeline records to return (1-60)',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				default: '',
				description: 'Sort results by field(s). Format: "field1,field2[Direction]". Directions: AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast. Example: "createdAt,position[DescNullsLast]"',
				placeholder: 'createdAt,position[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter results using field conditions. Format: "field[comparator]:value". Comparators: eq, neq, in, gt, gte, lt, lte, startsWith, like, ilike, is (for NULL/NOT_NULL). Example: "status[eq]:FUNDED,stage[eq]:DEMO"',
				placeholder: 'status[eq]:FUNDED,stage[eq]:DEMO',
			},
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDepthOptions',
				},
				default: 1,
				description: 'Level of nested related objects to include: 0 (records only), 1 (records + direct relations), 2 (records + relations + their relations)',
			},
		],
	},
]; 