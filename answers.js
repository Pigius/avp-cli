import inquirer from "inquirer";

export const getAnswers = () => {
  return inquirer.prompt([
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
        { name: "Update Static Policy", value: "updateStaticPolicy" },
        { name: "Get Policy", value: "getPolicy" },
        { name: "Get Schema", value: "getSchema" },
        { name: "Delete a Policy", value: "deletePolicy" },
        { name: "List all Policies in a Policy Store", value: "listPolicies" },
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
        answers.action === "listPolicies",
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
        answers.action === "updateStaticPolicy",
    },
    {
      name: "policyDescription",
      message: "Enter the new description for the policy",
      type: "input",
      when: (answers) => answers.action === "updateStaticPolicy",
    },
  ]);
};
