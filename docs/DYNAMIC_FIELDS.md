# Dynamic Field Types Implementation Guide

## Overview

This document explains how dynamic field types are implemented in the Dalil AI n8n node, allowing it to adapt to custom fields defined in the Dalil AI system.

## Architecture

### 1. Field Metadata Loading

When the user opens the custom properties dropdown, the node makes an API call to:
```
GET /rest/metadata/objects/standard-id/{personStandardId}
```

This returns metadata about all fields, including custom fields with their types and options.

### 2. Field Type Mapping

The node supports the following field types from Dalil AI:

| Dalil AI Type | n8n Input Type | Description |
|---------------|----------------|-------------|
| TEXT | string | Simple text input |
| NUMBER | number | Numeric input with validation |
| DATE_TIME | dateTime | Date picker |
| BOOLEAN | boolean | Yes/No toggle |
| RATING | options | Dropdown with rating options (1-5) |
| SELECT | options | Single-select dropdown |
| MULTI_SELECT | multiOptions | Multi-select dropdown |
| EMAILS | custom | Multiple fields for email data |
| PHONES | custom | Multiple fields for phone data |
| LINKS | custom | URL and label fields |
| FULL_NAME | custom | First and last name fields |
| UUID | string | UUID string input |
| POSITION | number | Numeric position value |

### 3. Metadata Encoding

Field metadata is JSON-encoded in the property value:
```javascript
{
  name: "performanceRating",
  type: "RATING",
  options: [...],
  isNullable: true,
  defaultValue: null
}
```

### 4. Dynamic UI Rendering

The PeopleDescription.ts file uses `displayOptions` to show/hide fields based on the selected property type:

```typescript
{
  displayName: 'Value',
  name: 'value',
  type: 'options',
  displayOptions: {
    show: {
      propertyType: ['RATING', 'SELECT'],
    },
  },
  typeOptions: {
    loadOptionsMethod: 'getCustomPropertyOptions',
    loadOptionsDependsOn: ['property'],
  },
}
```

### 5. Value Processing

The `FieldTypeHelper.ts` module handles:
- Type conversion
- Validation
- Default value application
- Error handling

## Adding New Field Types

To add support for a new field type:

1. **Update FieldTypeHelper.ts**:
```typescript
case 'NEW_TYPE':
  fieldValue = processNewType(customProp);
  if (!fieldMetadata.isNullable && !isValidNewType(fieldValue)) {
    throw new Error(`Invalid value for field ${fieldMetadata.name}`);
  }
  break;
```

2. **Add UI fields in PeopleDescription.ts**:
```typescript
{
  displayName: 'New Type Value',
  name: 'newtype_value',
  type: 'string',
  displayOptions: {
    show: {
      property: ['/NEW_TYPE/'],
    },
  },
}
```

3. **Update getPeopleCustomProperties** to show type suffix:
```typescript
case 'NEW_TYPE':
  typeSuffix = ' (New Type)';
  break;
```

## Validation

Validation happens at multiple levels:

1. **UI Level**: n8n's built-in type validation
2. **Processing Level**: Custom validation in FieldTypeHelper
3. **API Level**: Server-side validation

## Error Handling

Errors are thrown with descriptive messages:
- "Invalid number value for field {fieldName}"
- "Primary email is required for field {fieldName}"
- "At least one selection is required for field {fieldName}"

## Limitations

Due to n8n's architecture:
- We cannot create truly dynamic UI fields at runtime
- We use a workaround with multiple pre-defined fields shown/hidden based on type
- Complex validations must be done in the execute method

## Future Improvements

1. Support for more complex field types
2. Better visual indicators for field types
3. Client-side validation before execution
4. Support for field dependencies
5. Batch validation for better performance
