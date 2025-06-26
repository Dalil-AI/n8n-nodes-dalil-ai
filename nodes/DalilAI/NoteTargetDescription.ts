import type { INodeProperties } from 'n8n-workflow';

export const noteTargetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['noteTarget'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new note relation',
				action: 'Create a note relation',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple note relations',
				action: 'Create many note relations',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a note relation',
				action: 'Delete a note relation',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a note relation',
				action: 'Get a note relation',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many note relations',
				action: 'Get many note relations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a note relation',
				action: 'Update a note relation',
			},
		],
		default: 'create',
	},
];

export const noteTargetFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                            noteTarget:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['noteTarget'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'ID of the note to link',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['noteTarget'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'ID of the person to link to the note',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the company to link to the note',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				description: 'ID of the opportunity to link to the note',
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
									loadOptionsMethod: 'getNoteTargetCustomProperties',
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
	/*                          noteTarget:createMany                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note Relations Data',
		name: 'noteTargetsData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['noteTarget'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of note relation objects to create',
		placeholder: '[{"noteId": "note-id-here", "personId": "person-id-here"}]',
	},

	/* -------------------------------------------------------------------------- */
	/*                            noteTarget:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note Relation ID',
		name: 'noteTargetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['noteTarget'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the note relation to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['noteTarget'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Note ID',
				name: 'noteId',
				type: 'string',
				default: '',
				description: 'ID of the note to link',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'ID of the person to link to the note',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the company to link to the note',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				description: 'ID of the opportunity to link to the note',
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
									loadOptionsMethod: 'getNoteTargetCustomProperties',
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
				resource: ['noteTarget'],
				operation: ['update'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                            noteTarget:delete                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note Relation ID',
		name: 'noteTargetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['noteTarget'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the note relation to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                              noteTarget:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Note Relation ID',
		name: 'noteTargetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['noteTarget'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the note relation to retrieve',
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
				resource: ['noteTarget'],
				operation: ['get'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                            noteTarget:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['noteTarget'],
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
				resource: ['noteTarget'],
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
				resource: ['noteTarget'],
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
				placeholder: 'createdAt,noteId[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filters objects returned. Format: field_1[COMPARATOR]:value_1,field_2[COMPARATOR]:value_2',
				placeholder: 'noteId[eq]:note-id-here,personId[is]:NOT_NULL',
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