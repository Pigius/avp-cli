import { getAnswers } from "./answers.js";
import {
  createPolicyStore,
  createStaticPolicy,
  deletePolicy,
  deletePolicyStore,
  getPolicy,
  getPolicyStore,
  getSchema,
  listPolicies,
  listPolicyStores,
  putSchema,
  updateStaticPolicy,
} from "./awsOperations.js";

console.log("Welcome to AVP CLI!");
console.log(
  "This tool is designed to help you interact with the AWS Verified Permissions (AVP) service. You can use it to create, manage, and delete policy stores, schemas, and policies."
);
console.log(
  "Please ensure that you have set up your AWS credentials correctly to use this tool."
);

async function interactiveMode() {
  let exit = false;

  while (!exit) {
    try {
      const answers = await getAnswers();

      console.log("Processing your request...");
      if (answers.action === "createPolicyStore") {
        await createPolicyStore(answers.validationMode);
      } else if (answers.action === "createStaticPolicy") {
        await createStaticPolicy(
          answers.policyStoreId,
          answers.policyPath,
          answers.description
        );
      } else if (answers.action === "deletePolicy") {
        await deletePolicy(answers.policyStoreId, answers.policyId);
      } else if (answers.action === "deletePolicyStore") {
        await deletePolicyStore(answers.policyStoreId);
      } else if (answers.action === "getPolicy") {
        await getPolicy(answers.policyStoreId, answers.policyId);
      } else if (answers.action === "getPolicyStore") {
        await getPolicyStore(answers.policyStoreId);
      } else if (answers.action === "getSchema") {
        await getSchema(answers.policyStoreId);
      } else if (answers.action === "listPolicies") {
        await listPolicies(answers.policyStoreId);
      } else if (answers.action === "listPolicyStores") {
        await listPolicyStores();
      } else if (answers.action === "putSchema") {
        await putSchema(answers.policyStoreId, answers.pathToSchema);
      } else if (answers.action === "updateStaticPolicy") {
        await updateStaticPolicy(
          answers.policyStoreId,
          answers.policyId,
          answers.policyPath,
          answers.description
        );
      } else if (answers.action === "exit") {
        exit = true;
      }
    } catch (err) {
      console.error(
        `There was an error while processing your request: ${err.message}`,
        err
      );
    }
  }
}

interactiveMode();
