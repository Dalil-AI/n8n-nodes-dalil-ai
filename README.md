# n8n-nodes-dalil-ai

This is an n8n community node for integrating with Dalil AI CRM. It provides comprehensive people management capabilities with dynamic custom field support.

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-dalil-ai` in **Package Name**
4. Agree to the risks and select **Install**

After installation, you'll have access to the **Dalil AI** node.

### Manual Installation

To get started, install the package:

```bash
npm install n8n-nodes-dalil-ai
```

For n8n running locally or in Docker:
```bash
cd ~/.n8n/nodes
npm install n8n-nodes-dalil-ai
```

Restart n8n to register the new nodes.

## Prerequisites

- Dalil AI API running (default: `http://localhost:3000`)
- Valid Dalil AI API key with Bearer token authentication

## Configuration

### 1. Credentials Setup

1. In n8n, go to **Credentials** and create a new **Dalil AI API** credential
2. Enter your API key in the **API Key** field
3. Test the connection to ensure it's working

### 2. API Base URL

The node is configured to use `http://localhost:3000` by default. If your Dalil AI API is running on a different URL, you'll need to update the base URL in the node configuration.

## Supported Operations

### People Resource

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new person with required fields (firstName, lastName, primaryEmail) |
| **Create Many** | Batch create multiple people using JSON array |
| **Update** | Update an existing person by ID |
| **Delete** | Delete a person by ID |
| **Get** | Retrieve a single person by ID with depth control |
| **Get Many** | Retrieve multiple people with filtering and pagination |

## Features

### ✅ **Dynamic Custom Fields**
- Automatically loads custom fields from Dalil AI metadata API
- Only shows fields marked as `isCustom: true` and `isActive: true`
- Seamlessly integrates with standard fields

### ✅ **Complex Data Types**
- **Names**: firstName, lastName structure
- **Emails**: primaryEmail with additionalEmails array
- **Phones**: Country codes, calling codes, additional numbers
- **Social Links**: LinkedIn and X (Twitter) with labels and URLs
- **Custom Properties**: Dynamic key-value pairs

### ✅ **Advanced Query Options**
- **Depth Control**: 0, 1, or 2 levels of nested data
- **Filtering**: Complex field-based filters
- **Sorting**: Multi-field sorting with direction control
- **Pagination**: Cursor-based with `startingAfter`/`endingBefore`

## Usage Examples

### Creating a Person

```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "primaryEmail": "john.doe@example.com",
  "additionalFields": {
    "jobTitle": "Software Engineer",
    "city": "New York",
    "score": 85,
    "customPropertiesUi": {
      "customPropertiesValues": [
        {
          "property": "intro",
          "value": "Experienced developer"
        },
        {
          "property": "workPreference",
          "value": ["REMOTE_WORK", "HYBRID"]
        }
      ]
    }
  }
}
```

### Batch Creating People

```json
[
  {
    "name": {"firstName": "Alice", "lastName": "Smith"},
    "emails": {"primaryEmail": "alice@example.com"},
    "jobTitle": "Product Manager"
  },
  {
    "name": {"firstName": "Bob", "lastName": "Wilson"},
    "emails": {"primaryEmail": "bob@example.com"},
    "city": "San Francisco"
  }
]
```

### Advanced Filtering

```
filter: firstName[eq]:John,score[gt]:50,city[in]:["New York","San Francisco"]
orderBy: createdAt[DescNullsLast],score[AscNullsFirst]
```

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/rest/people` | GET | Retrieve people with filtering |
| `/rest/people` | POST | Create single person |
| `/rest/people/{id}` | GET | Get person by ID |
| `/rest/people/{id}` | PATCH | Update person |
| `/rest/people/{id}` | DELETE | Delete person |
| `/rest/batch/people` | POST | Create multiple people |
| `/rest/metadata/standard-id/{id}` | GET | Load custom field metadata |

**People Standard ID**: `20202020-e674-48e5-a542-72570eee7213`

## Testing the Node

### 1. Start Your Dalil AI API
```bash
# Ensure your API is running on http://localhost:3000
curl http://localhost:3000/rest/people
```

### 2. Test in n8n Workflow

1. **Create a new workflow**
2. **Add Dalil AI node**
3. **Configure credentials** with your API key
4. **Test operations**:
   - Start with **Get Many** to verify connection
   - Try **Create** with minimal data
   - Test **Custom Properties** loading

### 3. Verify Custom Fields Loading

1. Go to **Create** operation
2. Open **Additional Fields**
3. Check **Custom Properties** section
4. Verify dropdown loads your custom fields from API

## Troubleshooting

### Common Issues

**❌ "Authentication failed"**
- Verify API key is correct
- Check if API is running on `http://localhost:3000`
- Ensure Bearer token format is accepted

**❌ "Custom properties not loading"**
- Check metadata API endpoint: `/rest/metadata/standard-id/20202020-e674-48e5-a542-72570eee7213`
- Verify fields have `isCustom: true` and `isActive: true`
- Check API authentication for metadata endpoint

**❌ "Node not appearing in n8n"**
- Restart n8n after installation
- Check if package is installed in correct directory
- Verify `package.json` includes the node

### Debug Mode

Enable debug logs in n8n to see API requests:
```bash
export N8N_LOG_LEVEL=debug
```

## Development

### Building the Package

```bash
npm run build
```

### Running in Development

```bash
npm run dev
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## API Documentation

For complete API documentation, visit: [https://docs.dalil-ai.com](https://docs.dalil-ai.com)

## Support

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/dalil-ai/n8n-nodes-dalil-ai/issues)
- **Documentation**: [Dalil AI API Docs](https://docs.dalil-ai.com)
- **Email**: support@dalil-ai.com

## License

[MIT](LICENSE.md)
