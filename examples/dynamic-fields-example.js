// Example: How to Use Dynamic Custom Fields in Dalil AI Node

// When you select a custom property in the n8n UI, you'll see:
// 1. The field name with its type in parentheses
// 2. A description indicating if it's required or optional
// 3. The appropriate input control based on the field type

// Example 1: Creating a person with various custom field types
const personData = {
  // Required fields
  firstName: "Jane",
  lastName: "Smith",
  primaryEmail: "jane.smith@company.com",
  
  // Additional fields including custom properties
  additionalFields: {
    // Standard fields
    jobTitle: "Product Manager",
    city: "New York",
    score: 85,
    
    // Custom properties
    customPropertiesUi: {
      customPropertiesValues: [
        // TEXT field example
        {
          property: JSON.stringify({
            name: "intro",
            type: "TEXT",
            isNullable: false,
            defaultValue: ""
          }),
          value: "Experienced PM with 10 years in SaaS"
        },
        
        // RATING field example (1-5 scale)
        {
          property: JSON.stringify({
            name: "performanceRating",
            type: "RATING",
            options: [
              { value: "RATING_1", label: "1" },
              { value: "RATING_2", label: "2" },
              { value: "RATING_3", label: "3" },
              { value: "RATING_4", label: "4" },
              { value: "RATING_5", label: "5" }
            ],
            isNullable: true
          }),
          value: "RATING_4" // Selected from dropdown
        },
        
        // MULTI_SELECT field example
        {
          property: JSON.stringify({
            name: "workPreference",
            type: "MULTI_SELECT",
            options: [
              { value: "ON_SITE", label: "On-Site" },
              { value: "HYBRID", label: "Hybrid" },
              { value: "REMOTE_WORK", label: "Remote Work" }
            ],
            isNullable: true
          }),
          value: ["HYBRID", "REMOTE_WORK"] // Multiple selections
        },
        
        // PHONES field example
        {
          property: JSON.stringify({
            name: "whatsapp",
            type: "PHONES",
            isNullable: false
          }),
          phones_primaryPhoneNumber: "5551234567",
          phones_primaryPhoneCountryCode: "US",
          phones_primaryPhoneCallingCode: "+1"
        },
        
        // EMAILS field example (custom email field)
        {
          property: JSON.stringify({
            name: "alternateEmails",
            type: "EMAILS",
            isNullable: true
          }),
          emails_primaryEmail: "jane.alternate@personal.com",
          emails_additionalEmails: ["jane.backup@email.com"]
        },
        
        // LINKS field example
        {
          property: JSON.stringify({
            name: "portfolio",
            type: "LINKS",
            isNullable: true
          }),
          links_primaryLinkUrl: "https://janesmith.com",
          links_primaryLinkLabel: "Personal Portfolio"
        },
        
        // NUMBER field example
        {
          property: JSON.stringify({
            name: "yearsOfExperience",
            type: "NUMBER",
            isNullable: false
          }),
          value: 10 // Will be validated as a number
        },
        
        // BOOLEAN field example
        {
          property: JSON.stringify({
            name: "isTeamLead",
            type: "BOOLEAN",
            isNullable: false,
            defaultValue: false
          }),
          value: true
        },
        
        // DATE_TIME field example
        {
          property: JSON.stringify({
            name: "nextReviewDate",
            type: "DATE_TIME",
            isNullable: true
          }),
          value: "2024-06-15T10:00:00Z"
        }
      ]
    }
  }
};

// The node will:
// 1. Parse each property's metadata
// 2. Validate the value based on the field type
// 3. Format the data correctly for the API
// 4. Show appropriate error messages if validation fails

// Example validation errors:
// - "Invalid number value for field yearsOfExperience"
// - "Primary email is required for field alternateEmails"
// - "At least one selection is required for field workPreference"
// - "Date is required for field nextReviewDate"
