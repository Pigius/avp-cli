import {
  BatchIsAuthorizedCommand,
  BatchIsAuthorizedWithTokenCommand,
  CreateIdentitySourceCommand,
  DeleteIdentitySourceCommand,
  CreatePolicyCommand,
  CreatePolicyStoreCommand,
  CreatePolicyTemplateCommand,
  DeletePolicyCommand,
  DeletePolicyStoreCommand,
  DeletePolicyTemplateCommand,
  GetPolicyCommand,
  GetPolicyStoreCommand,
  GetPolicyTemplateCommand,
  GetIdentitySourceCommand,
  GetSchemaCommand,
  IsAuthorizedCommand,
  IsAuthorizedWithTokenCommand,
  ListPoliciesCommand,
  ListPolicyStoresCommand,
  ListIdentitySourcesCommand,
  ListPolicyTemplatesCommand,
  PutSchemaCommand,
  UpdatePolicyCommand,
  UpdatePolicyStoreCommand,
  UpdateIdentitySourceCommand,
  UpdatePolicyTemplateCommand,
  VerifiedPermissionsClient,
} from "@aws-sdk/client-verifiedpermissions";
import fs from "fs";
import path from "path";
import Table from "cli-table3";
import os from "os";

const client = new VerifiedPermissionsClient();

