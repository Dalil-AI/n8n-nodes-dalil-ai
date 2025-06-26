import type { INodeProperties } from 'n8n-workflow';

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new company',
				action: 'Create a company',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple companies',
				action: 'Create many companies',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a company',
				action: 'Delete a company',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a company',
				action: 'Get a company',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many companies',
				action: 'Get many companies',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a company',
				action: 'Update a company',
			},
		],
		default: 'create',
	},
];

export const companyFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                company:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The company name',
	},
	{
		displayName: 'Domain Name URL',
		name: 'domainUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The company website URL',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Domain Name Label',
				name: 'domainLabel',
				type: 'string',
				default: '',
				description: 'Label for the domain name',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The company industry',
			},
			{
				displayName: 'Employees',
				name: 'employees',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Number of employees in the company',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'Company LinkedIn profile URL',
			},
			{
				displayName: 'LinkedIn Label',
				name: 'linkedinLabel',
				type: 'string',
				default: '',
				description: 'Company LinkedIn profile label',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'Company X (Twitter) profile URL',
			},
			{
				displayName: 'X (Twitter) Label',
				name: 'xLabel',
				type: 'string',
				default: '',
				description: 'Company X (Twitter) profile label',
			},
			{
				displayName: 'Annual Recurring Revenue Amount',
				name: 'arrAmount',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Annual Recurring Revenue amount in micros',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: 'USD',
				description: 'Currency code for ARR (e.g., USD, EUR)',
			},
			{
				displayName: 'Address Street 1',
				name: 'addressStreet1',
				type: 'string',
				default: '',
				description: 'Company address street line 1',
			},
			{
				displayName: 'Address Street 2',
				name: 'addressStreet2',
				type: 'string',
				default: '',
				description: 'Company address street line 2',
			},
			{
				displayName: 'Address City',
				name: 'addressCity',
				type: 'string',
				default: '',
				description: 'Company address city',
			},
			{
				displayName: 'Address Postcode',
				name: 'addressPostcode',
				type: 'string',
				default: '',
				description: 'Company address postcode',
			},
			{
				displayName: 'Address State',
				name: 'addressState',
				type: 'string',
				default: '',
				description: 'Company address state',
			},
			{
				displayName: 'Address Country',
				name: 'addressCountry',
				type: 'string',
				default: '',
				description: 'Company address country',
			},
			{
				displayName: 'Address Latitude',
				name: 'addressLat',
				type: 'number',
				default: 0,
				description: 'Company address latitude',
			},
			{
				displayName: 'Address Longitude',
				name: 'addressLng',
				type: 'number',
				default: 0,
				description: 'Company address longitude',
			},
			{
				displayName: 'Ideal Customer Profile',
				name: 'idealCustomerProfile',
				type: 'boolean',
				default: false,
				description: 'Whether the company is an ideal customer profile',
			},

			{
				displayName: 'Created By Source',
				name: 'createdBySource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCreatedBySourceOptions',
				},
				default: 'EMAIL',
				description: 'Source of company creation',
			},
			{
				displayName: 'Account Owner ID',
				name: 'accountOwnerId',
				type: 'string',
				default: '',
				description: 'ID of the account owner',
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
									loadOptionsMethod: 'getCompanyCustomProperties',
								},
								default: '',
								description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Text value for the custom property',
							},
						],
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                              company:createMany                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Companies Data',
		name: 'companiesData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['createMany'],
			},
		},
		default: '[]',
		description: 'Array of company objects to create',
		placeholder: '[{"name": "Company Name", "domainName": {"primaryLinkUrl": "https://example.com"}}]',
	},

	/* -------------------------------------------------------------------------- */
	/*                                company:update                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the company to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Company Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The company name',
			},
			{
				displayName: 'Domain Name URL',
				name: 'domainUrl',
				type: 'string',
				default: '',
				description: 'Company website URL',
			},
			{
				displayName: 'Domain Name Label',
				name: 'domainLabel',
				type: 'string',
				default: '',
				description: 'Label for the domain name',
			},



			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The company industry',
			},
			{
				displayName: 'Employees',
				name: 'employees',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Number of employees in the company',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'Company LinkedIn profile URL',
			},
			{
				displayName: 'LinkedIn Label',
				name: 'linkedinLabel',
				type: 'string',
				default: '',
				description: 'Company LinkedIn profile label',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'Company X (Twitter) profile URL',
			},
			{
				displayName: 'X (Twitter) Label',
				name: 'xLabel',
				type: 'string',
				default: '',
				description: 'Company X (Twitter) profile label',
			},
			{
				displayName: 'Annual Recurring Revenue Amount',
				name: 'arrAmount',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Annual Recurring Revenue amount in micros',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: '',
				description: 'Currency code for ARR (e.g., USD, EUR)',
			},
			{
				displayName: 'Address Street 1',
				name: 'addressStreet1',
				type: 'string',
				default: '',
				description: 'Company address street line 1',
			},
			{
				displayName: 'Address Street 2',
				name: 'addressStreet2',
				type: 'string',
				default: '',
				description: 'Company address street line 2',
			},
			{
				displayName: 'Address City',
				name: 'addressCity',
				type: 'string',
				default: '',
				description: 'Company address city',
			},
			{
				displayName: 'Address Postcode',
				name: 'addressPostcode',
				type: 'string',
				default: '',
				description: 'Company address postcode',
			},
			{
				displayName: 'Address State',
				name: 'addressState',
				type: 'string',
				default: '',
				description: 'Company address state',
			},
			{
				displayName: 'Address Country',
				name: 'addressCountry',
				type: 'string',
				default: '',
				description: 'Company address country',
			},
			{
				displayName: 'Address Latitude',
				name: 'addressLat',
				type: 'number',
				default: 0,
				description: 'Company address latitude',
			},
			{
				displayName: 'Address Longitude',
				name: 'addressLng',
				type: 'number',
				default: 0,
				description: 'Company address longitude',
			},
			{
				displayName: 'Ideal Customer Profile',
				name: 'idealCustomerProfile',
				type: 'boolean',
				default: false,
				description: 'Whether the company is an ideal customer profile',
			},

			{
				displayName: 'Created By Source',
				name: 'createdBySource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCreatedBySourceOptions',
				},
				default: 'EMAIL',
				description: 'Source of company creation',
			},
			{
				displayName: 'Account Owner ID',
				name: 'accountOwnerId',
				type: 'string',
				default: '',
				description: 'ID of the account owner',
			},
			{
				displayName: 'Tagline',
				name: 'tagline',
				type: 'string',
				default: '',
				description: 'Company tagline',
			},
			{
				displayName: 'Intro Video URL',
				name: 'introVideoUrl',
				type: 'string',
				default: '',
				description: 'Company intro video URL',
			},
			{
				displayName: 'Intro Video Label',
				name: 'introVideoLabel',
				type: 'string',
				default: '',
				description: 'Company intro video label',
			},
			{
				displayName: 'Work Policy',
				name: 'workPolicy',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getWorkPolicyOptions',
				},
				default: [],
				description: 'Company work policy options',
			},
			{
				displayName: 'Visa Sponsorship',
				name: 'visaSponsorship',
				type: 'boolean',
				default: false,
				description: 'Whether the company offers visa sponsorship',
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
									loadOptionsMethod: 'getCompanyCustomProperties',
								},
								default: '',
								description: 'Name of the custom property. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Text value for the custom property',
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
				resource: ['company'],
				operation: ['update'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                company:delete                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the company to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                company:get                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the company to retrieve',
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
				resource: ['company'],
				operation: ['get'],
			},
		},
		description: 'Determines the level of nested related objects to include in the response',
	},

	/* -------------------------------------------------------------------------- */
	/*                                company:getAll                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['company'],
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
				resource: ['company'],
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
				resource: ['company'],
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
				placeholder: 'createdAt,name[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filters objects returned. Format: field_1[COMPARATOR]:value_1,field_2[COMPARATOR]:value_2',
				placeholder: 'name[eq]:CompanyName,score[gt]:5',
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