const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_PRIMARY_KEY,
    databaseId: process.env.COSMOS_DATABASE,
    containerId: process.env.COSMOS_CONTAINER,
    partitionKey: { kind: "Hash", paths: ["/tenantId"] }
  };
  
  module.exports = config;
  