export const listPolicyStores = async (logOutput = true) => {
  const command = new ListPolicyStoresCommand({});
  try {
    const response = await client.send(command);
    const table = new Table({
      head: ["ID", "ARN", "Description", "Created Date"],
      colWidths: [24, 80, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    response.policyStores.forEach((store) => {
      table.push([
        store.policyStoreId,
        store.arn,
        store.description,
        formatDate(store.createdDate),
      ]);
    });
    if (logOutput) {
      console.log(table.toString());
    }
    return response.policyStores;
  } catch (error) {
    console.error(`Failed to list policy stores: ${error.message}`);
  }
};

export const listIdentitySources = async (policyStoreId, logOutput = true) => {
  const command = new ListIdentitySourcesCommand({ policyStoreId });
  try {
    const response = await client.send(command);
    const table = new Table({
      head: ["ID", "principalEntityType", "details", "Created Date"],
      colWidths: [24, 80, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    response.identitySources.forEach((source) => {
      table.push([
        source.identitySourceId,
        source.principalEntityType,
        source.details,
        source.createdDate,
      ]);
    });
    if (logOutput) {
      console.log(table.toString());
    }
    return response.identitySources;
  } catch (error) {
    console.error(`Failed to list identity sources: ${error.message}`);
  }
};

export const getSchema = async (policyStoreId, logOutput = true) => {
  const input = { policyStoreId };
  const command = new GetSchemaCommand(input);
  try {
    const response = await client.send(command);
    if (logOutput) {
      console.log(`Schema for policy store ID ${policyStoreId}:`);
      console.log(response.schema);
    }
    return response.schema;
  } catch (error) {
    console.error(`Failed to get schema: ${error.message}`);
  }
};

export const getPolicy = async (policyStoreId, policyId, logOutput = true) => {
  const input = { policyStoreId, policyId };
  const command = new GetPolicyCommand(input);
  try {
    const response = await client.send(command);
    const table = new Table({
      head: ["Policy ID", "Policy Type", "Created Date", "Last Updated Date"],
      colWidths: [24, 20, 40, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    table.push([
      response.policyId,
      response.policyType,
      formatDate(response.createdDate),
      response.lastUpdatedDate,
    ]);
    if (logOutput) {
      console.log(table.toString());
    }
    return response;
  } catch (error) {
    console.error(`Failed to get policy: ${error.message}`);
  }
};

export const getPolicyTemplate = async (
  policyStoreId,
  policyTemplateId,
  logOutput = true
) => {
  const input = { policyStoreId, policyTemplateId };
  const command = new GetPolicyTemplateCommand(input);
  try {
    const response = await client.send(command);
    const table = new Table({
      head: ["Policy ID", "statement", "Created Date", "Last Updated Date"],
      colWidths: [24, 20, 40, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    table.push([
      response.policyTemplateId,
      response.statement,
      formatDate(response.createdDate),
      response.lastUpdatedDate,
    ]);
    if (logOutput) {
      console.log(table.toString());
    }
    return response;
  } catch (error) {
    console.error(`Failed to get policy template: ${error.message}`);
  }
};

export const updateStaticPolicy = async (
  policyStoreId,
  policyId,
  policyPath,
  policyDescription,
  logOutput = true
) => {
  const policy = fs.readFileSync(policyPath, "utf8");

  const input = {
    policyStoreId,
    policyId,
    definition: {
      static: {
        description: policyDescription,
        statement: policy,
      },
    },
  };
  const command = new UpdatePolicyCommand(input);
  try {
    if (logOutput) {
      console.log("Updating a policy...");
    }
    const response = await client.send(command);
    if (logOutput) {
      console.log(`Policy updated with ID: ${response.policyId}`);
    }
    return response.policyId;
  } catch (error) {
    console.error(`Failed to update policy: ${error.message}`);
  }
};

export const createPolicyStore = async (
  validationMode,
  policyStoreDescription,
  logOutput = true
) => {
  const input = {
    validationSettings: {
      mode: validationMode,
    },
    description: policyStoreDescription,
  };
  const createCommand = new CreatePolicyStoreCommand(input);
  try {
    const response = await client.send(createCommand);
    if (logOutput) {
      console.log(`Policy store created with ID: ${response.policyStoreId}`);
    }
    return response.policyStoreId;
  } catch (error) {
    console.error(`Failed to create policy store: ${error.message}`);
  }
};

export const updatePolicyStore = async (
  policyStoreId,
  validationMode,
  policyStoreDescription,
  logOutput = true
) => {
  const input = {
    policyStoreId,
    validationSettings: {
      mode: validationMode,
    },
    description: policyStoreDescription,
  };
  const createCommand = new UpdatePolicyStoreCommand(input);
  try {
    const response = await client.send(createCommand);
    if (logOutput) {
      console.log(`Policy store updated with ID: ${response.policyStoreId}`);
    }
    return response.policyStoreId;
  } catch (error) {
    console.error(`Failed to update policy store: ${error.message}`);
  }
};

export const updatePolicyTemplate = async (
  policyStoreId,
  policyTemplateId,
  statement,
  description,
  logOutput = true
) => {
  const input = {
    policyStoreId,
    policyTemplateId,
    statement,
    description,
  };
  const updateCommand = new UpdatePolicyTemplateCommand(input);
  try {
    const response = await client.send(updateCommand);
    if (logOutput) {
      console.log(
        `Policy template updated with ID: ${response.policyTemplateId}`
      );
    }
    return response.policyTemplateId;
  } catch (error) {
    console.error(`Failed to update policy template: ${error.message}`);
  }
};

export const getPolicyStore = async (policyStoreId, logOutput = true) => {
  const input = { policyStoreId };
  const command = new GetPolicyStoreCommand(input);
  try {
    const response = await client.send(command);

    const table = new Table({
      head: ["ID", "ARN", "Description", "Created Date"],
      colWidths: [24, 80, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    table.push([
      response.policyStoreId,
      response.arn,
      response.description,
      formatDate(response.createdDate),
    ]);
    if (logOutput) {
      console.log(table.toString());
    }
    return response;
  } catch (error) {
    console.error(`Failed to get policy store: ${error.message}`);
  }
};

export const getIdentitySource = async (
  policyStoreId,
  identitySourceId,
  logOutput = true
) => {
  const input = { policyStoreId, identitySourceId };
  const command = new GetIdentitySourceCommand(input);
  try {
    const response = await client.send(command);
    const table = new Table({
      head: ["Policy Store", "identitySourceId", "Created Date"],
      colWidths: [24, 80, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    table.push([
      response.policyStoreId,
      response.identitySourceId,
      formatDate(response.createdDate),
    ]);
    if (logOutput) {
      console.log(table.toString());
    }
    return response;
  } catch (error) {
    console.error(`Failed to get identity source: ${error.message}`);
  }
};

export const deletePolicyStore = async (policyStoreId, logOutput = true) => {
  const input = { policyStoreId };

  const command = new DeletePolicyStoreCommand(input);

  try {
    if (logOutput) {
      console.log("Deleting a policy store...");
    }
    await client.send(command);
    if (logOutput) {
      console.log(`Policy store deleted with ID: ${policyStoreId}`);
    }
  } catch (error) {
    console.error(`Failed to delete policy store: ${error.message}`);
  }
};

export const putSchema = async (
  policyStoreId,
  pathToSchema,
  logOutput = true
) => {
  const schemaJson = JSON.parse(
    fs.readFileSync(path.resolve(pathToSchema), "utf-8")
  );
  const schema = JSON.stringify(schemaJson);
  const input = {
    policyStoreId,
    definition: {
      cedarJson: schema,
    },
  };
  const command = new PutSchemaCommand(input);

  try {
    if (logOutput) {
      console.log("Adding schema to a policy store...");
    }
    const response = await client.send(command);
    if (logOutput) {
      console.log(
        `Schema put successfully for policy store ID: ${response.policyStoreId}`
      );
    }
    return response.policyStoreId;
  } catch (error) {
    console.error(`Failed to put schema: ${error.message}`);
  }
};

export const createStaticPolicy = async (
  policyStoreId,
  policyPath,
  description,
  logOutput = true
) => {
  const policy = fs.readFileSync(policyPath, "utf8");

  const input = {
    policyStoreId,
    definition: {
      static: {
        description: description,
        statement: policy,
      },
    },
  };
  const command = new CreatePolicyCommand(input);

  try {
    if (logOutput) {
      console.log("Creating a static policy...");
    }
    const response = await client.send(command);
    if (logOutput) {
      console.log(`Static policy created with ID: ${response.policyId}`);
    }
    return response;
  } catch (error) {
    console.error(`Failed to create static policy: ${error.message}`);
  }
};

export const createPolicyTemplate = async (
  policyStoreId,
  policyPath,
  description,
  logOutput = true
) => {
  const policy = fs.readFileSync(policyPath, "utf8");

  const params = {
    policyStoreId: policyStoreId,
    statement: policy,
    description: description,
  };
  try {
    const response = await client.send(new CreatePolicyTemplateCommand(params));
    if (logOutput) {
      console.log(`Policy template created successfully.`);
    }
    return response;
  } catch (error) {
    if (logOutput) {
      console.error(
        `An error occurred while creating the policy template: ${error}`
      );
    }
  }
};

export const deletePolicy = async (
  policyStoreId,
  policyId,
  logOutput = true
) => {
  const input = { policyStoreId, policyId };
  const command = new DeletePolicyCommand(input);
  try {
    if (logOutput) {
      console.log("Deleting a policy...");
    }
    await client.send(command);
    if (logOutput) {
      console.log(`Policy deleted with ID: ${policyId}`);
    }
  } catch (error) {
    console.error(`Failed to delete policy: ${error.message}`);
  }
};

export const deletePolicyTemplate = async (
  policyStoreId,
  policyTemplateId,
  logOutput = true
) => {
  const input = { policyStoreId, policyTemplateId };
  const command = new DeletePolicyTemplateCommand(input);
  try {
    if (logOutput) {
      console.log("Deleting a policy template...");
    }
    await client.send(command);
    if (logOutput) {
      console.log(
        `Policy template deleted with ID: ${policyTemplateId} from policy store id ${policyStoreId}`
      );
    }
  } catch (error) {
    console.error(`Failed to delete policy template: ${error.message}`);
  }
};

export const listPolicies = async (policyStoreId, logOutput = true) => {
  const input = { policyStoreId };
  const command = new ListPoliciesCommand(input);
  try {
    const response = await client.send(command);
    if (logOutput) {
      const table = new Table({
        head: ["Policy ID", "Policy Type", "Created Date", "Last Updated Date"],
        colWidths: [24, 20, 40, 40],
        wordWrap: true,
        wrapOnWordBoundary: false,
      });
      response.policies.forEach((policy) => {
        table.push([
          policy.policyId,
          policy.policyType,
          formatDate(policy.createdDate),
          policy.lastUpdatedDate,
        ]);
      });
      console.log(table.toString());
    }
    return response.policies;
  } catch (error) {
    console.error(`Failed to list policies: ${error.message}`);
  }
};

export const listPolicyTemplates = async (policyStoreId, logOutput = true) => {
  const input = { policyStoreId };
  const command = new ListPolicyTemplatesCommand(input);
  try {
    const response = await client.send(command);
    if (logOutput) {
      const table = new Table({
        head: [
          "Policy Template ID",
          "Description",
          "Created Date",
          "Last Updated Date",
        ],
        colWidths: [24, 20, 40, 40],
        wordWrap: true,
        wrapOnWordBoundary: false,
      });
      response.policyTemplates.forEach((policyTemplate) => {
        table.push([
          policyTemplate.policyTemplateId,
          policyTemplate.description,
          formatDate(policyTemplate.createdDate),
          policyTemplate.lastUpdatedDate,
        ]);
      });
      console.log(table.toString());
    }
    return response.policyTemplates;
  } catch (error) {
    console.error(`Failed to list policy templates: ${error.message}`);
  }
};

const handleTemplateLinkedPoliciesScenario = async (
  policyStoreId,
  scenario
) => {
  const policyTemplate = scenario.policyTemplate;
  const createdPolicyTemplate = await createPolicyTemplate(
    policyStoreId,
    policyTemplate.path,
    policyTemplate.description,
    false
  );
  console.log(
    `Policy template created with ID: ${createdPolicyTemplate.policyTemplateId}`
  );
  const policyTemplateId = createdPolicyTemplate.policyTemplateId;

  const templateLinkedPolicies = [];
  for (const templateLinkedPolicy of scenario.templateLinkedPolicies) {
    const principal = {
      entityType: templateLinkedPolicy.principal.entityType,
      entityId: templateLinkedPolicy.principal.entityId,
    };
    const resource = {
      entityType: templateLinkedPolicy.resource.entityType,
      entityId: templateLinkedPolicy.resource.entityId,
    };

    const createdTemplateLinkedPolicy = await createTemplatePolicy(
      policyStoreId,
      policyTemplateId,
      principal,
      resource,
      false
    );
    console.log(
      `Template-linked policy created with ID: ${createdTemplateLinkedPolicy.policyId}`
    );
    templateLinkedPolicies.push({
      ...createdTemplateLinkedPolicy,
      principal,
      resource,
      policyTemplate: policyTemplate.description,
    });
  }

  const table = new Table({
    head: [
      "Template-Linked Policy ID",
      "Policy Store ID",
      "Created Date",
      "Principal",
      "Resource",
      "Policy Template",
    ],
    colWidths: [40, 40, 40, 40, 40, 40],
    wordWrap: true,
    wrapOnWordBoundary: false,
  });

  for (const policy of templateLinkedPolicies) {
    table.push([
      policy.policyId,
      policyStoreId,
      formatDate(policy.createdDate),
      `${policy.principal.entityType}::${policy.principal.entityId}`,
      `${policy.resource.entityType}::${policy.resource.entityId}`,
      policy.policyTemplate,
    ]);
  }
  console.log(table.toString());
};

export const useScenario = async (
  scenarioName,
  userPoolArn = null,
  appClientId = null
) => {
  const scenarioPath = `./scenarios/${scenarioName}/${scenarioName}.json`;
  console.log(scenarioPath);
  const scenarioData = fs.readFileSync(scenarioPath, "utf-8");
  const scenario = JSON.parse(scenarioData);

  if (scenario) {
    console.log(`Starting creating scenario: ${scenario.name}`);
    console.log(`description: ${scenario.description}`);

    const policyStoreId = await createPolicyStore(
      scenario.validationMode,
      scenario.policyStoreDescription,
      false
    );
    console.log(`Policy store created with ID: ${policyStoreId}`);

    if (policyStoreId) {
      await putSchema(policyStoreId, scenario.schemaPath, false);
      console.log(
        `Schema put successfully for policy store ID: ${policyStoreId}`
      );

      if (scenarioName === "ecommercePolicyTemplateScenario") {
        await handleTemplateLinkedPoliciesScenario(policyStoreId, scenario);
      } else if (scenarioName === "ecommerceCognitoIntegrationScenario") {
        await handleCognitoIntegrationScenario(
          policyStoreId,
          scenario,
          userPoolArn,
          appClientId
        );
      } else if (scenarioName === "ecommerceCognitoGroupsScenario") {
        await handleCognitoGroupsScenario(
          policyStoreId,
          scenario,
          userPoolArn,
          appClientId
        );
      } else {
        const policies = [];
        for (const policy of scenario.policies) {
          const createdPolicy = await createStaticPolicy(
            policyStoreId,
            policy.path,
            policy.description,
            false
          );
          console.log(
            `Static policy created with ID: ${createdPolicy.policyId}`
          );
          policies.push(createdPolicy);
        }

        const table = new Table({
          head: ["Policy ID", "Policy Store ID", "Created Date"],
          colWidths: [40, 40, 40],
          wordWrap: true,
          wrapOnWordBoundary: false,
        });

        for (const policy of policies) {
          table.push([
            policy.policyId,
            policyStoreId,
            formatDate(policy.createdDate),
          ]);
        }
        console.log(table.toString());
      }
      console.log(
        `Generating of the ${scenarioName} is finished. Open the AWS console to play around with that.`
      );
      console.log(generateTestMessage(scenario));
    }
  } else {
    console.error(`Scenario ${scenarioName} not found`);
  }
};

export const createTemplatePolicy = async (
  policyStoreId,
  policyTemplateId,
  principal,
  resource,
  logOutput = true
) => {
  const input = {
    policyStoreId,
    definition: {
      templateLinked: {
        policyTemplateId,
        principal,
        resource,
      },
    },
  };
  const command = new CreatePolicyCommand(input);

  try {
    if (logOutput) {
      console.log("Creating a template-linked policy...");
    }
    const response = await client.send(command);
    if (logOutput) {
      console.log(
        `Template-linked policy created with ID: ${response.policyId}`
      );
    }
    return response;
  } catch (error) {
    console.error(`Failed to create template-linked policy: ${error.message}`);
  }
};

export const createIdentitySource = async (
  policyStoreId,
  principalEntityType,
  userPoolArn,
  appClientId,
  groupEntityType = null
) => {
  const configuration = {
    cognitoUserPoolConfiguration: {
      userPoolArn: userPoolArn,
      clientIds: [appClientId],
    },
  };

  if (groupEntityType) {
    configuration.cognitoUserPoolConfiguration["groupConfiguration"] = {
      groupEntityType: groupEntityType,
    };
  }

  const input = {
    policyStoreId,
    principalEntityType,
    configuration: configuration,
  };

  console.log(input);

  const command = new CreateIdentitySourceCommand(input);

  try {
    console.log("Creating an identity source...");
    const response = await client.send(command);
    console.log(
      `Identity source created with ID: ${response.identitySourceId}`
    );
    return response;
  } catch (error) {
    console.error(`Failed to create identity source: ${error.message}`);
    throw error;
  }
};

export const updateIdentitySource = async (
  policyStoreId,
  identitySourceId,
  userPoolArn,
  principalEntityType,
  appClientId
) => {
  const input = {
    policyStoreId,
    identitySourceId,
    principalEntityType,
    updateConfiguration: {
      cognitoUserPoolConfiguration: {
        userPoolArn: userPoolArn,
        clientIds: [appClientId],
      },
    },
  };
  const command = new UpdateIdentitySourceCommand(input);

  try {
    console.log("Updating an identity source...");
    const response = await client.send(command);
    console.log(
      `Identity source updated with ID: ${response.identitySourceId}`
    );
    return response;
  } catch (error) {
    console.error(`Failed to update identity source: ${error.message}`);
  }
};

export const deleteIdentitySource = async (
  policyStoreId,
  identitySourceId,
  logOutput = true
) => {
  const input = { policyStoreId, identitySourceId };

  const command = new DeleteIdentitySourceCommand(input);

  try {
    if (logOutput) {
      console.log("Deleting a identity source...");
    }
    await client.send(command);
    if (logOutput) {
      console.log(
        `Identity source deleted with ID: ${identitySourceId} from policy store id ${policyStoreId}`
      );
    }
  } catch (error) {
    console.error(`Failed to delete identity source: ${error.message}`);
  }
};

export const IsAuthorized = async (testFilePath) => {
  const fileContent = fs.readFileSync(testFilePath, "utf8");
  const input = JSON.parse(fileContent);
  if (input.policyStoreId === "your-policy-store-id") {
    console.error(
      "Please set the 'policyStoreId' in your JSON file before proceeding."
    );
    return;
  }

  const command = new IsAuthorizedCommand(input);

  try {
    console.log("Making authorization decision...");
    const response = await client.send(command);

    handleAuthorizationResponse(
      response,
      input.policyStoreId,
      input.principal,
      input.action,
      input.resource,
      input.context
    );

    return response;
  } catch (error) {
    console.error(`Failed to make authorization decision: ${error.message}`);
  }
};

export const batchIsAuthorized = async (batchTestFilePath) => {
  const fileContent = fs.readFileSync(batchTestFilePath, "utf8");
  const input = JSON.parse(fileContent);

  if (input.policyStoreId === "your-policy-store-id") {
    console.error(
      "Please set the 'policyStoreId' in your JSON file before proceeding."
    );
    return;
  }

  // batch authorization allows to process up to 30 authorization decisions for a single principal or resource in a single API call.
  if (input.requests && input.requests.length > 30) {
    console.error(
      "Batch request limit exceeded. Only up to 30 requests are allowed."
    );
    return;
  }

  const command = new BatchIsAuthorizedCommand(input);

  try {
    console.log("Making batch authorization decision...");
    const response = await client.send(command);

    handleBatchAuthorizationResponse(response, input.policyStoreId);
  } catch (error) {
    console.error(`Failed to make authorization decision: ${error.message}`);
  }
};

export const batchIsAuthorizedWithToken = async (
  batchWithTokenTestFilePath
) => {
  const fileContent = fs.readFileSync(batchWithTokenTestFilePath, "utf8");
  const input = JSON.parse(fileContent);

  if (input.policyStoreId === "your-policy-store-id") {
    console.error(
      "Please set the 'policyStoreId' in your JSON file before proceeding."
    );
    return;
  }

  if (input.accessToken === "ACCESS_TOKEN_HERE") {
    console.error("Add access token in your JSON file before proceeding.");
    return;
  }

  // batch authorization with token allows to process up to 30 authorization decisions for a single principal or resource in a single API call.
  if (input.requests && input.requests.length > 30) {
    console.error(
      "Batch request limit exceeded. Only up to 30 requests are allowed."
    );
    return;
  }

  const command = new BatchIsAuthorizedWithTokenCommand(input);

  try {
    console.log("Making batch with token authorization decision...");
    const response = await client.send(command);

    handleBatchAuthorizationWithTokenResponse(response, input);
  } catch (error) {
    console.error(`Failed to make authorization decision: ${error.message}`);
  }
};

export const isAuthorizedWithToken = async (testFilePath) => {
  const fileContent = fs.readFileSync(testFilePath, "utf8");
  const input = JSON.parse(fileContent);
  if (input.policyStoreId === "your-policy-store-id") {
    console.error(
      "Please set the 'policyStoreId' in your JSON file before proceeding."
    );
    return;
  }
  if (input.accessToken === "ACCESS_TOKEN_HERE") {
    console.error("Add access token in your JSON file before proceeding.");
    return;
  }

  const command = new IsAuthorizedWithTokenCommand(input);

  try {
    const response = await client.send(command);

    handleAuthorizationWithTokenResponse(
      response,
      input.policyStoreId,
      input.action,
      input.resource,
      input.context
    );

    return response;
  } catch (error) {
    console.error(`Failed to make authorization decision: ${error.message}`);
  }
};

export const handleCognitoIntegrationScenario = async (
  policyStoreId,
  scenario,
  userPoolArn,
  appClientId
) => {
  try {
    await createIdentitySource(
      policyStoreId,
      scenario.principalEntityType,
      userPoolArn,
      appClientId
    );
    const policies = [];

    for (const policy of scenario.policies) {
      const createdPolicy = await createStaticPolicy(
        policyStoreId,
        policy.path,
        policy.description,
        false
      );
      console.log(`Static policy created with ID: ${createdPolicy.policyId}`);
      policies.push(createdPolicy);
    }
    const table = new Table({
      head: ["Policy ID", "Policy Store ID", "Created Date"],
      colWidths: [40, 40, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    for (const policy of policies) {
      table.push([
        policy.policyId,
        policyStoreId,
        formatDate(policy.createdDate),
      ]);
    }
    console.log(table.toString());
    console.log(
      `Generating of the ${scenario.scenarioName} is finished. Open the AWS console to play around with that.`
    );
    console.log(generateTestMessage(scenario));
  } catch (error) {
    console.error(`Scenario execution failed: ${error.message}`);
  }
};

export const handleCognitoGroupsScenario = async (
  policyStoreId,
  scenario,
  userPoolArn,
  appClientId
) => {
  try {
    await createIdentitySource(
      policyStoreId,
      scenario.principalEntityType,
      userPoolArn,
      appClientId,
      scenario.groupEntityType
    );
    const policies = [];

    for (const policy of scenario.policies) {
      try {
        const userPoolId = extractUserPoolIdFromArn(userPoolArn);

        const policyTemplateContent = fs.readFileSync(policy.path, "utf8");

        const policyContent = policyTemplateContent.replace(
          "<user-pool-goes-here>",
          userPoolId
        );

        // Write the interpolated policy content to a temporary file
        const policyFilePath = await writePolicyToFile(policyContent);

        const createdPolicy = await createStaticPolicy(
          policyStoreId,
          policyFilePath,
          policy.description,
          true
        );

        // Policy has been created; we can now clean up the temporary file
        await fs.promises.unlink(policyFilePath);

        if (createdPolicy.policyId) {
          policies.push(createdPolicy);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    const table = new Table({
      head: ["Policy ID", "Policy Store ID", "Created Date"],
      colWidths: [40, 40, 40],
      wordWrap: true,
      wrapOnWordBoundary: false,
    });
    for (const policy of policies) {
      table.push([
        policy.policyId,
        policyStoreId,
        formatDate(policy.createdDate),
      ]);
    }
    console.log(table.toString());
    console.log(
      `Generating of the ${scenario.scenarioName} is finished. Open the AWS console to play around with that.`
    );
    console.log(generateTestMessage(scenario));
  } catch (error) {
    console.error(`Scenario execution failed: ${error.message}`);
  }
};

const handleAuthorizationResponse = (
  response,
  policyStoreId,
  principal,
  action,
  resource,
  context
) => {
  const table = new Table({
    head: [
      "Decision",
      "Determining Policies",
      "Errors",
      "Policy Store ID",
      "Principal",
      "Action",
      "Resource",
      "Context",
    ],
    colWidths: [10, 30, 20, 30, 30, 30, 30, 30],
    wordWrap: true,
    wrapOnWordBoundary: false,
  });

  const determiningPolicies = response.determiningPolicies
    .map((policy) => policy.policyId)
    .join(", ");
  const errors = response.errors
    .map((error) => error.errorDescription)
    .join(", ");

  table.push([
    response.decision,
    determiningPolicies,
    errors,
    policyStoreId,
    `${principal.entityType}::${principal.entityId}`,
    `${action.actionType}::${action.actionId}`,
    `${resource.entityType}::${resource.entityId}`,
    JSON.stringify(context.contextMap),
  ]);

  console.log(table.toString());
};
const handleAuthorizationWithTokenResponse = (
  response,
  policyStoreId,
  action,
  resource,
  context
) => {
  const table = new Table({
    head: [
      "Decision",
      "Determining Policies",
      "Errors",
      "Policy Store ID",
      "Principal",
      "Action",
      "Resource",
      "Context",
    ],
    colWidths: [10, 30, 20, 30, 30, 30, 30, 30],
    wordWrap: true,
    wrapOnWordBoundary: false,
  });

  const determiningPolicies = response.determiningPolicies
    .map((policy) => policy.policyId)
    .join(", ");
  const errors = response.errors
    .map((error) => error.errorDescription)
    .join(", ");

  table.push([
    response.decision,
    determiningPolicies,
    errors,
    policyStoreId,
    `${response.principal.entityType}::${response.principal.entityId}`,
    `${action.actionType}::${action.actionId}`,
    `${resource.entityType}::${resource.entityId}`,
    JSON.stringify(context.contextMap),
  ]);

  console.log(table.toString());
};

const handleBatchAuthorizationResponse = (response, policyStoreId) => {
  const table = new Table({
    head: [
      "Decision",
      "Determining Policies",
      "Errors",
      "Policy Store ID",
      "Principal",
      "Action",
      "Resource",
    ],
    colWidths: [10, 30, 20, 30, 30, 30, 30, 30],
    wordWrap: true,
    wrapOnWordBoundary: false,
  });

  response.results.forEach((result) => {
    const determiningPolicies = result.determiningPolicies
      .map((policy) => policy.policyId)
      .join(", ");
    const errors = result.errors
      .map((error) => error.errorDescription)
      .join(", ");

    const request = result.request;
    const principal = `${request.principal.entityType}::${request.principal.entityId}`;
    const action = `${request.action.actionType}::${request.action.actionId}`;
    const resource = `${request.resource.entityType}::${request.resource.entityId}`;

    table.push([
      result.decision,
      determiningPolicies,
      errors,
      policyStoreId,
      principal,
      action,
      resource,
    ]);
  });

  console.log(table.toString());
};

const handleBatchAuthorizationWithTokenResponse = (response, input) => {
  const table = new Table({
    head: [
      "Decision",
      "Determining Policies",
      "Errors",
      "Policy Store ID",
      "Principal",
      "Action",
      "Resource",
      "Context",
    ],
    colWidths: [10, 30, 20, 30, 30, 30, 30, 30],
    wordWrap: true,
    wrapOnWordBoundary: false,
  });

  response.results.forEach((singleResult) => {
    const determiningPolicies = singleResult.determiningPolicies
      ? singleResult.determiningPolicies
          .map((policy) => policy.policyId)
          .join(", ")
      : "";
    const errors = singleResult.errors
      ? singleResult.errors.map((error) => error.errorDescription).join(", ")
      : "";

    console.log("SingleResult: ", singleResult);

    table.push([
      singleResult.decision,
      determiningPolicies,
      errors,
      input.policyStoreId,
      `${response.principal.entityType}::${response.principal.entityId}`,
      `${singleResult.request.action.actionType}::${singleResult.request.action.actionId}`,
      `${singleResult.request.resource.entityType}::${singleResult.request.resource.entityId}`,
      JSON.stringify(
        singleResult.request.context
          ? singleResult.request.context.contextMap
          : {}
      ),
    ]);
  });

  console.log(table.toString());
};

const generateTestMessage = (scenario) => {
  let message = "\nConsider testing it with our prepared test scenarios:\n";
  message +=
    "Either use `Test Scenario` in main CLI to select the specific test scenario, or use below path as argument to `IsAuthorized` from the manual approach option of the CLI:\n Remember to update the policy-store-id within files.\n";

  for (const test of scenario.tests) {
    message += `- ${test.path} (${test.description}) ${test.type}\n`;
  }

  return message;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

function extractUserPoolIdFromArn(userPoolArn) {
  const arnParts = userPoolArn.split(":");
  const userPoolId =
    arnParts.length > 1 ? arnParts[arnParts.length - 1].split("/")[1] : null;

  if (!userPoolId) {
    throw new Error("Invalid ARN format. Unable to extract User Pool ID.");
  }

  return userPoolId;
}

async function writePolicyToFile(policyContent) {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `policy-${Date.now()}.cedar`);
  await fs.promises.writeFile(tempFilePath, policyContent);
  return tempFilePath;
}
