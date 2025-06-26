# Dalil AI n8n Node - Complete User Guide

Welcome to the comprehensive guide for using the Dalil AI n8n node. This documentation will help users of all experience levels - from beginners to advanced developers - understand and effectively use the DalilAI n8n node.

## Table of Contents

1. [Overview](#overview)
2. [Authentication Setup](#authentication-setup)
3. [Understanding Resources](#understanding-resources)
4. [Core Concepts](#core-concepts)
5. [Operations Guide](#operations-guide)
6. [Understanding Field Types and Values](#understanding-field-types-and-values)
7. [Query Parameters](#query-parameters)
8. [Triggers and Webhooks](#triggers-and-webhooks)
9. [Advanced Features](#advanced-features)
10. [Troubleshooting](#troubleshooting)

## Overview

The Dalil AI n8n node allows you to seamlessly integrate with the Dalil AI CRM system, enabling automation of customer relationship management tasks. The node supports comprehensive CRUD (Create, Read, Update, Delete) operations across multiple resources and provides real-time webhook notifications for data changes.

### Supported Resources
- **People**: Individual contacts and customers
- **Company**: Organizations and businesses
- **Opportunity**: Sales deals and prospects
- **Task**: To-do items and assignments
- **Note**: Documentation and comments
- **Task Relations**: Link tasks to multiple records
- **Note Relations**: Link notes to multiple records
- **Pipeline**: Workflow stages and processes

## Authentication Setup

Before using the Dalil AI node, you need to configure your API credentials:

1. **Create Credentials**: In your n8n instance, go to Settings > Credentials
2. **Add New Credential**: Select "Dalil AI API"
3. **Configure**:
   - **Base URL**: Your Dalil AI instance URL (e.g., `https://your-instance.dalil.ai`)
   - **API Key**: Your authentication token from Dalil AI settings

## Understanding Resources

### Core Resources

#### People
Represents individual contacts in your CRM.
- **Use Case**: Store customer information, contacts, leads
- **Key Fields**: First Name, Last Name, Email, Phone, Company ID
- **Relationships**: Belongs to Company, has Tasks/Notes

#### Company  
Represents businesses and organizations.
- **Use Case**: Manage client companies, prospects, vendors
- **Key Fields**: Name, Domain URL, Industry, Employees, Address
- **Relationships**: Has People, Opportunities, Tasks/Notes

#### Opportunity
Represents sales deals and revenue opportunities.
- **Use Case**: Track sales pipeline, deals, revenue forecasts
- **Key Fields**: Name, Amount, Stage, Close Date, Company ID
- **Relationships**: Belongs to Company, has Tasks/Notes

#### Task
Represents actionable items and assignments.
- **Use Case**: Track work items, follow-ups, assignments
- **Key Fields**: Title, Body, Status, Due Date, Assignee ID
- **Relationships**: Can be linked to any record via Task Relations

#### Note
Represents documentation and comments.
- **Use Case**: Store meeting notes, customer interactions, documentation
- **Key Fields**: Title, Body, Visibility Level
- **Relationships**: Can be linked to any record via Note Relations

### Relationship Resources

#### Task Relations (taskTarget)
Creates many-to-many relationships between tasks and other records.
- **Purpose**: One task can be related to multiple People, Companies, or Opportunities
- **Use Case**: Project tasks affecting multiple contacts or deals
- **Key Fields**: Task ID, Person ID, Company ID, Opportunity ID

#### Note Relations (noteTarget)  
Creates many-to-many relationships between notes and other records.
- **Purpose**: One note can be related to multiple People, Companies, or Opportunities
- **Use Case**: Meeting notes involving multiple participants or deals
- **Key Fields**: Note ID, Person ID, Company ID, Opportunity ID

#### Pipeline
Defines workflow stages and custom processes.
- **Purpose**: Create custom workflows beyond standard opportunity stages
- **Use Case**: Support tickets, hiring processes, custom workflows
- **Key Fields**: Name, Status, Custom Fields

## Core Concepts

### Operations
Each resource supports standard CRUD operations:

- **Create**: Add new records
- **Create Many**: Bulk create multiple records  
- **Get**: Retrieve a single record by ID
- **Get Many**: Retrieve multiple records with filtering
- **Update**: Modify existing records
- **Delete**: Remove records

### Field Types
Understanding field types is crucial for proper data entry:

#### Standard Field Types
- **TEXT**: Plain text strings (e.g., "John Smith")
- **NUMBER**: Numeric values (e.g., 100, 3.14)
- **BOOLEAN**: True/false values
- **DATE_TIME**: ISO 8601 format dates (e.g., "2024-01-15T10:30:00Z")
- **SELECT**: Single choice from predefined options
- **MULTI_SELECT**: Multiple choices from predefined options
- **RATING**: Scale of 1-5 (represented as "RATING_1" through "RATING_5")

#### Complex Field Types
- **EMAILS**: Email addresses with primary and additional emails
- **PHONES**: Phone numbers with country codes and calling codes
- **LINKS**: URLs with labels and secondary links
- **ADDRESS**: Complete address information
- **FULL_NAME**: First and last name components
- **MONEY**: Amount with currency code (stored in micros)

### Select Values Format
**IMPORTANT**: Select field values must be in uppercase with underscores, not the display labels.

**Frontend Display** → **API Value Required**
- "Lead" → "LEAD"
- "New Customer" → "NEW_CUSTOMER"  
- "In Progress" → "IN_PROGRESS"
- "On Site" → "ON_SITE"
- "Remote Work" → "REMOTE_WORK"

**Example for Opportunity Stage:**
- Display: "Discovery" → Value: "DISCOVERY"
- Display: "Proposal" → Value: "PROPOSAL"
- Display: "Negotiation" → Value: "NEGOTIATION"

## Operations Guide

### Creating Records

#### People - Create
**Required Fields:**
- First Name

**Example:**
```javascript
{
  "firstName": "John",
  "additionalFields": {
    "lastName": "Smith",
    "primaryEmail": "john.smith@company.com",
    "jobTitle": "Software Engineer",
    "companyId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

#### Company - Create
**Required Fields:**
- Company Name

**Example:**
```javascript
{
  "name": "Acme Corp",
  "additionalFields": {
    "domainUrl": "https://acmecorp.com",
    "industry": "Technology",
    "employees": 50,
    "addressStreet1": "123 Main St",
    "addressCity": "San Francisco",
    "addressState": "CA",
    "addressCountry": "United States"
  }
}
```

#### Opportunity - Create
**Required Fields:**
- Name

**Example:**
```javascript
{
  "name": "Q1 Software License Deal",
  "additionalFields": {
    "amount": 50000,
    "currencyCode": "USD",
    "stage": "DISCOVERY",
    "closeDate": "2024-03-31",
    "companyId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

#### Task - Create
**Required Fields:**
- Title

**Example:**
```javascript
{
  "title": "Follow up with client",
  "additionalFields": {
    "body": "Call to discuss proposal feedback",
    "status": "TODO",
    "dueAt": "2024-01-20T15:00:00Z",
    "assigneeId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

#### Note - Create
**Required Fields:**
- Title

**Example:**
```javascript
{
  "title": "Client Meeting Notes",
  "additionalFields": {
    "body": "Discussed project requirements and timeline",
    "visibilityLevel": 1
  }
}
```

### Creating Relationships

#### Task Relations (taskTarget) - Create
Links a task to multiple records:

**Example:**
```javascript
{
  "taskId": "task-uuid-here",
  "personId": "person-uuid-here",
  "companyId": "company-uuid-here",
  "opportunityId": "opportunity-uuid-here"
}
```

#### Note Relations (noteTarget) - Create
Links a note to multiple records:

**Example:**
```javascript
{
  "noteId": "note-uuid-here", 
  "personId": "person-uuid-here",
  "companyId": "company-uuid-here"
}
```

### Bulk Operations

#### Create Many
For bulk creation, provide an array of objects in the same format as single creation:

**Example - Create Many People:**
```javascript
[
  {
    "firstName": "John",
    "lastName": "Smith",
    "primaryEmail": "john@company.com"
  },
  {
    "firstName": "Jane", 
    "lastName": "Doe",
    "primaryEmail": "jane@company.com"
  }
]
```

### Updating Records

Updates require the record ID and any fields you want to modify:

**Example - Update Person:**
```javascript
{
  "personId": "123e4567-e89b-12d3-a456-426614174000",
  "updateFields": {
    "jobTitle": "Senior Software Engineer",
    "primaryEmail": "john.smith.senior@company.com"
  }
}
```

### Getting Records

#### Get Single Record
Requires only the record ID:
- **Person ID**: UUID of the person to retrieve
- **Depth**: Level of related data to include (0, 1, or 2)

#### Get Many Records
Supports filtering, sorting, and pagination:
- **Return All**: Whether to fetch all results or limit
- **Limit**: Maximum records to return (1-60)
- **Filter**: Conditions to filter results
- **Order By**: Sorting criteria
- **Depth**: Level of related data to include

## Understanding Field Types and Values

### Custom Properties
Each resource can have custom fields specific to your workspace. The node dynamically loads available custom properties and shows the expected format.

**Custom Property Types:**
- **Text Fields**: Accept plain strings
- **Select Fields**: Accept predefined values (use API format, not display labels)
- **Multi-Select Fields**: Accept arrays of predefined values
- **Date Fields**: Accept ISO 8601 formatted dates
- **Boolean Fields**: Accept true/false
- **Rating Fields**: Accept "RATING_1" through "RATING_5"

### Complex Field Examples

#### Email Addresses
```javascript
{
  "primaryEmail": "main@company.com",
  "additionalEmails": ["backup@company.com", "personal@email.com"]
}
```

#### Phone Numbers
```javascript
{
  "primaryPhoneNumber": "1234567890",
  "primaryPhoneCountryCode": "US", 
  "primaryPhoneCallingCode": "+1"
}
```

#### LinkedIn/Social Links
```javascript
{
  "linkedinUrl": "https://linkedin.com/in/username",
  "linkedinLabel": "Professional Profile"
}
```

#### Address Information
```javascript
{
  "addressStreet1": "123 Main Street",
  "addressStreet2": "Suite 200",
  "addressCity": "San Francisco",
  "addressPostcode": "94105",
  "addressState": "California", 
  "addressCountry": "United States",
  "addressLat": 37.7749,
  "addressLng": -122.4194
}
```

#### Money/Currency
```javascript
{
  "arrAmount": 50000000, // $50.00 in micros (multiply by 1,000,000)
  "currencyCode": "USD"
}
```

## Query Parameters

### Filtering
Filter results using field conditions with comparators:

**Format:** `field[comparator]:value,field2[comparator]:value2`

**Available Comparators:**
- `eq`: Equal to
- `neq`: Not equal to  
- `gt`: Greater than
- `gte`: Greater than or equal
- `lt`: Less than
- `lte`: Less than or equal
- `in`: In list (comma-separated values)
- `startsWith`: Starts with text
- `like`: Contains text (case-sensitive)
- `ilike`: Contains text (case-insensitive)
- `is`: For NULL/NOT_NULL values
- `containsAny`: For array fields

**Filter Examples:**
```
name[eq]:John Smith
employees[gt]:50
stage[in]:DISCOVERY,PROPOSAL
createdAt[gte]:2024-01-01
email[ilike]:@company.com
city[is]:NOT_NULL
```

**Complex Filters with Conjunctions:**
Use `and`, `or`, `not` to combine conditions:
```
name[eq]:John Smith and (city[eq]:NYC or city[eq]:SF)
not email[is]:NULL
```

### Sorting (Order By)
Sort results by one or more fields:

**Format:** `field1,field2[DIRECTION]`

**Available Directions:**
- `AscNullsFirst`: Ascending, nulls first (default)
- `AscNullsLast`: Ascending, nulls last
- `DescNullsFirst`: Descending, nulls first  
- `DescNullsLast`: Descending, nulls last

**Examples:**
```
createdAt[DescNullsLast]
name,createdAt[DescNullsFirst]
score[DescNullsLast],name[AscNullsLast]
```

### Pagination
Control result pagination:

- **Limit**: 1-60 records per request (default: 60)
- **Starting After**: Cursor for next page
- **Ending Before**: Cursor for previous page

### Depth Levels
Control how much related data to include:

- **Depth 0**: Only the primary object
- **Depth 1**: Primary object + direct relationships (default)
- **Depth 2**: Primary object + relationships + their relationships

**Example:**
- Depth 0: Just the person record
- Depth 1: Person + their company info
- Depth 2: Person + company + company's opportunities

## Triggers and Webhooks

The Dalil AI Trigger node allows you to react to real-time changes in your Dalil AI workspace.

### Setting Up Triggers

1. **Add Trigger Node**: Drag "Dalil AI Trigger" to your workflow
2. **Configure Entity**: Choose which resource to monitor (Company, People, Opportunity, Task)
3. **Configure Action**: Choose which events to listen for (Create, Update, Delete, All)
4. **Save and Activate**: The webhook will be automatically registered

### Trigger Configuration

**Entity Options:**
- **Company**: Monitor company record changes
- **People**: Monitor person record changes  
- **Opportunity**: Monitor opportunity changes
- **Task**: Monitor task changes

**Action Options:**
- **All (*)**: Any change to the entity
- **Create**: New records created
- **Update**: Existing records modified
- **Delete**: Records removed

### Webhook Response Structure

When a trigger fires, you receive a structured webhook payload:

```javascript
[
  {
    "targetUrl": "https://your-n8n-instance.com/webhook/...",
    "eventName": "company.updated",
    "objectMetadata": {
      "id": "8913832e-825b-4374-a527-f9e3524ef3a9",
      "nameSingular": "company"
    },
    "workspaceId": "20202020-1c25-4d02-bf25-6aeccf7ea419",
    "webhookId": "85124f96-2698-4368-8805-c2755070c1c1",
    "eventDate": "2025-06-26T04:51:21.005Z",
    "record": {
      // Complete record data with all fields
      "id": "2f51e0c3-6ed4-4ec7-8ecf-05f0282154fe",
      "name": "Acme Corp",
      "industry": "Technology",
      // ... all other fields
    },
    "updatedFields": [
      "address",
      "industry"
    ]
  }
]
```

### Key Webhook Fields

#### eventName
Identifies the specific event that occurred:
- Format: `{entity}.{action}`
- Examples: `company.created`, `people.updated`, `opportunity.deleted`
- **Use Case**: Filter webhook processing based on event type

#### updatedFields  
Array of field names that were changed (only for update events):
- **Use Case**: Process only specific field changes, ignore others
- **Example**: Only send email notifications when contact info changes

#### record
Complete record data after the change:
- **Create Events**: The newly created record
- **Update Events**: Record with latest values  
- **Delete Events**: The record before deletion

#### eventDate
ISO timestamp of when the event occurred:
- **Use Case**: Order events, detect delayed processing

### Using Webhook Data

**Example - Process Only Email Changes:**
```javascript
// In your workflow's JavaScript code
if (items[0].json.eventName === 'people.updated' && 
    items[0].json.updatedFields.includes('primaryEmail')) {
  // Send notification about email change
  return items;
} else {
  // Skip processing
  return [];
}
```

**Example - Route by Event Type:**
```javascript
const eventName = items[0].json.eventName;
const [entity, action] = eventName.split('.');

if (entity === 'company' && action === 'created') {
  // Handle new company
} else if (entity === 'opportunity' && action === 'updated') {
  // Handle opportunity changes
}
```

## Advanced Features

### Custom Properties
Each resource supports workspace-specific custom fields:

1. **Dynamic Loading**: The node automatically loads available custom properties
2. **Type Awareness**: Shows expected format for each field type
3. **Validation**: Helps prevent format errors

### Batch Operations  
Efficiently process multiple records:

1. **Create Many**: Bulk insert up to the API limit
2. **Consistent Format**: Same structure as single operations, but in arrays
3. **Error Handling**: Partial success handling for batch operations

### Relationship Management
Link records across different resources:

1. **Task Relations**: Associate tasks with multiple people/companies/opportunities
2. **Note Relations**: Associate notes with multiple records
3. **Flexible Linking**: One-to-many and many-to-many relationships

### Pipeline Management
Create custom workflows beyond standard CRM:

1. **Custom Stages**: Define your own process stages
2. **Custom Fields**: Add fields specific to your workflow
3. **Status Tracking**: Monitor progress through your pipeline

## Troubleshooting

### Common Issues

#### Authentication Errors
- **Symptom**: "Unauthorized" or credential errors
- **Solution**: Verify API key and base URL in credentials
- **Check**: Ensure API key has required permissions

#### Field Value Errors  
- **Symptom**: "Invalid value" errors for select fields
- **Solution**: Use API format values, not display labels
- **Example**: Use "IN_PROGRESS" not "In Progress"

#### Date Format Errors
- **Symptom**: Date validation failures  
- **Solution**: Use ISO 8601 format: "2024-01-15T10:30:00Z"
- **Tools**: Use JavaScript `new Date().toISOString()`

#### Relationship Errors
- **Symptom**: "Record not found" when creating relations
- **Solution**: Ensure referenced IDs exist and are valid UUIDs
- **Check**: Verify record existence before creating relations

#### Filter Syntax Errors
- **Symptom**: No results or filter errors
- **Solution**: Check comparator syntax and field names
- **Example**: `name[eq]:value` not `name=value`

### Best Practices

#### Error Handling
1. **Validation**: Check required fields before API calls
2. **Retry Logic**: Implement retries for transient failures  
3. **Logging**: Log API responses for debugging

#### Performance
1. **Batch Operations**: Use Create Many for multiple records
2. **Appropriate Depth**: Only request needed relationship data
3. **Filtering**: Use filters to reduce data transfer

#### Data Integrity  
1. **ID Validation**: Verify UUIDs before relation creation
2. **Field Formats**: Follow documented field type requirements
3. **Custom Properties**: Understand workspace-specific field types

#### Webhook Processing
1. **Event Filtering**: Process only relevant events using eventName
2. **Field Filtering**: Use updatedFields to process specific changes
3. **Idempotency**: Handle duplicate webhook deliveries gracefully

### Getting Help

1. **API Documentation**: Reference the Dalil AI API docs
2. **n8n Community**: Ask questions in n8n community forums  
3. **Testing**: Use n8n's execution view to debug API calls
4. **Logs**: Check n8n logs for detailed error messages

---

This guide provides comprehensive coverage of the Dalil AI n8n node. For specific use cases or advanced configurations, refer to the API documentation or reach out to the support team. 