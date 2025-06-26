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
		description: 'UUID string of the note to link to a record (person, company, or opportunity)',
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
				description: 'UUID string of the person to link to the note. Leave empty if linking to company or opportunity.',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'UUID string of the company to link to the note. Leave empty if linking to person or opportunity.',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				description: 'UUID string of the opportunity to link to the note. Leave empty if linking to person or company.',
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
				description: 'Additional custom fields specific to note targets. These vary based on your workspace configuration.',
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
								description: 'Select a custom property for note targets. Available properties depend on your workspace configuration.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on field type: text (plain text), select fields (specific values), dates (ISO format), booleans (true/false)',
							},
						],
					},
				],
			},
		],
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
		description: 'UUID string of the note relation to update',
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
				description: 'UUID string of the note to link to a record (person, company, or opportunity)',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'UUID string of the person to link to the note. Leave empty if linking to company or opportunity.',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'UUID string of the company to link to the note. Leave empty if linking to person or opportunity.',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				description: 'UUID string of the opportunity to link to the note. Leave empty if linking to person or company.',
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
				description: 'Additional custom fields specific to note targets. These vary based on your workspace configuration.',
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
								description: 'Select a custom property for note targets. Available properties depend on your workspace configuration.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on field type: text (plain text), select fields (specific values), dates (ISO format), booleans (true/false)',
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
		description: 'Level of nested related objects to include: 0 (note relation only), 1 (note relation + direct relations), 2 (note relation + relations + their relations)',
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
		description: 'UUID string of the note relation to delete',
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
		description: 'UUID string of the note relation to retrieve',
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
		description: 'Level of nested related objects to include: 0 (note relation only), 1 (note relation + direct relations), 2 (note relation + relations + their relations)',
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
		description: 'Whether to return all results or only up to the specified limit (maximum 60 per request)',
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
		description: 'Maximum number of note relations to return (1-60)',
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
				description: 'Sort results by field(s). Format: "field1,field2[Direction]". Directions: AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast. Example: "createdAt,noteId[DescNullsLast]"',
				placeholder: 'createdAt,noteId[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter results using field conditions. Format: "field[comparator]:value". Comparators: eq, neq, in, gt, gte, lt, lte, startsWith, like, ilike, is (for NULL/NOT_NULL). Example: "noteId[eq]:note-uuid,personId[is]:NOT_NULL"',
				placeholder: 'noteId[eq]:note-uuid,personId[is]:NOT_NULL',
			},
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDepthOptions',
				},
				default: 1,
				description: 'Level of nested related objects to include: 0 (note relations only), 1 (note relations + direct relations), 2 (note relations + relations + their relations)',
			},
		],
	},
]; 