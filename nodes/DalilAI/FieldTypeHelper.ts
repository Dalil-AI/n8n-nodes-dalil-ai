// Helper functions for handling dynamic field types in Dalil AI

// System fields that should be filtered out from user input
export const SYSTEM_FIELDS = [
	'id',
	'createdAt',
	'updatedAt', 
	'deletedAt',
	'position',
	'createdBy',
	'groupId',
	'visibilityLevel',
	'score',
	'lastContactAt'
];

// Fields that are allowed for creation but not updates (like ID fields)
export const CREATION_ONLY_FIELDS = [
	'id'
];

// Fields that should never be user-editable
export const READONLY_FIELDS = [
	...SYSTEM_FIELDS
];

export interface FieldMetadata {
	name: string;
	type: string;
	options?: Array<{
		id: string;
		label: string;
		value: string;
		position: number;
		color?: string;
	}>;
	isNullable: boolean;
	defaultValue: any;
}

export function parseFieldMetadata(propertyString: string): FieldMetadata | null {
	try {
		return JSON.parse(propertyString);
	} catch (error) {
		return null;
	}
}

export function processFieldValue(fieldMetadata: FieldMetadata, customProp: any): any {
	const fieldType = fieldMetadata.type;
	let fieldValue: any;

	switch (fieldType) {
		case 'TEXT':
		case 'UUID':
		case 'TS_VECTOR':
			fieldValue = customProp.value || '';
			break;

		case 'NUMBER':
		case 'POSITION':
			fieldValue = typeof customProp.value === 'number'
				? customProp.value
				: parseFloat(customProp.value as string) || 0;
			if (!fieldMetadata.isNullable && isNaN(fieldValue)) {
				throw new Error(`Invalid number value for field ${fieldMetadata.name}`);
			}
			break;

		case 'DATE_TIME':
			fieldValue = customProp.value;
			if (!fieldMetadata.isNullable && !fieldValue) {
				throw new Error(`Date is required for field ${fieldMetadata.name}`);
			}
			break;

		case 'BOOLEAN':
			fieldValue = customProp.value === true || customProp.value === 'true';
			break;

		case 'RATING':
		case 'SELECT':
			// For options-based fields, we need to ensure we're using the correct value format
			// The API expects the option value (e.g., 'RATING_1') not the ID
			fieldValue = customProp.value;
			if (!fieldMetadata.isNullable && !fieldValue) {
				throw new Error(`Selection is required for field ${fieldMetadata.name}`);
			}
			break;

		case 'MULTI_SELECT':

			if (Array.isArray(customProp.value)) {
				fieldValue = customProp.value;
			} else if (typeof customProp.value === 'string') {
				try {
					const parsed = JSON.parse(customProp.value);
					if (Array.isArray(parsed)) {
						fieldValue = parsed;
					} else {
						fieldValue = customProp.value.split(',').map((v: string) => v.trim()).filter((v: string) => v !== '');
					}
				} catch (e) {
					fieldValue = customProp.value.split(',').map((v: string) => v.trim()).filter((v: string) => v !== '');
				}
			} else {
				fieldValue = [];
			}

			if (!fieldMetadata.isNullable && fieldValue.length === 0) {
				throw new Error(`At least one selection is required for field ${fieldMetadata.name}`);
			}
			break;

		case 'EMAILS':
			fieldValue = {
				primaryEmail: customProp.emails_primaryEmail || '',
				additionalEmails: customProp.emails_additionalEmails || []
			};
			if (!fieldMetadata.isNullable && !fieldValue.primaryEmail) {
				throw new Error(`Primary email is required for field ${fieldMetadata.name}`);
			}
			break;

		case 'PHONES':
			fieldValue = {
				primaryPhoneNumber: customProp.phones_primaryPhoneNumber || '',
				primaryPhoneCountryCode: customProp.phones_primaryPhoneCountryCode || '',
				primaryPhoneCallingCode: customProp.phones_primaryPhoneCallingCode || '',
				additionalPhones: []
			};
			if (!fieldMetadata.isNullable && !fieldValue.primaryPhoneNumber) {
				throw new Error(`Primary phone number is required for field ${fieldMetadata.name}`);
			}
			break;

		case 'LINKS':
			fieldValue = {
				primaryLinkUrl: customProp.links_primaryLinkUrl || '',
				primaryLinkLabel: customProp.links_primaryLinkLabel || '',
				secondaryLinks: []
			};
			break;

		case 'FULL_NAME':
			fieldValue = {
				firstName: customProp.fullName_firstName || '',
				lastName: customProp.fullName_lastName || ''
			};
			break;

		case 'ACTOR':
			// Actor fields typically have name, source, and context
			fieldValue = {
				name: customProp.actor_name || 'System',
				source: customProp.actor_source || 'MANUAL',
				context: customProp.actor_context || {}
			};
			break;

		default:
			// For unknown types, pass through as-is
			fieldValue = customProp.value;
			break;
	}

	return fieldValue;
}

export function validateFieldValue(fieldMetadata: FieldMetadata, value: any): boolean {
	if (!fieldMetadata.isNullable && (value === null || value === undefined || value === '')) {
		return false;
	}

	switch (fieldMetadata.type) {
		case 'NUMBER':
		case 'POSITION':
			return !isNaN(value);

		case 'EMAILS':
			return value && value.primaryEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.primaryEmail);

		case 'PHONES':
			return value && value.primaryPhoneNumber && value.primaryPhoneNumber.length > 0;

		default:
			return true;
	}
}

/**
 * Check if a field is a system field that should be filtered out
 */
export function isSystemField(fieldName: string): boolean {
	return SYSTEM_FIELDS.includes(fieldName);
}

/**
 * Check if a field should be filtered out for create operations
 */
export function isCreateFilteredField(fieldName: string): boolean {
	return READONLY_FIELDS.includes(fieldName);
}

/**
 * Check if a field should be filtered out for update operations  
 */
export function isUpdateFilteredField(fieldName: string): boolean {
	return READONLY_FIELDS.includes(fieldName);
}

/**
 * Filter out system fields from a field array for custom properties
 */
export function filterSystemFields(fields: any[], operation: 'create' | 'update' = 'create'): any[] {
	return fields.filter(field => {
		const fieldName = field.name;
		
		if (operation === 'create') {
			return !isCreateFilteredField(fieldName);
		} else {
			return !isUpdateFilteredField(fieldName);
		}
	});
}

/**
 * Filter out system fields from field metadata for custom properties
 */
export function filterFieldMetadata(field: any, operation: 'create' | 'update' = 'create'): boolean {
	const fieldName = field.name;
	
	// Always filter out system fields
	if (isSystemField(fieldName)) {
		return false;
	}
	
	// For create operations, filter out ID fields  
	if (operation === 'create' && fieldName === 'id') {
		return false;
	}
	
	return true;
}
