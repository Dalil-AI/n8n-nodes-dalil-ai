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
			{
				name: 'Search',
				value: 'search',
				description: 'Search for people by name or email',
				action: 'Search for people',
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
		description: 'The first name of the person (e.g., "John")',
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
			{
				displayName: 'Additional Emails',
				name: 'additionalEmails',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Additional email addresses for the person (each must be a valid email format)',
			},
			{
				displayName: 'Avatar URL',
				name: 'avatarUrl',
				type: 'string',
				default: '',
				description: 'URL to the person\'s avatar image (must be a valid URL starting with http:// or https://)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'Person\'s city of residence or work location (e.g., "New York", "London")',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'UUID string of the associated company',
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
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, rating fields accept "RATING_1" to "RATING_5", multi-select fields accept values like "ON_SITE", "HYBRID", "REMOTE_WORK".',
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
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "NEW_CUSTOMER"), dates (ISO format), booleans (true/false).',
							},
						],
					},
				],
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				description: 'Person\'s job title or position (e.g., "Software Engineer", "Marketing Manager")',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The last name of the person (e.g., "Smith")',
			},
			{
				displayName: 'LinkedIn Label',
				name: 'linkedinLabel',
				type: 'string',
				default: '',
				description: 'Display label for the LinkedIn profile (e.g., "Professional Profile")',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'LinkedIn profile URL (e.g., "https://linkedin.com/in/username")',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				description: 'UUID string of the team member responsible for managing this person',
			},
			{
				displayName: 'Primary Email',
				name: 'primaryEmail',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'The primary email address of the person (must be a valid email format)',
			},
			{
				displayName: 'Primary Phone Calling Code',
				name: 'primaryPhoneCallingCode',
				type: 'string',
				default: '',
				description: 'International calling code with + prefix (e.g., "+1", "+33", "+44")',
			},
			{
				displayName: 'Primary Phone Country Code',
				name: 'primaryPhoneCountryCode',
				type: 'string',
				default: '',
				description: 'Two-letter country code for primary phone (e.g., "US", "FR", "GB")',
			},
			{
				displayName: 'Primary Phone Number',
				name: 'primaryPhoneNumber',
				type: 'string',
				default: '',
				description: 'Primary phone number without country code (e.g., "1234567890")',
			},
			{
				displayName: 'X (Twitter) Label',
				name: 'xLabel',
				type: 'string',
				default: '',
				description: 'Display label for the X (Twitter) profile (e.g., "Twitter Handle")',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'X (Twitter) profile URL (e.g., "https://x.com/username")',
			},
		],
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
		description: 'UUID string of the person to update',
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
				displayName: 'Additional Emails',
				name: 'additionalEmails',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Additional email addresses for the person (each must be a valid email format)',
			},
			{
				displayName: 'Avatar URL',
				name: 'avatarUrl',
				type: 'string',
				default: '',
				description: 'URL to the person\'s avatar image (must be a valid URL starting with http:// or https://)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'Person\'s city of residence or work location (e.g., "New York", "London")',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'UUID string of the associated company',
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
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, rating fields accept "RATING_1" to "RATING_5", multi-select fields accept values like "ON_SITE", "HYBRID", "REMOTE_WORK".',
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
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "NEW_CUSTOMER"), dates (ISO format), booleans (true/false).',
							},
						],
					},
				],
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'The first name of the person (e.g., "John")',
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				description: 'Person\'s job title or position (e.g., "Software Engineer", "Marketing Manager")',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The last name of the person (e.g., "Smith")',
			},
			{
				displayName: 'LinkedIn Label',
				name: 'linkedinLabel',
				type: 'string',
				default: '',
				description: 'Display label for the LinkedIn profile (e.g., "Professional Profile")',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'LinkedIn profile URL (e.g., "https://linkedin.com/in/username")',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				description: 'UUID string of the team member responsible for managing this person',
			},
			{
				displayName: 'Primary Email',
				name: 'primaryEmail',
				type: 'string',
				default: '',
				description: 'The primary email address (must be a valid email format)',
			},
			{
				displayName: 'Primary Phone Calling Code',
				name: 'primaryPhoneCallingCode',
				type: 'string',
				default: '',
				description: 'International calling code with + prefix (e.g., "+1", "+33", "+44")',
			},
			{
				displayName: 'Primary Phone Country Code',
				name: 'primaryPhoneCountryCode',
				type: 'string',
				default: '',
				description: 'Two-letter country code for primary phone (e.g., "US", "FR", "GB")',
			},
			{
				displayName: 'Primary Phone Number',
				name: 'primaryPhoneNumber',
				type: 'string',
				default: '',
				description: 'Primary phone number without country code (e.g., "1234567890")',
			},
			{
				displayName: 'X (Twitter) Label',
				name: 'xLabel',
				type: 'string',
				default: '',
				description: 'Display label for the X (Twitter) profile (e.g., "Twitter Handle")',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'X (Twitter) profile URL (e.g., "https://x.com/username")',
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
				resource: ['people'],
				operation: ['update'],
			},
		},
		description: 'Level of nested related objects to include: 0 (person only), 1 (person + direct relations), 2 (person + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
		description: 'UUID string of the person to delete',
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
		description: 'UUID string of the person to retrieve',
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
				resource: ['people'],
				operation: ['get'],
			},
		},
		description: 'Level of nested related objects to include: 0 (person only), 1 (person + direct relations), 2 (person + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				description: 'Sort results by field(s). Format: "field1,field2[Direction]". Directions: AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast. Example: "createdAt,firstName[DescNullsLast]"',
				placeholder: 'createdAt,firstName[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter results using field conditions. Format: "field[comparator]:value". Comparators: eq, neq, in, gt, gte, lt, lte, startsWith, like, ilike, is (for NULL/NOT_NULL). Example: "firstName[eq]:John,score[gt]:5"',
				placeholder: 'firstName[eq]:John,score[gt]:5',
			},
			{
				displayName: 'Depth Name or ID',
				name: 'depth',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDepthOptions',
				},
				default: '',
				description: 'Level of nested related objects to include: 0 (people only), 1 (people + direct relations), 2 (people + relations + their relations). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                people:search                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search By',
		name: 'searchBy',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['search'],
			},
		},
		options: [
			{
				name: 'Name',
				value: 'name',
			},
			{
				name: 'Email',
				value: 'email',
			},
		],
		default: 'name',
		description: 'Field to search by',
	},
	{
		displayName: 'Name',
		name: 'searchName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['search'],
				searchBy: ['name'],
			},
		},
		default: '',
		description: 'Name of the person to search for (e.g., "John Smith", "Jane")',
	},
	{
		displayName: 'Email',
		name: 'searchEmail',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['search'],
				searchBy: ['email'],
			},
		},
		default: '',
		placeholder: 'name@email.com',
		description: 'Email address to search for',
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['search'],
			},
		},
		default: 0,
		description: 'Depth of the search query',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['people'],
				operation: ['search'],
			},
		},
		default: 1,
		description: 'Maximum number of results to return',
	},
];