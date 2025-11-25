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
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTasks',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'UUID string of the task to link to a record (person, company, or opportunity). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				displayName: 'Company Name or ID',
				name: 'companyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCompanies',
				},
				default: '',
				description: 'UUID string of the company to link to the task. Leave empty if linking to person or opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				description: 'Additional custom fields specific to task targets. These vary based on your workspace configuration.',
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
								description: 'Select a custom property for task targets. Available properties depend on your workspace configuration. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on field type: text (plain text), select fields (specific values), dates (ISO format), booleans (true/false).',
							},
						],
					},
				],
			},
			{
				displayName: 'Opportunity Name or ID',
				name: 'opportunityId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunities',
				},
				default: '',
				description: 'UUID string of the opportunity to link to the task. Leave empty if linking to person or company. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Person Name or ID',
				name: 'personId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPeople',
				},
				default: '',
				description: 'UUID string of the person to link to the task. Leave empty if linking to company or opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
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
		description: 'UUID string of the task relation to update',
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
				displayName: 'Company Name or ID',
				name: 'companyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCompanies',
				},
				default: '',
				description: 'UUID string of the company to link to the task. Leave empty if linking to person or opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				description: 'Additional custom fields specific to task targets. These vary based on your workspace configuration.',
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
								description: 'Select a custom property for task targets. Available properties depend on your workspace configuration. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on field type: text (plain text), select fields (specific values), dates (ISO format), booleans (true/false).',
							},
						],
					},
				],
			},
			{
				displayName: 'Opportunity Name or ID',
				name: 'opportunityId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOpportunities',
				},
				default: '',
				description: 'UUID string of the opportunity to link to the task. Leave empty if linking to person or company. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Person Name or ID',
				name: 'personId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPeople',
				},
				default: '',
				description: 'UUID string of the person to link to the task. Leave empty if linking to company or opportunity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Task Name or ID',
				name: 'taskId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTasks',
				},
				default: '',
				description: 'UUID string of the task to link to a record (person, company, or opportunity). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
	{
		displayName: 'Depth Name or ID',
		name: 'depth',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepthOptions',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['update'],
			},
		},
		description: 'Level of nested related objects to include: 0 (task relation only), 1 (task relation + direct relations), 2 (task relation + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
		description: 'UUID string of the task relation to delete',
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
		description: 'UUID string of the task relation to retrieve',
	},
	{
		displayName: 'Depth Name or ID',
		name: 'depth',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepthOptions',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['taskTarget'],
				operation: ['get'],
			},
		},
		description: 'Level of nested related objects to include: 0 (task relation only), 1 (task relation + direct relations), 2 (task relation + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				description: 'Sort results by field(s). Format: "field1,field2[Direction]". Directions: AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast. Example: "createdAt,taskId[DescNullsLast]"',
				placeholder: 'createdAt,taskId[DescNullsLast]',
			},
		],
	},
]; 