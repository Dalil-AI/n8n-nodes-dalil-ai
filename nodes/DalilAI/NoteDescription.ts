import type { INodeProperties } from 'n8n-workflow';

export const noteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['note'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new note',
				action: 'Create a note',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple notes',
				action: 'Create many notes',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a note',
				action: 'Delete a note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a note',
				action: 'Get a note',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many notes',
				action: 'Get many notes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a note',
				action: 'Update a note',
			},
		],
		default: 'create',
	},
];

export const noteFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                note:create                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the note',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['note'],
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
				description: 'Note content (will be formatted for bodyV2)',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                               note:createMany                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Notes Data',
		name: 'notesData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of note objects to create',
		placeholder: '[{"title": "Meeting notes", "body": "Discussion about project timeline"}]',
	},

	/* -------------------------------------------------------------------------- */
	/*                                note:update                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the note to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the note',
			},



			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Note content (will be formatted for bodyV2)',
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
				resource: ['note'],
				operation: ['update'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                note:delete                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the note to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                note:get                                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the note to retrieve',
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
				resource: ['note'],
				operation: ['get'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                note:getAll                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['note'],
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
				resource: ['note'],
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
				resource: ['note'],
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
				placeholder: 'title[eq]:Meeting notes,visibilityLevel[gte]:2',
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