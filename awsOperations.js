import {
  CreatePolicyCommand,
  CreatePolicyStoreCommand,
  DeletePolicyCommand,
  DeletePolicyStoreCommand,
  GetPolicyCommand,
  GetPolicyStoreCommand,
  GetSchemaCommand,
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
export const listPolicyStores = async () => {
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
    console.log(table.toString());
  } catch (error) {
    console.error(`Failed to list policy stores: ${error.message}`);
  }
};

export const getSchema = async (policyStoreId) => {
  const input = { policyStoreId };
  const command = new GetSchemaCommand(input);
  try {
    const response = await client.send(command);
    console.log(`Schema for policy store ID ${policyStoreId}:`);
    console.log(response.schema);
  } catch (error) {
    console.error(`Failed to get schema: ${error.message}`);
  }
};

export const getPolicy = async (policyStoreId, policyId) => {
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
    console.log(table.toString());
  } catch (error) {
    console.error(`Failed to get policy: ${error.message}`);
  }
};

export const updateStaticPolicy = async (
  policyStoreId,
  policyId,
  policyPath,
  policyDescription
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
    console.log("Updating a policy...");
    const response = await client.send(command);
    console.log(`Policy updated with ID: ${response.policyId}`);
  } catch (error) {
    console.error(`Failed to update policy: ${error.message}`);
  }
};

export const createPolicyStore = async (validationMode) => {
  const input = {
    validationSettings: {
      mode: validationMode,
    },
  };
  const createCommand = new CreatePolicyStoreCommand(input);
  try {
    const response = await client.send(createCommand);
    console.log(`Policy store created with ID: ${response.policyStoreId}`);
  } catch (error) {
    console.error(`Failed to create policy store: ${error.message}`);
  }
};

export const getPolicyStore = async (policyStoreId) => {
  const input = { policyStoreId };
  const command = new GetPolicyStoreCommand(input);
  try {
    const response = await client.send(command);

    const table = new Table({
      head: ["ID", "ARN", "Created Date"],
      colWidths: [24, 80, 40],
    });
    table.push([response.policyStoreId, response.arn, response.createdDate]);
    console.log(table.toString());
  } catch (error) {
    console.error(`Failed to get policy store: ${error.message}`);
  }
};

export const deletePolicyStore = async (policyStoreId) => {
  const input = { policyStoreId };

  const command = new DeletePolicyStoreCommand(input);

  try {
    console.log("Deleting a policy store...");
    await client.send(command);
    `Policy store deleted with ID: ${policyStoreId}`;
  } catch (error) {
    console.error(`Failed to get policy store: ${error.message}`);
  }
};

export const putSchema = async (policyStoreId, pathToSchema) => {
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
    console.log("Adding schema to a policy store...");
    const response = await client.send(command);
    console.log(
      `Schema put successfully for policy store ID: ${response.policyStoreId}`
    );
  } catch (error) {
    console.error(`Failed to put schema: ${error.message}`);
  }
};

export const createStaticPolicy = async (
  policyStoreId,
  policyPath,
  description
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
    console.log("Creating a static policy...");
    const response = await client.send(command);
    console.log(`Static policy created with ID: ${response.policyId}`);
  } catch (error) {
    console.error(`Failed to create static policy: ${error.message}`);
  }
};

export const deletePolicy = async (policyStoreId, policyId) => {
  const input = { policyStoreId, policyId };
  const command = new DeletePolicyCommand(input);
  try {
    console.log("Deleting a policy...");
    await client.send(command);
    console.log(`Policy deleted with ID: ${policyId}`);
  } catch (error) {
    console.error(`Failed to delete policy: ${error.message}`);
  }
};

export const listPolicies = async (policyStoreId) => {
  const input = { policyStoreId };
  const command = new ListPoliciesCommand(input);
  try {
    const response = await client.send(command);
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
  } catch (error) {
    console.error(`Failed to list policies: ${error.message}`);
  }
};
