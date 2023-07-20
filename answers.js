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
                { name: "Back", value: "back" },
              ],
            },
          ])
          .then((scenarioAnswers) => {
            if (scenarioAnswers.scenario === "back") {
              return getAnswers();
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
              name: "policyStoreId",
              message: "Enter the ID of the policy store",
              type: "input",
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
              name: "resourceEntityType",
              message: "Enter the entity type of the resource",
              type: "input",
              when: (answers) => answers.action === "createTemplatePolicy",
            },
            {
              name: "resourceEntityId",
              message: "Enter the entity ID of the resource",
              type: "input",
              when: (answers) => answers.action === "createTemplatePolicy",
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
