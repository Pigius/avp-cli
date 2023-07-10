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
  useScenario,
} from "./awsOperations.js";

console.log("Welcome to AVP CLI!");
console.log(
  "This tool is designed to help you interact with the AWS Verified Permissions (AVP) service. You can use it to create, manage, and delete policy stores, schemas, and policies."
);
console.log(
  "Please ensure that you have set up your AWS credentials correctly to use this tool."
);

const interactiveMode = async () => {
  let exit = false;

  while (!exit) {
    try {
      const answers = await getAnswers();

      switch (answers.action) {
        case "documentsScenario":
          await useScenario("documentsScenario");
          break;
        case "ecommerceContextScenario":
          await useScenario("ecommerceContextScenario");
          break;
        case "ecommerceGroupScenario":
          await useScenario("ecommerceGroupScenario");
          break;
        case "createPolicyStore":
          await createPolicyStore(answers.validationMode);
          break;
        case "createStaticPolicy":
          await createStaticPolicy(
            answers.policyStoreId,
            answers.policyPath,
            answers.description
          );
          break;
        case "deletePolicy":
          await deletePolicy(answers.policyStoreId, answers.policyId);
          break;
        case "deletePolicyStore":
          await deletePolicyStore(answers.policyStoreId);
          break;
        case "getPolicy":
          await getPolicy(answers.policyStoreId, answers.policyId);
          break;
        case "getPolicyStore":
          await getPolicyStore(answers.policyStoreId);
          break;
        case "getSchema":
          await getSchema(answers.policyStoreId);
          break;
        case "listPolicies":
          await listPolicies(answers.policyStoreId);
          break;
        case "listPolicyStores":
          await listPolicyStores();
          break;
        case "putSchema":
          await putSchema(answers.policyStoreId, answers.pathToSchema);
          break;
        case "updateStaticPolicy":
          await updateStaticPolicy(
            answers.policyStoreId,
            answers.policyId,
            answers.policyPath,
            answers.description
          );
          break;
        case "exit":
          exit = true;
          break;
        default:
          console.error(`Unknown action: ${answers.action}`);
      }
    } catch (err) {
      console.error(
        `There was an error while processing your request: ${err.message}`,
        err
      );
    }
  }
};

interactiveMode();