import type { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new task',
				action: 'Create a task',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple tasks',
				action: 'Create many tasks',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a task',
				action: 'Delete a task',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a task',
				action: 'Get a task',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tasks',
				action: 'Get many tasks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a task',
				action: 'Update a task',
			},
		],
		default: 'create',
	},
];

export const taskFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                task:create                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the task',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Task content (will be formatted for bodyV2)',
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				description: 'When the task is due',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTaskStatusOptions',
				},
				default: 'TODO',
				description: 'Task status',
			},
			{
				displayName: 'Assignee Name or ID',
				name: 'assigneeId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaceMembers',
				},
				default: '',
				description: 'ID of the task assignee (workspace member). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                              task:createMany                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Tasks Data',
		name: 'tasksData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of task objects to create',
		placeholder: '[{"title": "Complete project", "status": "TODO", "dueAt": "2024-01-01T10:00:00Z"}]',
	},

	/* -------------------------------------------------------------------------- */
	/*                                task:update                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the task to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the task',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Task content (will be formatted for bodyV2)',
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				description: 'When the task is due',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTaskStatusOptions',
				},
				default: 'TODO',
				description: 'Task status',
			},
			{
				displayName: 'Assignee Name or ID',
				name: 'assigneeId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaceMembers',
				},
				default: '',
				description: 'ID of the task assignee (workspace member). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				resource: ['task'],
				operation: ['update'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                task:delete                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the task to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                task:get                                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the task to retrieve',
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
				resource: ['task'],
				operation: ['get'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                task:getAll                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['task'],
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
				resource: ['task'],
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
				resource: ['task'],
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
				placeholder: 'createdAt,title[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filters objects returned. Format: field_1[COMPARATOR]:value_1,field_2[COMPARATOR]:value_2',
				placeholder: 'title[eq]:Complete project,status[eq]:TODO',
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