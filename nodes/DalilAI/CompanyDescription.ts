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
		description: 'The company name (e.g., "Acme Corp", "TechStart Inc")',
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
				displayName: 'Domain Name URL',
				name: 'domainUrl',
				type: 'string',
				default: '',
				description: 'The company website URL (e.g., "https://acmecorp.com", "https://techstart.io") - used to fetch company icon',
			},
			{
				displayName: 'Domain Name Label',
				name: 'domainLabel',
				type: 'string',
				default: '',
				description: 'Display label for the company website (e.g., "Corporate Website", "Main Site")',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The company industry or business sector (e.g., "Technology", "Healthcare", "Finance")',
			},
			{
				displayName: 'Employees',
				name: 'employees',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Total number of employees in the company (minimum 1)',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'Company LinkedIn profile URL (e.g., "https://linkedin.com/company/acme-corp")',
			},
			{
				displayName: 'LinkedIn Label',
				name: 'linkedinLabel',
				type: 'string',
				default: '',
				description: 'Display label for the LinkedIn profile (e.g., "Official LinkedIn", "Company Page")',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'Company X (Twitter) profile URL (e.g., "https://x.com/acmecorp")',
			},
			{
				displayName: 'X (Twitter) Label',
				name: 'xLabel',
				type: 'string',
				default: '',
				description: 'Display label for the X (Twitter) profile (e.g., "Official Twitter", "Company Updates")',
			},
			{
				displayName: 'Annual Recurring Revenue Amount',
				name: 'arrAmount',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Annual Recurring Revenue amount in micros (e.g., 1000000 for $1.00, 50000000 for $50.00)',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: 'USD',
				description: 'Three-letter currency code for ARR (e.g., "USD", "EUR", "GBP")',
			},
			{
				displayName: 'Address Street 1',
				name: 'addressStreet1',
				type: 'string',
				default: '',
				description: 'Primary street address line (e.g., "123 Main Street", "456 Business Blvd")',
			},
			{
				displayName: 'Address Street 2',
				name: 'addressStreet2',
				type: 'string',
				default: '',
				description: 'Secondary street address line for suite, floor, etc. (e.g., "Suite 200", "Floor 5")',
			},
			{
				displayName: 'Address City',
				name: 'addressCity',
				type: 'string',
				default: '',
				description: 'City name (e.g., "New York", "San Francisco", "London")',
			},
			{
				displayName: 'Address Postcode',
				name: 'addressPostcode',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code (e.g., "10001", "94105", "SW1A 1AA")',
			},
			{
				displayName: 'Address State',
				name: 'addressState',
				type: 'string',
				default: '',
				description: 'State, province, or region (e.g., "California", "New York", "Ontario")',
			},
			{
				displayName: 'Address Country',
				name: 'addressCountry',
				type: 'string',
				default: '',
				description: 'Country name (e.g., "United States", "Canada", "United Kingdom")',
			},
			{
				displayName: 'Address Latitude',
				name: 'addressLat',
				type: 'number',
				default: 0,
				description: 'Geographic latitude coordinate (decimal degrees, e.g., 40.7128 for NYC)',
			},
			{
				displayName: 'Address Longitude',
				name: 'addressLng',
				type: 'number',
				default: 0,
				description: 'Geographic longitude coordinate (decimal degrees, e.g., -74.0060 for NYC)',
			},
			{
				displayName: 'Ideal Customer Profile',
				name: 'idealCustomerProfile',
				type: 'boolean',
				default: false,
				description: 'Whether this company matches your ideal customer profile criteria (true/false)',
			},

			{
				displayName: 'Created By Source',
				name: 'createdBySource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCreatedBySourceOptions',
				},
				default: 'EMAIL',
				description: 'Source indicating how the company was created (e.g., "EMAIL", "MANUAL", "IMPORT")',
			},
			{
				displayName: 'Account Owner ID',
				name: 'accountOwnerId',
				type: 'string',
				default: '',
				description: 'UUID string of the team member responsible for managing this company account',
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
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, multi-select fields accept values like "ON_SITE", "HYBRID", "REMOTE_WORK", boolean fields accept true/false',
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
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "ENTERPRISE_CLIENT"), dates (ISO format), booleans (true/false)',
							},
						],
					},
				],
			},
		],
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
		description: 'UUID string of the company to update',
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
				description: 'The company name (e.g., "Acme Corp", "TechStart Inc")',
			},
			{
				displayName: 'Domain Name URL',
				name: 'domainUrl',
				type: 'string',
				default: '',
				description: 'Company website URL (e.g., "https://acmecorp.com") - used to fetch company icon',
			},
			{
				displayName: 'Domain Name Label',
				name: 'domainLabel',
				type: 'string',
				default: '',
				description: 'Display label for the company website (e.g., "Corporate Website", "Main Site")',
			},



			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The company industry or business sector (e.g., "Technology", "Healthcare", "Finance")',
			},
			{
				displayName: 'Employees',
				name: 'employees',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Total number of employees in the company (minimum 1)',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'Company LinkedIn profile URL (e.g., "https://linkedin.com/company/acme-corp")',
			},
			{
				displayName: 'LinkedIn Label',
				name: 'linkedinLabel',
				type: 'string',
				default: '',
				description: 'Display label for the LinkedIn profile (e.g., "Official LinkedIn", "Company Page")',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'Company X (Twitter) profile URL (e.g., "https://x.com/acmecorp")',
			},
			{
				displayName: 'X (Twitter) Label',
				name: 'xLabel',
				type: 'string',
				default: '',
				description: 'Display label for the X (Twitter) profile (e.g., "Official Twitter", "Company Updates")',
			},
			{
				displayName: 'Annual Recurring Revenue Amount',
				name: 'arrAmount',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Annual Recurring Revenue amount in micros (e.g., 1000000 for $1.00, 50000000 for $50.00)',
			},
			{
				displayName: 'Currency Code',
				name: 'currencyCode',
				type: 'string',
				default: '',
				description: 'Three-letter currency code for ARR (e.g., "USD", "EUR", "GBP")',
			},
			{
				displayName: 'Address Street 1',
				name: 'addressStreet1',
				type: 'string',
				default: '',
				description: 'Primary street address line (e.g., "123 Main Street", "456 Business Blvd")',
			},
			{
				displayName: 'Address Street 2',
				name: 'addressStreet2',
				type: 'string',
				default: '',
				description: 'Secondary street address line for suite, floor, etc. (e.g., "Suite 200", "Floor 5")',
			},
			{
				displayName: 'Address City',
				name: 'addressCity',
				type: 'string',
				default: '',
				description: 'City name (e.g., "New York", "San Francisco", "London")',
			},
			{
				displayName: 'Address Postcode',
				name: 'addressPostcode',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code (e.g., "10001", "94105", "SW1A 1AA")',
			},
			{
				displayName: 'Address State',
				name: 'addressState',
				type: 'string',
				default: '',
				description: 'State, province, or region (e.g., "California", "New York", "Ontario")',
			},
			{
				displayName: 'Address Country',
				name: 'addressCountry',
				type: 'string',
				default: '',
				description: 'Country name (e.g., "United States", "Canada", "United Kingdom")',
			},
			{
				displayName: 'Address Latitude',
				name: 'addressLat',
				type: 'number',
				default: 0,
				description: 'Geographic latitude coordinate (decimal degrees, e.g., 40.7128 for NYC)',
			},
			{
				displayName: 'Address Longitude',
				name: 'addressLng',
				type: 'number',
				default: 0,
				description: 'Geographic longitude coordinate (decimal degrees, e.g., -74.0060 for NYC)',
			},
			{
				displayName: 'Ideal Customer Profile',
				name: 'idealCustomerProfile',
				type: 'boolean',
				default: false,
				description: 'Whether this company matches your ideal customer profile criteria (true/false)',
			},

			{
				displayName: 'Created By Source',
				name: 'createdBySource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCreatedBySourceOptions',
				},
				default: 'EMAIL',
				description: 'Source indicating how the company was created (e.g., "EMAIL", "MANUAL", "IMPORT")',
			},
			{
				displayName: 'Account Owner ID',
				name: 'accountOwnerId',
				type: 'string',
				default: '',
				description: 'UUID string of the team member responsible for managing this company account',
			},
			{
				displayName: 'Tagline',
				name: 'tagline',
				type: 'string',
				default: '',
				description: 'Company tagline or slogan (e.g., "Innovation at its finest", "Your trusted partner")',
			},
			{
				displayName: 'Intro Video URL',
				name: 'introVideoUrl',
				type: 'string',
				default: '',
				description: 'URL to company introduction video (e.g., "https://youtube.com/watch?v=example")',
			},
			{
				displayName: 'Intro Video Label',
				name: 'introVideoLabel',
				type: 'string',
				default: '',
				description: 'Display label for the intro video (e.g., "Company Overview", "Welcome Video")',
			},
			{
				displayName: 'Work Policy',
				name: 'workPolicy',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getWorkPolicyOptions',
				},
				default: [],
				description: 'Company work policy options. Select multiple values like "ON_SITE", "HYBRID", "REMOTE_WORK"',
			},
			{
				displayName: 'Visa Sponsorship',
				name: 'visaSponsorship',
				type: 'boolean',
				default: false,
				description: 'Whether the company offers visa sponsorship for employees (true/false)',
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
				description: 'Custom fields specific to your workspace. Values depend on field type: text fields accept strings, multi-select fields accept values like "ON_SITE", "HYBRID", "REMOTE_WORK", boolean fields accept true/false',
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
								description: 'Select the custom property from your workspace. Each property has a specific data type and expected value format.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value for the custom property. Format depends on property type: text/number (plain text), select options (e.g., "ENTERPRISE_CLIENT"), dates (ISO format), booleans (true/false)',
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
		description: 'Level of nested related objects to include: 0 (company only), 1 (company + direct relations), 2 (company + relations + their relations)',
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
		description: 'UUID string of the company to delete',
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
		description: 'UUID string of the company to retrieve',
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
		description: 'Level of nested related objects to include: 0 (company only), 1 (company + direct relations), 2 (company + relations + their relations)',
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
		description: 'Whether to return all results or only up to the specified limit (maximum 60 per request)',
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
		description: 'Maximum number of companies to return (1-60)',
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
				description: 'Sort results by field(s). Format: "field1,field2[Direction]". Directions: AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast. Example: "createdAt,name[DescNullsLast]"',
				placeholder: 'createdAt,name[DescNullsLast]',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter results using field conditions. Format: "field[comparator]:value". Comparators: eq, neq, in, gt, gte, lt, lte, startsWith, like, ilike, is (for NULL/NOT_NULL). Example: "name[eq]:CompanyName,employees[gt]:50"',
				placeholder: 'name[eq]:CompanyName,employees[gt]:50',
			},
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDepthOptions',
				},
				default: 1,
				description: 'Level of nested related objects to include: 0 (companies only), 1 (companies + direct relations), 2 (companies + relations + their relations)',
			},
		],
	},
]; 