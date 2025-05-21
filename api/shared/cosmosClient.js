const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = "supportTicketsDB";
const containerId = "tickets";

let container;

async function getContainer() {
  if (container) return container;

  const client = new CosmosClient({ endpoint, key });

  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  const { container: createdContainer } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: { kind: "Hash", paths: ["/email"] },
  });

  container = createdContainer;
  return container;
}

module.exports = { getContainer };
