#!/usr/bin/env node

import { getAnswers } from "./answers.js";
import {
  batchIsAuthorized,
  createPolicyStore,
  createStaticPolicy,
  createPolicyTemplate,
  createTemplatePolicy,
  deletePolicy,
  deletePolicyTemplate,
  getIdentitySource,
  getPolicyTemplate,
  deletePolicyStore,
  deleteIdentitySource,
  getPolicy,
  getPolicyStore,
  getSchema,
  IsAuthorized,
  isAuthorizedWithToken,
  listPolicies,
  listPolicyStores,
  listPolicyTemplates,
  listIdentitySources,
  putSchema,
  updateStaticPolicy,
  updatePolicyStore,
  updatePolicyTemplate,
  updateIdentitySource,
  createIdentitySource,
  useScenario,
} from "./awsOperations.js";

console.log("🚀 Welcome to the AVP CLI Tool!");
console.log(
  "Designed to streamline your interactions with the AWS Verified Permissions (AVP) service."
);
console.log(
  "🔧 Create, manage, and delete policy stores, schemas, and policies. Plus, deploy and test with predefined scenarios!"
);
console.log(
  "⚠️ Ensure your AWS credentials are correctly set up before proceeding."
);

const interactiveMode = async () => {
  let exit = false;

  while (!exit) {
    try {
      const answers = await getAnswers();

      switch (answers.action) {
        case "isAuthorized":
          await IsAuthorized(answers.testFilePath);
          break;
        case "batchIsAuthorized":
          await batchIsAuthorized(answers.batchTestFilePath);
          break;
        case "isAuthorizedWithToken":
          await isAuthorizedWithToken(answers.testFilePath);
          break;
        case "documentsScenario":
          await useScenario("documentsScenario");
          break;
        case "ecommerceContextScenario":
          await useScenario("ecommerceContextScenario");
          break;
        case "ecommerceGroupScenario":
          await useScenario("ecommerceGroupScenario");
          break;
        case "ecommercePolicyTemplateScenario":
          await useScenario("ecommercePolicyTemplateScenario");
          break;
        case "ecommerceHierarchyAndAbacScenario":
          await useScenario("ecommerceHierarchyAndAbacScenario");
          break;
        case "ecommerceBatchScenario":
          await useScenario("ecommerceBatchScenario");
          break;
        case "createPolicyStore":
          await createPolicyStore(
            answers.validationMode,
            answers.policyStoreDescription
          );
          break;
        case "createStaticPolicy":
          await createStaticPolicy(
            answers.policyStoreId,
            answers.policyPath,
            answers.description
          );
          break;
        case "createPolicyTemplate":
          await createPolicyTemplate(
            answers.policyStoreId,
            answers.policyPath,
            answers.description
          );
          break;
        case "createIdentitySource":
          await createIdentitySource(
            answers.policyStoreId,
            answers.principalEntityType,
            answers.userPoolArn,
            answers.appClientId
          );
          break;
        case "updateIdentitySource":
          await updateIdentitySource(
            answers.policyStoreId,
            answers.identitySourceId,
            answers.principalEntityType,
            answers.userPoolArn,
            answers.appClientId
          );
          break;
        case "createTemplatePolicy":
          const principal = {
            entityType: answers.principalEntityType,
            entityId: answers.principalEntityId,
          };
          const resource = {
            entityType: answers.resourceEntityType,
            entityId: answers.resourceEntityId,
          };
          await createTemplatePolicy(
            answers.policyStoreId,
            answers.policyTemplateId,
            principal,
            resource
          );
          break;
        case "ecommerceCognitoIntegrationScenario":
          await useScenario(
            "ecommerceCognitoIntegrationScenario",
            answers.userPoolArn,
            answers.appClientId
          );
          break;
        case "deletePolicy":
          await deletePolicy(answers.policyStoreId, answers.policyId);
          break;
        case "deletePolicyTemplate":
          await deletePolicyTemplate(
            answers.policyStoreId,
            answers.policyTemplateId
          );
          break;
        case "deletePolicyStore":
          await deletePolicyStore(answers.policyStoreId);
          break;
        case "deleteIdentitySource":
          await deleteIdentitySource(
            answers.policyStoreId,
            answers.identitySourceId
          );
          break;
        case "updatePolicyTemplate":
          await updatePolicyTemplate(
            answers.policyStoreId,
            answers.policyTemplateId,
            answers.statement,
            answers.description
          );
          break;
        case "getPolicy":
          await getPolicy(answers.policyStoreId, answers.policyId);
          break;
        case "getIdentitySource":
          await getIdentitySource(
            answers.policyStoreId,
            answers.identitySourceId
          );
          break;
        case "getPolicyStore":
          await getPolicyStore(answers.policyStoreId);
          break;
        case "getPolicyTemplate":
          await getPolicyTemplate(
            answers.policyStoreId,
            answers.policyTemplateId
          );
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
        case "listIdentitySources":
          await listIdentitySources(answers.policyStoreId);
          break;
        case "listPolicyTemplates":
          await listPolicyTemplates(answers.policyStoreId);
          break;
        case "putSchema":
          await putSchema(answers.policyStoreId, answers.pathToSchema);
          break;
        case "updatePolicyStore":
          await updatePolicyStore(
            answers.policyStoreId,
            answers.validationMode,
            answers.policyStoreDescription
          );
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
