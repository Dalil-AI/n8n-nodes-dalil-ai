import type { INodeProperties } from 'n8n-workflow';

export const taskTargetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['taskTarget'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new task relation',
				action: 'Create a task relation',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple task relations',
				action: 'Create many task relations',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a task relation',
				action: 'Delete a task relation',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a task relation',
				action: 'Get a task relation',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many task relations',
				action: 'Get many task relations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a task relation',
				action: 'Update a task relation',
			},
		],
		default: 'create',
	},
];

export const taskTargetFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                            taskTarget:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'ID of the task to link',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'ID of the person to link to the task',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the company to link to the task',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				description: 'ID of the opportunity to link to the task',
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
									loadOptionsMethod: 'getTaskTargetCustomProperties',
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

	/* -------------------------------------------------------------------------- */
	/*                          taskTarget:createMany                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task Relations Data',
		name: 'taskTargetsData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of task relation objects to create',
		placeholder: '[{"taskId": "task-id-here", "personId": "person-id-here"}]',
	},

	/* -------------------------------------------------------------------------- */
	/*                            taskTarget:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task Relation ID',
		name: 'taskTargetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the task relation to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				description: 'ID of the task to link',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'ID of the person to link to the task',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the company to link to the task',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				description: 'ID of the opportunity to link to the task',
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
									loadOptionsMethod: 'getTaskTargetCustomProperties',
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
				resource: ['taskTarget'],
				operation: ['update'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                            taskTarget:delete                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task Relation ID',
		name: 'taskTargetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the task relation to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                              taskTarget:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task Relation ID',
		name: 'taskTargetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the task relation to retrieve',
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
				resource: ['taskTarget'],
				operation: ['get'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                            taskTarget:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['taskTarget'],
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
				resource: ['taskTarget'],
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
				resource: ['taskTarget'],
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
				placeholder: 'createdAt,taskId[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filters objects returned. Format: field_1[COMPARATOR]:value_1,field_2[COMPARATOR]:value_2',
				placeholder: 'taskId[eq]:task-id-here,personId[is]:NOT_NULL',
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