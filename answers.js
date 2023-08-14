import inquirer from "inquirer";

export const getAnswers = () => {
  return inquirer
    .prompt([
      {
        name: "action",
        message: "What would you like to do?",
        type: "list",
        choices: [
          { name: "Use prepared scenarios", value: "scenarios" },
          { name: "Manual approach", value: "manual" },
          { name: "Exit", value: "exit" },
        ],
      },
    ])
    .then((answers) => {
      if (answers.action === "scenarios") {
        return inquirer
          .prompt([
            {
              name: "scenario",
              message: "Choose a scenario",
              type: "list",
              choices: [
                { name: "Documents Scenario", value: "documentsScenario" },
                {
                  name: "Ecommerce with Context Scenario",
                  value: "ecommerceContextScenario",
                },
                {
                  name: "Ecommerce with Group Scenario",
                  value: "ecommerceGroupScenario",
                },
                {
                  name: "Ecommerce with Template-Linked Policies Scenario",
                  value: "ecommercePolicyTemplateScenario",
                },
                {
                  name: "Ecommerce with Cognito Integration Scenario",
                  value: "ecommerceCognitoIntegrationScenario",
                },
                {
                  name: "Ecommerce with Hierarchy and ABAC Scenario",
                  value: "ecommerceHierarchyAndAbacScenario",
                },
                { name: "Back", value: "back" },
              ],
            },
          ])
          .then((scenarioAnswers) => {
            if (scenarioAnswers.scenario === "back") {
              return getAnswers();
            } else if (
              scenarioAnswers.scenario === "ecommerceCognitoIntegrationScenario"
            ) {
              return inquirer
                .prompt([
                  {
                    name: "userPoolArn",
                    message: "Enter the ARN of the Cognito User Pool",
                    type: "input",
                  },
                  {
                    name: "appClientId",
                    message: "Enter the App Client ID",
                    type: "input",
                  },
                ])
                .then((cognitoAnswers) => {
                  return {
                    action: scenarioAnswers.scenario,
                    ...cognitoAnswers,
                  };
                });
            } else {
              answers.action = scenarioAnswers.scenario;
              return answers;
            }
          });
      } else if (answers.action === "manual") {
        return inquirer
          .prompt([
            {
              name: "action",
              message: "What would you like to do?",
              type: "list",
              choices: [
                {
                  name: "Make an authorization decision",
                  value: "isAuthorized",
                },
                {
                  name: "Make an authorization decision with Cognito Identity Token",
                  value: "isAuthorizedWithToken",
                },
                { name: "List all policy stores", value: "listPolicyStores" },
                { name: "Create a policy store", value: "createPolicyStore" },
                { name: "Get a policy store", value: "getPolicyStore" },
                { name: "Delete a policy store", value: "deletePolicyStore" },
                { name: "Add Schema to a policy store", value: "putSchema" },
                { name: "Add Static Policy", value: "createStaticPolicy" },
                { name: "Add Template Policy", value: "createTemplatePolicy" },
                { name: "Add policy template", value: "createPolicyTemplate" },
                { name: "Update Static Policy", value: "updateStaticPolicy" },
                { name: "Get Policy", value: "getPolicy" },
                { name: "Get Schema", value: "getSchema" },
                { name: "Delete a Policy", value: "deletePolicy" },
                {
                  name: "List all Policies in a Policy Store",
                  value: "listPolicies",
                },
                { name: "Back", value: "back" },
                { name: "Exit", value: "exit" },
              ],
            },
            {
              name: "validationMode",
              message: "Choose a validation mode for the policy store",
              type: "list",
              choices: ["OFF", "STRICT"],
              default: "STRICT",
              when: (answers) => answers.action === "createPolicyStore",
            },

            {
              name: "identityToken",
              message: "Enter the Identity Token from Cognito",
              type: "input",
              when: (answers) => answers.action === "isAuthorizedWithToken",
            },
            {
              name: "policyStoreId",
              message: "Enter the ID of the policy store",
              type: "input",
              when: (answers) =>
                answers.action === "isAuthorizedWithToken" ||
                answers.action === "getPolicyStore" ||
                answers.action === "deletePolicyStore" ||
                answers.action === "putSchema" ||
                answers.action === "createStaticPolicy" ||
                answers.action === "getSchema" ||
                answers.action === "getPolicy" ||
                answers.action === "updateStaticPolicy" ||
                answers.action === "deletePolicy" ||
                answers.action === "listPolicies" ||
                answers.action === "createTemplatePolicy" ||
                answers.action === "createPolicyTemplate",
            },
            {
              name: "pathToSchema",
              message: "Enter a path to schema",
              type: "input",
              when: (answers) => answers.action === "putSchema",
            },
            {
              name: "policyId",
              message: "Enter the ID of the policy",
              type: "input",
              when: (answers) =>
                answers.action === "getPolicy" ||
                answers.action === "updateStaticPolicy" ||
                answers.action === "deletePolicy",
            },
            {
              name: "policyPath",
              message: "Enter a path to policy (txt file)",
              type: "input",
              when: (answers) =>
                answers.action === "createStaticPolicy" ||
                answers.action === "updateStaticPolicy" ||
                answers.action === "createPolicyTemplate",
            },
            {
              name: "policyDescription",
              message: "Enter the new description for the policy",
              type: "input",
              when: (answers) => answers.action === "updateStaticPolicy",
            },
            {
              name: "description",
              message: "Enter the description for the policy template",
              type: "input",
              when: (answers) => answers.action === "createPolicyTemplate",
            },
            {
              name: "policyTemplateId",
              message: "Enter the ID for the policy template",
              type: "input",
              when: (answers) => answers.action === "createTemplatePolicy",
            },
            {
              name: "principalEntityType",
              message: "Enter the entity type of the principal",
              type: "input",
              when: (answers) => answers.action === "createTemplatePolicy",
            },
            {
              name: "principalEntityId",
              message: "Enter the entity ID of the principal",
              type: "input",
              when: (answers) => answers.action === "createTemplatePolicy",
            },
            {
              name: "actionEntityType",
              message: "Enter the entity type of the action",
              type: "input",
              when: (answers) => answers.action === "isAuthorizedWithToken",
            },
            {
              name: "actionEntityId",
              message: "Enter the entity ID of the action",
              type: "input",
              when: (answers) => answers.action === "isAuthorizedWithToken",
            },
            {
              name: "resourceEntityType",
              message: "Enter the entity type of the resource",
              type: "input",
              when: (answers) =>
                answers.action === "createTemplatePolicy" ||
                answers.action === "isAuthorizedWithToken",
            },
            {
              name: "testFilePath",
              message: "Enter the path for json test file",
              type: "input",
              when: (answers) => answers.action === "isAuthorized",
            },
            {
              name: "resourceEntityId",
              message: "Enter the entity ID of the resource",
              type: "input",
              when: (answers) =>
                answers.action === "createTemplatePolicy" ||
                answers.action === "isAuthorizedWithToken",
            },
            {
              name: "contextKey",
              message:
                "Enter the Context Key for the context purpose (If no needed leave blank)",
              type: "input",
              default: "",
              when: (answers) => answers.action === "isAuthorizedWithToken",
            },
            {
              name: "contextValue",
              message:
                "Enter the Context Value for the context purpose (If no needed leave blank)",
              type: "input",
              default: "",
              when: (answers) => answers.action === "isAuthorizedWithToken",
            },
            {
              name: "userPoolArn",
              message: "Enter the Amazon Cognito User Pool ARN",
              type: "input",
              when: (scenarioAnswers) =>
                scenarioAnswers.scenario ===
                "ecommerceCognitoIntegrationScenario",
            },
            {
              name: "appClientId",
              message: "Enter the Amazon Cognito App Client ID",
              type: "input",
              when: (scenarioAnswers) =>
                scenarioAnswers.scenario ===
                "ecommerceCognitoIntegrationScenario",
            },
          ])
          .then((answers) => {
            if (answers.action === "back") {
              return getAnswers();
            } else {
              return answers;
            }
          });
      } else {
        return answers;
      }
    });
};
