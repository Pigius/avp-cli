# AVP CLI Tool

This is a command-line interface (CLI) tool designed to interact with the AWS Verified Permissions (AVP) service. You can use it to create, manage, and delete policy stores, schemas, and policies.

## Big Picture

The AWS Verified Permissions (AVP) service is a powerful tool for managing permissions across your AWS resources. However, not everyone prefers to interact with it through the AWS console. Some developers prefer to quickly prototype and check something using a command-line interface, which can be faster and more flexible. This tool is designed to meet that need.

This tool is intended for learning and prototyping. It provides a quick and easy way to interact with the AVP service, allowing you to create, manage, and delete policy stores, schemas, and policies. However, it's not intended for production workloads.

To learn more about Cedar and AVP with this tool refer to series of blogposts [here](https://dev.to/aws-builders/authorization-and-cedar-a-new-way-to-manage-permissions-part-i-1nid).

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Ensure that you have set up your AWS credentials correctly to use this tool.

## Prerequisites

Before you can use this tool, you need to set up your AWS credentials on your local machine. If you're using a MacBook, you can do this by adding the following to your `~/.aws/credentials` file:

```
[default]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
region=eu-west-1 // or any other region
```

If you want to use a specific profile, you can add it like this:

```
[personal]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
region=eu-west-1 // or any other region
```

Then, you can use the tool with the specific profile by running:

```
AWS_PROFILE=personal node index.js
```

```bash
➜  avp-cli git:(main) ✗ AWS_PROFILE=personal node index.js
Welcome to AVP CLI!
This tool is designed to help you interact with the AWS Verified Permissions (AVP) service. You can use it to create, manage, and delete policy stores, schemas, and policies.
Please ensure that you have set up your AWS credentials correctly to use this tool.
? What would you like to do? (Use arrow keys)
❯ List all policy stores
  Create a policy store
  Get a policy store
  Delete a policy store
  Add Schema to a policy store
  Add Static Policy
  Update Static Policy
(Move up and down to reveal more choices)
```

## Usage

The tool provides the following actions:

- Make an authorization decision
- Make an authorization decision with Cognito Identity Token
- Use prepared scenarios
- List all policy stores
- Create a policy store
- Get a policy store
- Delete a policy store
- Add a schema to a policy store
- Add a static policy
- Update a static policy
- Get a policy
- Get a schema
- Delete a policy
- List all policies in a policy store
- Create a policy template
- Create a template-linked policy

When you run the tool, it will prompt you to choose an action and then ask for any necessary additional information. Right now AVP does not support naming of the policy stores, so it's autogenerated. Soon it should be improved.

You can run it via:

```bash
node index.js
```

## Testing

You can test the tool by running it and choosing an action. For example, you could add a schema to a policy store by choosing the "Add Schema to a policy store" action and then providing the path to a JSON file containing the schema.

Here's an example of a schema:

```json
{
  "EcommercePlatform": {
    "entityTypes": {
      "CustomerGroup": {
        "shape": {
          "type": "Record",
          "attributes": {
            "name": {
              "type": "String",
              "required": true
            }
          }
        }
      },
      "Product": {
        "shape": {
          "type": "Record",
          "attributes": {}
        }
      },
      "Customer": {
        "shape": {
          "attributes": {},
          "type": "Record"
        },
        "memberOfTypes": ["CustomerGroup"]
      }
    },
    "actions": {
      "Create": {
        "appliesTo": {
          "principalTypes": ["Customer"],
          "resourceTypes": ["Product"]
        }
      },
      "Edit": {
        "appliesTo": {
          "context": {
            "attributes": {},
            "type": "Record"
          },
          "principalTypes": ["Customer", "CustomerGroup"],
          "resourceTypes": ["Product"]
        }
      },
      "View": {
        "appliesTo": {
          "context": {
            "type": "Record",
            "attributes": {
              "region": {
                "name": "region",
                "type": "String",
                "required": true
              }
            }
          },
          "principalTypes": ["Customer"],
          "resourceTypes": ["Product"]
        }
      },
      "Delete": {
        "appliesTo": {
          "resourceTypes": ["Product"],
          "principalTypes": ["Customer"]
        }
      }
    }
  }
}
```

And here's an example of a policy:

```txt
permit (
    principal,
    action in [EcommercePlatform::Action::"Edit"],
    resource
);
```

You can create files with these contents and then provide the paths to these files when prompted by the tool.

## Scenarios

Scenarios are predefined sets of policies (policy store, schema, and policies) that you can run to interact with the AVP service. Each scenario is defined in a JSON file and includes a validation mode, a schema, and a set of policies.

To use a scenario, select "Use prepared scenarios" from the main menu, then select the scenario you want to use. The CLI will run all the operations defined in the scenario.

### Added scenarios

| Scenario Name                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Documents Scenario](scenarios/documentsScenario/documentsScenario.json)                                                                    | This is a basic scenario with a document management platform schema and two policies.                                                                                                                                                                                                                                                              |
| [Ecommerce with Context usage Scenario](scenarios/ecommerceContextScenario/ecommerceContextScenario.json)                                   | This scenario demonstrates the use of context in AVP. It allows customers to view products only when they are in the US region.                                                                                                                                                                                                                    |
| [Ecommerce with Group usage Scenario](scenarios/ecommerceGroupScenario/ecommerceGroupScenario.json)                                         | This scenario demonstrates the use of Groups in AWS Verified Permissions. It allows customers who belong to the VIP group to preorder products.                                                                                                                                                                                                    |
| [Ecommerce with Policy Template usage Scenario](scenarios/ecommercePolicyTemplateScenario/ecommercePolicyTemplateScenario.json)             | This scenario demonstrates the use of policy templates and template-linked policies in AWS Verified Permissions. It allows sellers to list their own products.                                                                                                                                                                                     |
| [Ecommerce with Cognito Integration usage Scenario](scenarios/ecommerceCognitoIntegrationScenario/ecommerceCognitoIntegrationScenario.json) | This scenario demonstrates the use of Cognito integration in AWS Verified Permissions. It allows sellers to discount if they have agreed discount privilege. Refer to this [blogpost](https://dev.to/aws-builders/authorization-and-amazon-verified-permissions-a-new-way-to-manage-permissions-part-viii-integration-with-cognito-pgb) for setup. |

Soon I will add more scenarios.

### Scenario Structure

A scenario is defined in a JSON file with the following structure:

```json
{
  "validationMode": "STRICT",
  "schemaPath": "./path/to/schema.json",
  "policies": [
    {
      "path": "./path/to/policy1.txt",
      "description": "Description of policy 1"
    },
    {
      "path": "./path/to/policy2.txt",
      "description": "Description of policy 2"
    }
  ]
}
```

### Example:

```bash

Welcome to AVP CLI!
This tool is designed to help you interact with the AWS Verified Permissions (AVP) service. You can use it to create, manage, and delete policy stores, schemas, and policies.
Please ensure that you have set up your AWS credentials correctly to use this tool.
? What would you like to do? Use prepared scenarios
? Choose a scenario Documents Scenario
Policy store created with ID: CZqBzBwt9sR6cmFoZTLTAT
Schema put successfully for policy store ID: CZqBzBwt9sR6cmFoZTLTAT
Static policy created with ID: 4D71i9mo7r6ZPjNndCJUX8
Static policy created with ID: 8rfLZU2ta5mcBYU5uaUNmu
┌────────────────────────────────────────┬────────────────────────────────────────┬────────────────────────────────────────┐
│ Policy ID                              │ Policy Store ID                        │ Created Date                           │
├────────────────────────────────────────┼────────────────────────────────────────┼────────────────────────────────────────┤
│ 4D71i9mo7r6ZPjNndCJUX8                 │ CZqBzBwt9sR6cmFoZTLTAT                 │ Mon Jul 10 2023 10:13:54 GMT+0200 (Ce… │
├────────────────────────────────────────┼────────────────────────────────────────┼────────────────────────────────────────┤
│ 8rfLZU2ta5mcBYU5uaUNmu                 │ CZqBzBwt9sR6cmFoZTLTAT                 │ Mon Jul 10 2023 10:13:54 GMT+0200 (Ce… │
└────────────────────────────────────────┴────────────────────────────────────────┴────────────────────────────────────────┘
Generating of the documentsScenario is finished. Open the AWS console to play around with that.
```

## Roles and Permissions

This tool requires certain permissions to interact with the AWS Verified Permissions service. It is recommended to use this tool on an AWS sandbox account where admin access is granted. Always follow the principle of least privilege and only grant the necessary permissions for the tasks you need to perform.

## Next Steps

I'm planning to continue improving this tool. Here are some of the next steps I am considering:

~~- **Prepared Scenarios**: I'm planning to add prepared scenarios that you can deploy within AWS. This will make it easier to get started with the tool and learn how to use the AVP service.~~

- **Better Error Handling**: I'm planning to improve the error handling in the tool to make it more robust and user-friendly.

- **Logging**: I'm considering adding logging to the tool to help you understand what's happening behind the scenes.

- **Configuration**: I'm planning to add more configuration options to the tool, allowing you to customize its behavior to better suit your needs.

- **Help Command**: I'm considering adding a help command that provides information about how to use the tool and what each command does.

~~- **Policy Templates**: I'm planning to add policy templates to the tool, making it easier to create new policies.~~

~~- **Integration with Cognito**: I'm planning to add scenario to see how connect Cognito to AVP.~~

Stay tuned for these and other improvements!
