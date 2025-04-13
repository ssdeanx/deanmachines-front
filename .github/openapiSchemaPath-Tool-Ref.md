# openapiSchemaPath Tool Ref

- list-endpoints

Lists all API paths and their HTTP methods with summaries, organized by path

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file

- get-endpoint

Gets detailed information about a specific API endpoint

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file
path*
No description
method*
No description

- get-request-body

Gets the request body schema for a specific endpoint

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file
path*
No description
method*
No description

- get-response-schema

Gets the response schema for a specific endpoint, method, and status code

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file
path*
No description
method*
No description
statusCode
No description

- get-path-parameters

Gets the parameters for a specific path

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file
path*
No description
method
No description

- list-components

Lists all schema components (schemas, parameters, responses, etc.)

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file

- get-component

Gets detailed definition for a specific component

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file
type*
Component type (e.g., schemas, parameters, responses)
name*
Component name

- list-security-schemes

Lists all available security schemes

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file

- get-examples

Gets examples for a specific component or endpoint

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file
type*
Type of example to retrieve
path
API path (required for request/response examples)
method
HTTP method (required for request/response examples)
statusCode
Status code (for response examples)
componentType
Component type (required for component examples)
componentName
Component name (required for component examples)

- search-schema

Searches across paths, operations, and schemas

Parameters
openapiSchemaPath*
Path to the OpenAPI schema file
pattern*
Search pattern (case-insensitive)
