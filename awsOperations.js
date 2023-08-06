import {
  CreateIdentitySourceCommand,
  CreatePolicyCommand,
  CreatePolicyStoreCommand,
  CreatePolicyTemplateCommand,
  DeletePolicyCommand,
  DeletePolicyStoreCommand,
  GetPolicyCommand,
  GetPolicyStoreCommand,
  GetSchemaCommand,
  IsAuthorizedCommand,
  IsAuthorizedWithTokenCommand,
  ListPoliciesCommand,
  ListPolicyStoresCommand,
  PutSchemaCommand,
  UpdatePolicyCommand,
  VerifiedPermissionsClient,
} from "@aws-sdk/client-verifiedpermissions";
import fs from "fs";
import path from "path";
import Table from "cli-table";

const client = new VerifiedPermissionsClient();

export const listPolicyStores = async (logOutput = true) => {
  const command = new ListPolicyStoresCommand({});
  try {
    const response = await client.send(command);
    const table = new Table({
      head: ["ID", "ARN", "Created Date"],
      colWidths: [24, 80, 40],
    });
    response.policyStores.forEach((store) => {
      table.push([store.policyStoreId, store.arn, store.createdDate]);
    });
    if (logOutput) {
      console.log(table.toString());
    }
    return response.policyStores;
  } catch (error) {
    console.error(`Failed to list policy stores: ${error.message}`);
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
    });
    table.push([
      response.policyId,
      response.policyType,
      response.createdDate,
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

export const createPolicyStore = async (validationMode, logOutput = true) => {
  const input = {
    validationSettings: {
      mode: validationMode,
    },
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

export const getPolicyStore = async (policyStoreId, logOutput = true) => {
  const input = { policyStoreId };
  const command = new GetPolicyStoreCommand(input);
  try {
    const response = await client.send(command);

    const table = new Table({
      head: ["ID", "ARN", "Created Date"],
      colWidths: [24, 80, 40],
    });
    table.push([response.policyStoreId, response.arn, response.createdDate]);
    if (logOutput) {
      console.log(table.toString());
    }
    return response;
  } catch (error) {
    console.error(`Failed to get policy store: ${error.message}`);
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
    console.error(`Failed to get policy store: ${error.message}`);
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

export const listPolicies = async (policyStoreId, logOutput = true) => {
  const input = { policyStoreId };
  const command = new ListPoliciesCommand(input);
  try {
    const response = await client.send(command);
    if (logOutput) {
      const table = new Table({
        head: ["Policy ID", "Policy Type", "Created Date", "Last Updated Date"],
        colWidths: [24, 20, 40, 40],
      });
      response.policies.forEach((policy) => {
        table.push([
          policy.policyId,
          policy.policyType,
          policy.createdDate,
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
  });

  for (const policy of templateLinkedPolicies) {
    table.push([
      policy.policyId,
      policyStoreId,
      policy.createdDate,
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
  const scenarioData = fs.readFileSync(scenarioPath, "utf-8");
  const scenario = JSON.parse(scenarioData);

  if (scenario) {
    console.log(`Starting creating scenario: ${scenario.name}`);
    console.log(`description: ${scenario.description}`);

    const policyStoreId = await createPolicyStore(
      scenario.validationMode,
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
        });

        for (const policy of policies) {
          table.push([policy.policyId, policyStoreId, policy.createdDate]);
        }
        console.log(table.toString());
      }
      console.log(
        `Generating of the ${scenarioName} is finished. Open the AWS console to play around with that.`
      );
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
  appClientId
) => {
  const input = {
    policyStoreId,
    principalEntityType: principalEntityType,
    configuration: {
      cognitoUserPoolConfiguration: {
        userPoolArn: userPoolArn,
        clientIds: [appClientId],
      },
    },
  };
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
  }
};

export const IsAuthorized = async (
  policyStoreId,
  principalEntityType,
  principalEntityId,
  actionEntityType,
  actionEntityId,
  resourceEntityType,
  resourceEntityId
) => {
  const input = {
    policyStoreId,
    principal: {
      entityType: principalEntityType,
      entityId: principalEntityId,
    },
    action: {
      actionType: actionEntityType,
      actionId: actionEntityId,
    },
    resource: {
      entityType: resourceEntityType,
      entityId: resourceEntityId,
    },
    context: {
      contextMap: {},
    },
  };

  const command = new IsAuthorizedCommand(input);

  try {
    console.log("Making authorization decision...");
    const response = await client.send(command);

    console.log("Decision:", response.decision);
    console.log("Determining Policies:", response.determiningPolicies);
    console.log("Errors:", response.errors);
    return response;
  } catch (error) {
    console.error(`Failed to make authorization decision: ${error.message}`);
  }
};

export const isAuthorizedWithToken = async (
  policyStoreId,
  identityToken,
  actionEntityType,
  actionEntityId,
  resourceEntityType,
  resourceEntityId,
  contextKey,
  contextValue
) => {
  const input = {
    policyStoreId,
    identityToken,
    action: {
      actionType: actionEntityType,
      actionId: actionEntityId,
    },
    resource: {
      entityType: resourceEntityType,
      entityId: resourceEntityId,
    },
    context: {
      contextMap: { [contextKey]: { string: contextValue } },
    },
  };

  console.dir(input, { depth: null });

  const command = new IsAuthorizedWithTokenCommand(input);

  try {
    console.log("Making authorization decision with token...");
    const response = await client.send(command);

    console.log("Decision:", response.decision);
    console.log("Determining Policies:", response.determiningPolicies);
    console.log("Errors:", response.errors);
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
  });
  for (const policy of policies) {
    table.push([policy.policyId, policyStoreId, policy.createdDate]);
  }
  console.log(table.toString());
  console.log(
    `Generating of the ${scenario.scenarioName} is finished. Open the AWS console to play around with that.`
  );
};
