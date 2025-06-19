import type { INodeProperties } from 'n8n-workflow';

export const peopleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['people'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new person',
				action: 'Create a person',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple people',
				action: 'Create many people',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a person',
				action: 'Delete a person',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a person',
				action: 'Get a person',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many people',
				action: 'Get many people',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a person',
				action: 'Update a person',
			},
		],
		default: 'create',
	},
];

export const peopleFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                people:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The first name of the person',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The last name of the person',
	},
	{
		displayName: 'Primary Email',
		name: 'primaryEmail',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The primary email address of the person',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['create'],
			},
		},
		options: [
			// Default fields (isCustom: false) from the API
			{
				displayName: 'Avatar URL',
				name: 'avatarUrl',
				type: 'string',
				default: '',
				description: 'URL to the person\'s avatar image',
			},
			{
				displayName: 'Score',
				name: 'score',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 1,
				description: 'CRM score for the person',
			},
			{
				displayName: 'Additional Emails',
				name: 'additionalEmails',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Additional email addresses',
			},
			{
				displayName: 'Visibility Level',
				name: 'visibilityLevel',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 5,
				},
				default: 1,
				description: 'Record visibility level (1-5)',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				description: 'Group ID for visibility',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'LinkedIn profile URL',
			},
			{
				displayName: 'LinkedIn Label',
				name: 'linkedinLabel',
				type: 'string',
				default: '',
				description: 'LinkedIn profile label',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'X (Twitter) profile URL',
			},
			{
				displayName: 'X (Twitter) Label',
				name: 'xLabel',
				type: 'string',
				default: '',
				description: 'X (Twitter) profile label',
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				description: 'Person\'s job title',
			},
			{
				displayName: 'Primary Phone Number',
				name: 'primaryPhoneNumber',
				type: 'string',
				default: '',
				description: 'Primary phone number',
			},
			{
				displayName: 'Primary Phone Country Code',
				name: 'primaryPhoneCountryCode',
				type: 'string',
				default: '',
				description: 'Country code for primary phone (e.g., FR)',
			},
			{
				displayName: 'Primary Phone Calling Code',
				name: 'primaryPhoneCallingCode',
				type: 'string',
				default: '',
				description: 'Calling code for primary phone (e.g., +33)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'Person\'s city',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 1,
				description: 'Person record position',
			},
			{
				displayName: 'Created By Source',
				name: 'createdBySource',
				type: 'options',
				options: [
					{
						name: 'Email',
						value: 'EMAIL',
					},
					{
						name: 'Manual',
						value: 'MANUAL',
					},
				],
				default: 'EMAIL',
				description: 'Source of person creation',
			},
			{
				displayName: 'Last Contacted At',
				name: 'lastContactedAt',
				type: 'dateTime',
				default: '',
				description: 'When the person was last contacted',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of associated company',
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
									loadOptionsMethod: 'getPeopleCustomProperties',
								},
								default: '',
								description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								required: true,
								description: 'Value of the custom property',
							},
						],
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                               people:createMany                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'People Data',
		name: 'peopleData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of people objects to create',
		placeholder: '[{"name": {"firstName": "John", "lastName": "Doe"}, "emails": {"primaryEmail": "john@example.com"}}]',
	},

	/* -------------------------------------------------------------------------- */
	/*                                people:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the person to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'The first name of the person',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The last name of the person',
			},
			{
				displayName: 'Primary Email',
				name: 'primaryEmail',
				type: 'string',
				default: '',
				description: 'The primary email address',
			},
			{
				displayName: 'Avatar URL',
				name: 'avatarUrl',
				type: 'string',
				default: '',
				description: 'URL to the person\'s avatar image',
			},
			{
				displayName: 'Score',
				name: 'score',
				type: 'number',
				default: 0,
				description: 'CRM score for the person',
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				description: 'Person\'s job title',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'Person\'s city',
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
									loadOptionsMethod: 'getPeopleCustomProperties',
								},
								default: '',
								description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								required: true,
								description: 'Value of the custom property',
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
		options: [
			{
				name: '0',
				value: 0,
				description: 'Returns only the primary object information',
			},
			{
				name: '1',
				value: 1,
				description: 'Returns the primary object along with its directly related objects',
			},
			{
				name: '2',
				value: 2,
				description: 'Returns the primary object, its directly related objects, and the related objects of those related objects',
			},
		],
		default: 1,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['update'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                people:delete                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the person to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                people:get                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the person to retrieve',
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'options',
		options: [
			{
				name: '0',
				value: 0,
				description: 'Returns only the primary object information',
			},
			{
				name: '1',
				value: 1,
				description: 'Returns the primary object along with its directly related objects',
			},
			{
				name: '2',
				value: 2,
				description: 'Returns the primary object, its directly related objects, and the related objects of those related objects',
			},
		],
		default: 1,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['get'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                people:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['people'],
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
				resource: ['people'],
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
				resource: ['people'],
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
				placeholder: 'createdAt,firstName[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filters objects returned. Format: field_1[COMPARATOR]:value_1,field_2[COMPARATOR]:value_2',
				placeholder: 'firstName[eq]:John,score[gt]:5',
			},
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'options',
				options: [
					{
						name: '0',
						value: 0,
						description: 'Returns only the primary object information',
					},
					{
						name: '1',
						value: 1,
						description: 'Returns the primary object along with its directly related objects',
					},
					{
						name: '2',
						value: 2,
						description: 'Returns the primary object, its directly related objects, and the related objects of those related objects',
					},
				],
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