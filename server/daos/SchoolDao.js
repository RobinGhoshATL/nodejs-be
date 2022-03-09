const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../../config/config");
const dbContext = require("../../config/databaseContext");  //** TODO  */


// <CreateClientObjectDatabaseContainer>
const { endpoint, key, databaseId, containerId } = config;


module.exports={
    getUserSchoolDetails: async function (schoolId, callback) {
        
        console.log('schoolId' + schoolId);

        const client = new CosmosClient({ endpoint, key });

        const database = client.database(databaseId);
        const container = database.container(containerId);

        // Make sure Tasks database is already setup. If not, create it.
        await dbContext.create(client, databaseId, containerId);
 
        try {
            console.log(`Querying container: systems`);

            // query to return all items
            const querySpec = {
                query: "SELECT * from c where c.tenantId = '" + schoolId + "'"
            };
    
            // read all items in the Items container
            const { resources: items } = await container.items.query(querySpec).fetchAll();
           
            callback(null,items);
        }
        catch (err) {
            callback(err.message,null);
        }
        
    }

}



