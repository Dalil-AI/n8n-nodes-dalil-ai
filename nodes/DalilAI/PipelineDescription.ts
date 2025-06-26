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
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple pipeline records',
				action: 'Create many pipeline records',
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
		description: 'Select the pipeline to create a record in',
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
						description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value for the custom property',
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                             pipeline:createMany                            */
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
				operation: ['createMany'],
			},
		},
		default: '',
		description: 'Select the pipeline to create records in',
	},
	{
		displayName: 'Pipeline Records Data',
		name: 'pipelineRecordsData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of pipeline record objects to create',
		placeholder: '[{"fieldName": "value1"}, {"fieldName": "value2"}]',
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
		description: 'Select the pipeline to update a record in',
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
		description: 'ID of the pipeline record to update',
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
								description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property',
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
		description: 'Determines the level of nested related objects to include in the response',
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
		description: 'Select the pipeline to delete a record from',
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
		description: 'ID of the pipeline record to delete',
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
		description: 'Select the pipeline to get a record from',
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
		description: 'ID of the pipeline record to retrieve',
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
		description: 'Determines the level of nested related objects to include in the response',
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
		description: 'Select the pipeline to get records from',
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
		description: 'Whether to return all results or only up to a given limit',
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
				description: 'Sorts objects returned. Format: field_name_1,field_name_2[DIRECTION_2]',
				placeholder: 'createdAt,position[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filters objects returned. Format: field_1[COMPARATOR]:value_1,field_2[COMPARATOR]:value_2',
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