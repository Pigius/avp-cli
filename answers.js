import inquirer from "inquirer";
import fs from "fs";
import path from "path";

export const getAnswers = () => {
  return inquirer
    .prompt([
      {
        name: "action",
        message: "What would you like to do?",
        type: "list",
        choices: [
          { name: "Test Scenario", value: "testScenario" },
          {
            name: "Test Batch Authorization Scenario",
            value: "testBatchAuthorizationScenario",
          },
          { name: "Manual approach", value: "manual" },
          { name: "Use prepared scenarios", value: "scenarios" },
          { name: "Exit", value: "exit" },
        ],
      },
    ])
    .then((answers) => {
      if (answers.action === "testScenario") {
        let scenarios = fetchScenarios();
        return inquirer
          .prompt([
            {
              name: "selectedScenario",
              message: "Choose a scenario",
              type: "list",
              choices: scenarios,
            },
          ])
          .then((scenarioAnswers) => {
            if (scenarioAnswers.selectedScenario === "back") {
              return getAnswers();
            }
            let tests = fetchTestsForScenario(scenarioAnswers.selectedScenario);
            return inquirer
              .prompt([
                {
                  name: "selectedTest",
                  message: "Choose a test",
                  type: "list",
                  choices: tests,
                },
              ])
              .then((testAnswers) => {
                return {
                  action: "isAuthorized",
                  testFilePath: testAnswers.selectedTest,
                };
              });
          });
      } else if (answers.action === "testBatchAuthorizationScenario") {
        return inquirer
          .prompt([
            {
              name: "selectedScenario",
              message: "Choose a scenario",
              type: "list",
              choices: ["ecommerceBatchScenario", "back"],
            },
          ])
          .then((scenarioAnswers) => {
            if (scenarioAnswers.selectedScenario === "back") {
              return getAnswers();
            }
            let tests = fetchBatchTestsForScenario(
              scenarioAnswers.selectedScenario
            );
            return inquirer
              .prompt([
                {
                  name: "selectedTest",
                  message: "Choose a test",
                  type: "list",
                  choices: tests,
                },
              ])
              .then((testAnswers) => {
                return {
                  action: "batchIsAuthorized",
                  batchTestFilePath: testAnswers.selectedTest,
                };
              });
          });
      } else if (answers.action === "scenarios") {
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
                {
                  name: "Ecommerce with Batch Authorization",
                  value: "ecommerceBatchScenario",
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
                  name: "Make a batch authorization decision",
                  value: "batchIsAuthorized",
                },
                {
                  name: "Make an authorization decision with Cognito Identity Token",
                  value: "isAuthorizedWithToken",
                },
                { name: "Add Policy Template", value: "createPolicyTemplate" },
                { name: "Add Schema to a Policy Store", value: "putSchema" },
                { name: "Add Static Policy", value: "createStaticPolicy" },
                { name: "Add Template Policy", value: "createTemplatePolicy" },
                { name: "Create a Policy Store", value: "createPolicyStore" },
                {
                  name: "Create Identity Source",
                  value: "createIdentitySource",
                },
                {
                  name: "Delete a Identity Source",
                  value: "deleteIdentitySource",
                },
                { name: "Delete a Policy", value: "deletePolicy" },
                { name: "Delete a Policy Store", value: "deletePolicyStore" },
                {
                  name: "Delete a Policy Template",
                  value: "deletePolicyTemplate",
                },
                { name: "Get Identity Source", value: "getIdentitySource" },
                { name: "Get Policy", value: "getPolicy" },
                { name: "Get Policy Store", value: "getPolicyStore" },
                { name: "Get Policy Template", value: "getPolicyTemplate" },
                { name: "Get Schema", value: "getSchema" },
                {
                  name: "List all Policies in a Policy Store",
                  value: "listPolicies",
                },
                { name: "List all Policy Stores", value: "listPolicyStores" },
                { name: "List Identity Sources", value: "listIdentitySources" },
                { name: "List Policy Templates", value: "listPolicyTemplates" },
                {
                  name: "Update Identity Source",
                  value: "updateIdentitySource",
                },
                { name: "Update Policy Store", value: "updatePolicyStore" },
                {
                  name: "Update Policy Template",
                  value: "updatePolicyTemplate",
                },
                { name: "Update Static Policy", value: "updateStaticPolicy" },
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
              when: (answers) =>
                answers.action === "createPolicyStore" ||
                answers.action === "updatePolicyStore",
            },
            {
              name: "policyStoreId",
              message: "Enter the ID of the policy store",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Policy Store ID cannot be empty.";
              },
              when: (answers) =>
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
                answers.action === "createPolicyTemplate" ||
                answers.action === "deleteIdentitySource" ||
                answers.action === "deletePolicyTemplate" ||
                answers.action === "getIdentitySource" ||
                answers.action === "getPolicyTemplate" ||
                answers.action === "listIdentitySources" ||
                answers.action === "listPolicyTemplates" ||
                answers.action === "updatePolicyStore" ||
                answers.action === "updatePolicyTemplate" ||
                answers.action === "createIdentitySource" ||
                answers.action === "updateIdentitySource",
            },
            {
              name: "pathToSchema",
              message: "Enter a path to schema",
              type: "input",
              validate: function (value) {
                if (value.trim() === "") {
                  return "Path cannot be empty.";
                }
                if (value.endsWith(".json")) {
                  return true;
                }
                return "Path should end with the .json extension.";
              },
              when: (answers) => answers.action === "putSchema",
            },
            {
              name: "identitySourceId",
              message: "Enter identitySourceId",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Identity Source Id cannot be empty.";
              },
              when: (answers) =>
                answers.action === "deleteIdentitySource" ||
                answers.action === "getIdentitySource" ||
                answers.action === "updateIdentitySource",
            },
            {
              name: "policyId",
              message: "Enter the ID of the policy",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Policy ID cannot be empty.";
              },
              when: (answers) =>
                answers.action === "getPolicy" ||
                answers.action === "updateStaticPolicy" ||
                answers.action === "deletePolicy",
            },
            {
              name: "policyPath",
              message: "Enter a path to policy (cedar extension file)",
              type: "input",
              validate: function (value) {
                if (value.trim() === "") {
                  return "Path cannot be empty.";
                }
                if (value.endsWith(".cedar")) {
                  return true;
                }
                return "Path should end with the .cedar extension.";
              },
              when: (answers) =>
                answers.action === "createStaticPolicy" ||
                answers.action === "updateStaticPolicy" ||
                answers.action === "createPolicyTemplate",
            },
            {
              name: "policyDescription",
              message: "Enter the new description for the policy",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Policy description cannot be empty.";
              },
              when: (answers) => answers.action === "updateStaticPolicy",
            },
            {
              name: "description",
              message: "Enter the description for the policy template",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Description of the policy template cannot be empty.";
              },
              when: (answers) =>
                answers.action === "createPolicyTemplate" ||
                answers.action === "updatePolicyTemplate",
            },
            {
              name: "statement",
              message: "Enter statement of the policy ",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Policy statement cannot be empty.";
              },
              when: (answers) => answers.action === "updatePolicyTemplate",
            },
            {
              name: "policyTemplateId",
              message: "Enter the ID for the policy template",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Policy Template ID cannot be empty.";
              },
              when: (answers) =>
                answers.action === "createTemplatePolicy" ||
                answers.action === "deletePolicyTemplate" ||
                answers.action === "getPolicyTemplate" ||
                answers.action === "updatePolicyTemplate",
            },
            {
              name: "principalEntityType",
              message: "Enter the entity type of the principal",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Entity type cannot be empty.";
              },
              when: (answers) =>
                answers.action === "createTemplatePolicy" ||
                answers.action === "createIdentitySource" ||
                answers.action === "updateIdentitySource",
            },
            {
              name: "principalEntityId",
              message: "Enter the entity ID of the principal",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Entity ID cannot be empty.";
              },
              when: (answers) => answers.action === "createTemplatePolicy",
            },
            {
              name: "resourceEntityType",
              message: "Enter the entity type of the resource",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Entity type cannot be empty.";
              },
              when: (answers) => answers.action === "createTemplatePolicy",
            },
            {
              name: "testFilePath",
              message: "Enter the path for json test file",
              type: "input",
              validate: function (value) {
                if (value.trim() === "") {
                  return "Path to test file cannot be empty.";
                }
                if (value.endsWith(".json")) {
                  return true;
                }
                return "Path should end with the .json extension.";
              },
              when: (answers) =>
                answers.action === "isAuthorized" ||
                answers.action === "isAuthorizedWithToken",
            },
            {
              name: "batchTestFilePath",
              message: "Enter the path for batch authorization json test file",
              type: "input",
              default: "structureBatchAuthorizationRequest.json",
              validate: function (value) {
                if (value.trim() === "") {
                  return "Path to test file cannot be empty.";
                }
                if (value.endsWith(".json")) {
                  return true;
                }
                return "Path should end with the .json extension.";
              },
              when: (answers) => answers.action === "batchIsAuthorized",
            },
            {
              name: "resourceEntityId",
              message: "Enter the entity ID of the resource",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Entity ID cannot be empty.";
              },
              when: (answers) => answers.action === "createTemplatePolicy",
            },
            {
              name: "userPoolArn",
              message: "Enter the Amazon Cognito User Pool ARN",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Amazon Cognito User Pool ARN cannot be empty.";
              },
              when: (answers) =>
                answers.scenario === "ecommerceCognitoIntegrationScenario" ||
                answers.action === "createIdentitySource" ||
                answers.action === "updateIdentitySource",
            },
            {
              name: "appClientId",
              message: "Enter the Amazon Cognito App Client ID",
              type: "input",
              validate: function (value) {
                if (value.trim() !== "") {
                  return true;
                }
                return "Amazon Cognito App Client ID cannot be empty.";
              },
              when: (answers) =>
                answers.scenario === "ecommerceCognitoIntegrationScenario" ||
                answers.action === "createIdentitySource" ||
                answers.action === "updateIdentitySource",
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

const fetchScenarios = () => {
  const scenarioDir = "./scenarios/";
  const scenarioDirs = fs
    .readdirSync(scenarioDir)
    .filter((dir) => fs.statSync(path.join(scenarioDir, dir)).isDirectory());
  scenarioDirs.push({ name: "Back", value: "back" });

  return scenarioDirs;
};

function fetchTestsForScenario(scenarioName) {
  const scenarioData = JSON.parse(
    fs.readFileSync(`./scenarios/${scenarioName}/${scenarioName}.json`, "utf-8")
  );
  return scenarioData.tests.map((test) => ({
    name: `${test.description} (${test.type})`,
    value: test.path,
  }));
}

function fetchBatchTestsForScenario(scenarioName) {
  const scenarioData = JSON.parse(
    fs.readFileSync(`./scenarios/${scenarioName}/${scenarioName}.json`, "utf-8")
  );
  return scenarioData.batchTests.map((test) => ({
    name: `${test.description}`,
    value: test.path,
  }));
}
