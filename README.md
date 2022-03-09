# Developing a Node.js app that communicates with COSMOS DB, Blob Storage and SQL Server
The code included in this sample is intended to get you going with a simple Node.js Express application that connects to Azure Cosmos DB, SQL DB and Blob Storage with Express. It demonstrates how to interact with these Azure accounts by using npm packages.

## Solution architecture
Below is a diagram of the solution architecture you will build in this project. Please study this carefully, so you understand the entire solution as you will be working on  various components.

![RG Basic Tab](images/solution_diagram.jpg)
&nbsp;

In our solution we only talk about back end part i.e. Node.js application that connects to Azure Cosmos DB, SQL DB and Blob Storage. You can see that Node.js app communicates with all tree Azure storage accounts.

## Prerequisites before you download any code

* Before you can run this sample, you must have the following perquisites:
	* An active Azure Cosmos DB account - If you don't have an account, refer to the [Create an Azure Cosmos DB account](https://docs.microsoft.com/en-us/azure/cosmos-db/create-sql-api-nodejs#create-a-database-account) article.
    * An active Azure SQL DB account - If you don't have an account, refer to the [Create SQL DB account](https://docs.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-portal) article.
    * An active Azure Storage account - If you don't have an account, refer to the [Create Storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)
	* [Node.js](https://nodejs.org/en/) version v14.15.4 or higher.
	* [npm] (https://www.npmjs.com/package/download) version 6 and higher
	* [Git](http://git-scm.com/).

## Create SQL Server
1. In Azure portal search for **SQL databases** and click on it.

![RG Basic Tab](images/SqlServer-1.png)
&nbsp;

2. Select **New** button, it will open form.

![RG Basic Tab](images/SqlServer-2.png)
&nbsp;

3. Fill out the Form inputs as follows:
    - **Subscription** - Select the desired Azure Subscription
    - **Resource group** - Select your resource group  name. If you don't have, create new.
    - **Database name** - Enter unique Database name of your choice.
    - **Server** - For Server, select Create new, and fill out the New server form with the following values:

        - **Server name** - Enter server name of your choice, and add some characters for uniqueness, and the portal lets you know if it's available or not. example: mysqlserver12345
        - **Server admin login** - Enter server username of your choice. example: azureuser.
        - **Password** - Enter a password that meets requirements, and enter it again in the Confirm password field.
        - **Location** - Select a location from the dropdown list.

    ![RG Basic Tab](images/SqlServer-3.png)
    &nbsp;

4. Select **OK**.

5. Leave **Want to use SQL elastic pool** set to No.

    ![RG Basic Tab](images/SqlServer-4.png)
    &nbsp;

6. select **Review + create**. 

7. Now you are successfully created new database. In your newly created SQL database menu, select Query editor (preview).

8. In the Login page, under **SQL server authentication**, enter a **Login** and **Password** for a user that has access to the database. If you're not sure, use the login and password for the Server admin of the database's server. Select ok.

![RG Basic Tab](images/SQLServer-11.PNG)
&nbsp;
&nbsp;
You should now be logged in and ready to run a new query or run stored procedures


![RG Basic Tab](images/SQLServer-12.PNG)
&nbsp;
9. Select **New query**. First we will create schema for products and files table.Paste the following query into the query editor. Search for `bottler_db` word in following query and replace it with your **database name**

```bash
    USE [bottler_db]
    GO

    /****** Object:  Table [dbo].[Products]    Script Date: 11-06-2021 21:33:50 ******/
    SET ANSI_NULLS ON
    GO

    SET QUOTED_IDENTIFIER ON
    GO

    CREATE TABLE [dbo].[Products](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [_id] [varchar](50) NULL,
    [epid] [varchar](50) NULL,
    [product_id] [varchar](50) NULL,
    [bottler_id] [varchar](50) NULL,
    [customer_id] [varchar](50) NULL,
    [store_id] [varchar](50) NULL,
    [name] [nvarchar](500) NOT NULL,
    [retail_price] [varchar](50) NULL,
    [sale_price] [varchar](50) NULL,
    [skuid] [varchar](50) NULL,
    [active] [varchar](50) NULL,
    [availability] [varchar](50) NULL,
    [description] [nvarchar](500) NULL,
    [created_at] [varchar](50) NULL,
    [promotion] [varchar](50) NULL,
    [size] [varchar](50) NULL,
    [configuration] [varchar](50) NULL,
    [color] [varchar](50) NULL,
    [picture] [varchar](50) NULL,
    [contract] [varchar](50) NULL,
    [store] [varchar](50) NULL,
    [small_image] [text] NULL,
    [ReturnCode] [varchar](50) NULL
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
```

10. Write **store procedured** for products table. Paste the following query into the query editor. Search for `bottler_db` word in following query and replace it with your **database name**

```bash
    -- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <Procedure_Name, sysname, ProcedureName> 
	-- Add the parameters for the stored procedure here
	<@Param1, sysname, @p1> <Datatype_For_Param1, , int> = <Default_Value_For_Param1, , 0>, 
	<@Param2, sysname, @p2> <Datatype_For_Param2, , int> = <Default_Value_For_Param2, , 0>
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT <@Param1, sysname, @p1>, <@Param2, sysname, @p2>
END
GO

USE [bottler_db]
GO
/****** Object:  StoredProcedure [dbo].[GetProduct]    Script Date: 11-06-2021 20:37:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetProduct] @productId int AS BEGIN SET NOCOUNT ON;
SELECT * FROM Products WHERE id = @productId
END

USE [bottler_db]
GO
/****** Object:  StoredProcedure [dbo].[BatchInsertProducts]    Script Date: 11-06-2021 20:38:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[BatchInsertProducts] @jsonObject nvarchar (max) AS BEGIN SET NOCOUNT ON; 
DECLARE @InsertedRecords TABLE ( id INT, _id NVARCHAR(50), epid NVARCHAR(50), product_id NVARCHAR(50), bottler_id NVARCHAR(50), customer_id NVARCHAR(50), store_id NVARCHAR(50), name NVARCHAR(2000), retail_price NVARCHAR(50), sale_price NVARCHAR(50), skuid NVARCHAR(50), active NVARCHAR(50), availability NVARCHAR(50), description NVARCHAR(3000), created_at NVARCHAR(50), promotion NVARCHAR(50), size NVARCHAR(50), configuration NVARCHAR(50), color NVARCHAR(50), picture NVARCHAR(50), contract NVARCHAR(50), store NVARCHAR(50), small_image NVARCHAR(500), ReturnCode NVARCHAR(50)); 
INSERT INTO dbo.Products(_id, epid, product_id, bottler_id, customer_id, store_id, name, retail_price, sale_price, skuid, active, [availability], [description], created_at, promotion, size, [configuration], color, picture, [contract], store, small_image, ReturnCode) OUTPUT inserted.* INTO @InsertedRecords
SELECT _id, epid, product_id, bottler_id, customer_id, store_id, [name], retail_price, sale_price, skuid, active, [availability], [description], created_at, promotion, size, [configuration], color, picture, [contract], store, small_image, ReturnCode FROM OPENJSON (@jsonObject, '$.Products') WITH
(_id nvarchar(50) '$._id',
        epid nvarchar(50) '$.epid',
        product_id nvarchar(50) '$.product_id',
        bottler_id nvarchar(50) '$.bottler_id',
        customer_id nvarchar(50) '$.customer_id',
        store_id nvarchar(50) '$.store_id',
        [name] nvarchar(2000) '$.name',
        retail_price nvarchar(50) '$.retail_price',
        sale_price nvarchar(50) '$.sale_price',
        skuid nvarchar(50) '$.skuid',
        active nvarchar(50) '$.active',
        [availability] nvarchar(50) '$.availability',
        [description] nvarchar(3000) '$.description',
        created_at nvarchar(50) '$.created_at',
        promotion nvarchar(50) '$.promotion',
        size nvarchar(50) '$.size',
        [configuration] nvarchar(50) '$.configuration',
        color nvarchar(50) '$.color',
        picture nvarchar(50) '$.picture',
        [contract] nvarchar(50) '$.contract',
        store nvarchar(50) '$.store',
        small_image nvarchar(500) '$.small_image',
        ReturnCode nvarchar(50) '$.ReturnCode'
          )
SELECT * FROM @InsertedRecords END

USE [bottler_db]
GO
/****** Object:  StoredProcedure [dbo].[BatchUpdateProducts]    Script Date: 11-06-2021 20:39:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[BatchUpdateProducts] @jsonObject nvarchar (max) AS BEGIN SET NOCOUNT ON; 
DECLARE @UpdatedRecords TABLE ( id INT, _id NVARCHAR(50), epid NVARCHAR(50), product_id NVARCHAR(50), bottler_id NVARCHAR(50), customer_id NVARCHAR(50), store_id NVARCHAR(50), name NVARCHAR(50), retail_price NVARCHAR(50), sale_price NVARCHAR(50), skuid NVARCHAR(50), active NVARCHAR(50), availability NVARCHAR(50), description NVARCHAR(50), created_at NVARCHAR(50), promotion NVARCHAR(50), size NVARCHAR(50), configuration NVARCHAR(50), color NVARCHAR(50), picture NVARCHAR(50), contract NVARCHAR(50), store NVARCHAR(50), small_image NVARCHAR(250), ReturnCode NVARCHAR(50)); 
UPDATE dbo.Products
SET [_id] = json.X_id,
epid = json.Xepid,
product_id = json.Xproduct_id,
bottler_id= json.Xbottler_id,
customer_id = json.Xcustomer_id,
store_id= json.Xstore_id,
[name]=json.Xname,
retail_price= json.Xretail_price,
sale_price =json.Xsale_price,
skuid= json.Xskuid,
active =json.Xactive,
[availability]=json.Xavailability,
[description]= json.Xdescription,
created_at =json.Xcreated_at,
promotion= json.Xpromotion,
size =json.Xsize,
[configuration] =json.Xconfiguration,
color= json.Xcolor,
picture =json.Xpicture,
[contract]= json.Xcontract,
store =json.Xstore,
small_image= json.Xsmall_image,
ReturnCode =json.XReturnCode
FROM OPENJSON(@jsonObject, '$.Products') WITH
(Xid int '$.id',
X_id nvarchar(50) '$._id',
Xepid nvarchar(50) '$.epid',
Xproduct_id nvarchar(50) '$.product_id',
Xbottler_id nvarchar(50) '$.bottler_id',
Xcustomer_id nvarchar(50) '$.customer_id',
Xstore_id nvarchar(50) '$.store_id',
Xname nvarchar(50) '$.name',
Xretail_price nvarchar(50) '$.retail_price',
Xsale_price nvarchar(50) '$.sale_price',
Xskuid nvarchar(50) '$.skuid',
Xactive nvarchar(50) '$.active',
Xavailability nvarchar(50) '$.availability',
Xdescription nvarchar(50) '$.description',
Xcreated_at nvarchar(50) '$.created_at',
Xpromotion nvarchar(50) '$.promotion',
Xsize nvarchar(50) '$.size',
Xconfiguration nvarchar(50) '$.configuration',
Xcolor nvarchar(50) '$.color',
Xpicture nvarchar(50) '$.picture',
Xcontract nvarchar(50) '$.contract',
Xstore nvarchar(50) '$.store',
Xsmall_image nvarchar(250) '$.small_image',
XReturnCode nvarchar(50) '$.ReturnCode'
) AS json WHERE dbo.Products.id= json.Xid
SELECT * FROM @UpdatedRecords END

USE [bottler_db]
GO
/****** Object:  StoredProcedure [dbo].[BatchDeleteProducts]    Script Date: 11-06-2021 20:40:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[BatchDeleteProducts] @jsonObject nvarchar (max) AS BEGIN SET NOCOUNT ON; 
DECLARE @DeletedRecords TABLE ( id INT, active NVARCHAR(50)); 
UPDATE dbo.Products
SET active =json.Xactive
FROM OPENJSON(@jsonObject, '$.Products') WITH
(Xid int '$.id',
Xactive nvarchar(50) '$.active'
) AS json WHERE dbo.Products.id= json.Xid
SELECT * FROM @DeletedRecords END
```

11. Insert products data into database. Paste the following query into the query editor. Search for `bottler_db` word in following query and replace it with your **database name**

```bash
GO
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([id], [_id], [epid], [product_id], [bottler_id], [customer_id], [store_id], [name], [retail_price], [sale_price], [skuid], [active], [availability], [description], [created_at], [promotion], [size], [configuration], [color], [picture], [contract], [store], [small_image], [ReturnCode]) VALUES (1, N'5bbd542707bf8638b49511c1', N'12', N'12', N'65', N'1', N'1', N'Fanta', N'14', N'14', N'24-WG085', N'1', N'', N'This is Fanta', N'2018-07-26 08:23:01', N'1', N'Standard', N'16 GB', N'', N'', N'24 months', N'Coca Cola Store', N'https://rsgblobstorage.blob.core.windows.net/images/fanta-1.5l.jpeg', NULL)
INSERT [dbo].[Products] ([id], [_id], [epid], [product_id], [bottler_id], [customer_id], [store_id], [name], [retail_price], [sale_price], [skuid], [active], [availability], [description], [created_at], [promotion], [size], [configuration], [color], [picture], [contract], [store], [small_image], [ReturnCode]) VALUES (6, N'5bbd5e6807bf8638b49511c4', N'15', N'15', N'55', N'1', N'1', N'Coke 12 pack', N'14', N'14', N'24-WG086', N'1', N'', N'Coke 12 pack', N'2018-07-26 08:23:01', N'1', N'Standard', N'16 GB', N'', N'', N'24 months', N'Coca Cola Store', N'https://rsgblobstorage.blob.core.windows.net/images/coke_12pack.jpg', NULL)
INSERT [dbo].[Products] ([id], [_id], [epid], [product_id], [bottler_id], [customer_id], [store_id], [name], [retail_price], [sale_price], [skuid], [active], [availability], [description], [created_at], [promotion], [size], [configuration], [color], [picture], [contract], [store], [small_image], [ReturnCode]) VALUES (8, N'5bbd5f7907bf8638b49511c5', N'17', N'17', N'55', N'1', N'1', N'This is sprite', N'14', N'14', N'24-WG086', N'1', N'', N'This is Coca Cola 8 pack', N'2018-07-26 08:23:01', N'1', N'Standard', N'6 Pack', N'', N'', N'24 months', N'Coca Cola Store', N'https://rsgblobstorage.blob.core.windows.net/images/coca-cola-8_pack.jpeg', NULL)

SET IDENTITY_INSERT [dbo].[Products] OFF
GO
```
![RG Basic Tab](images/SQLServer-13.PNG)
&nbsp;

12. Now you are ready with **Azure SQL server**.

## Create Blob Storage

1. In Azure portal, select Storage accounts to display a list of your storage accounts.

![RG Basic Tab](images/BlobStorage-0.PNG)
&nbsp;

2. On the Storage accounts page, select **Create**.



3. Fill out the Form inputs as follows:
    - **Subscription** - Select your subscription
    - **Resource group** - Select your resource group  name. If you don't have, create new.
    - **Storage account Name** - Enter unique Storage account name.
    - **Region** - Select your nearest region.

![RG Basic Tab](images/BlobStorage-1.PNG)
&nbsp;


4. Select **Review + create**. This will ask you to verify.

![RG Basic Tab](images/BlobStorage-2.PNG)
&nbsp;
5. Click on **Create** 


Make sure the deployment of this resource is successful.
![RG Basic Tab](images/BlobStorage-3.PNG)
&nbsp;

6. Click on **Go to resource** 
 &nbsp;
7. In the left menu for the storage account, scroll to the Data storage section, then select **Containers**.

![RG Basic Tab](images/BlobStorage-4.PNG)
&nbsp;
Click on **+ Container** and choose the options as shown.
 Type a name for your new container. Set the level of public access to the container. The default level is Private (no anonymous access).

Then click on ** Create ** button to create your container

8. Select the container you just created and click on the **upload** button to upload few files

![RG Basic Tab](images/BlobStorage-5.PNG)
&nbsp;

9. Select **Upload** to create files on the container. Repeat this process for few times if you like.


![RG Basic Tab](images/BlobStorage-6.PNG)
&nbsp;

10. Now you are ready with **Azure Storage account**. In the left menu for the storage account, scroll to the Security+ networking section, then select on **Keys** 

![RG Basic Tab](images/BlobStorage-6.PNG)
&nbsp;

Take the keys from here and save it in your notepad

## Create Cosmos DB

1. In Azure portal, search for and select **Azure Cosmos DB**.

2. On the Azure Cosmos DB page, select **Create**.

 ![RG Basic Tab](images/CosmosCreate-1.PNG)
    &nbsp;
    Please select the SQL option here


3. In the Create Azure Cosmos DB Account page, fill out the Form inputs as follows:
    - **Subscription** - Select your subscription.
    - **Resource group** - Select your resource group  name. If you don't have, create new.
    - **Account Name** - Enter unique Azure Cosmos account name.
    - **API** - Select Core (SQL) to create a document database and query by using SQL syntax.
    - **Location** - Select your nearest region.
    - **Capacity mode** - Select Provisioned throughput to create an account in provisioned throughput mode. Select Serverless to create an account in serverless mode.
    - **Apply Azure Cosmos DB free tier discount** - With Azure Cosmos DB free tier, you will get the first 1000 RU/s and 25 GB of storage for free in an account.

    ![RG Basic Tab](images/CosmosCreate-2.PNG)
    &nbsp;

4. Select **Review + create**. 
 ![RG Basic Tab](images/CosmosCreate-3.PNG)
    &nbsp;
    
5. Select **Create**
    ![RG Basic Tab](images/CosmosCreate-4.PNG)
    &nbsp;

6. To create new **database** and **container**, select **Data Explorer** in your Azure Cosmos DB account and click on **New Container**. Fill out the Form inputs as follows:
        - **Database ID** - Enter **schools** as the name for the new database.
        - **Container ID** - Enter **SchoolSystems** as the name for your new container.
        - **Partition key** - This code uses **/tenantId** as the partition key. ( You can check it in `/config/config.js` file)

 
7. Select **Go to resource** to go to the Azure Cosmos DB account page. Select **Keys** from the left navigation, and then select **Read-write Keys**.

![RG Basic Tab](images/CosmosCreate-5.PNG)
&nbsp;

   Copy **Database ID** and **Container ID** into notepad. 
    In Azure portal from the **Data Explorer**, expand the **schools** database, expand the **SchoolSystems** container. Select **Items**, and then select **New Item**. Now add a document to the container with the following structure
    
```bash
    {
        "id": "40",
        "description": "First record for tenant 26c0378b-e8ec-4b43-ab26-fc024646179f",
        "roles": [],
        "status": true,
        "SPEDPrint": true,
        "api": {
            "pqEssa": {
                "url": "https://www.google.com"
            }
        },
        "appLogo": "https://logo.com",
        "features": {
            "pscDataRefresh": true
        },
        "name": "Westeros County School",
        "officialSystemId": "722",
        "printLogo": "https://printlogo.com",
        "templates": "aaaa",
        "trial": true,
        "tenantId": "26c0378b-e8ec-4b43-ab26-fc024646179f"
    }
```
  ![RG Basic Tab](images/CosmosCreate-6.PNG)
  &nbsp;
  
7. Now you are ready with **Azure Cosmos DB account**.

![RG Basic Tab](images/CosmosCreate-7.PNG)
  &nbsp;

Take the keys from here and save it in your notepad 

## To Run locally

1. Clone the repository

```bash
    git clone https://github.com/RobinGhosh64/nodejs-be.git
    cd nodejs-be
```

2. This code is MVC structured application. Code is divided into three main folders:

 1. controllers - Define all the routers file; for example: ProductRoutes.js
 define routing using methods of the Express app object that correspond to HTTP methods; for example, app.get() to handle GET requests and app.post to handle POST requests etc.

 2. services - Define all the service file; for example: ProductService.js
 define functions to call functions from daos file.

 3. daos - Define all the daos file; for example: ProductDao.js
 define actual connection with Azure SQL DB.

 For user authentication used `azure-ad-jwt` package, it verify Microsoft user using provided token. For every API call the function will check token. 

 ![RG Basic Tab](images/2.png)
 &nbsp;

3. Next, the endpoints which are in notepad substitute into `.env` with your Azure Cosmos DB, Azure SQL DB and Storage account's values.

    ```bash
    AZURE_STORAGE_ACCOUNT="~your storage account's name" 
    AZURE_STORAGE_CONNECTION_STRING="~your storage account connection string"
    AZURE_STORAGE_KEY="~your storage account key"
    SQLSERVERNAME="~your SQL server name"
    AZURE_STORAGE_CONTAINER_NAME="~your storage account's container name"
    SQLDATABASENAME="~your SQL DB name"
    USERID="~your SQL DB user name"
    PASSWORD="~your SQL DB user password"
    TOKEN_CHECK=true
    COSMOS_ENDPOINT="~your COSMOS DB endpoint"
    COSMOS_PRIMARY_KEY="~your COSMOS DB primary key"
    COSMOS_DATABASE="~your COSMOS DB name"
    COSMOS_CONTAINER="~your COSMOS DB container name"
    ```

4. Run `npm install` in a terminal to install required npm modules.

5. Run `node app.js` in a terminal to start your node application.  Navigate to `http://localhost:3003/`. 

If you are got the message `listing the port at 3003` in terminal, you are successfully run this application locally. CONGRATULATIONS. 


# How to test routes of this application locally

1. Have you completed all the settings required for this applications? Then we are good to test the routes of this application.

2. While checking this application through postman, we put Bearer Token as `neha` instead of token value.

## Step 1 - To check Azure SQL database endpoint
In postman put the url `http://localhost:3003/api/product/all` , use GET methode and set Bearer Token. 
 
![RG Basic Tab](images/1.png)
&nbsp;

## Step 2 - To check Azure COSMOS DB endpoint
In postman put the url `http://localhost:3003/api/school/26c0378b-e8ec-4b43-ab26-fc024646179f` , use GET methode and set Bearer Token. 
 
![RG Basic Tab](images/3.png)
&nbsp;

## Step 3 - To checkAzure Storage account endpoint
In postman put the url `http://localhost:3003/api/blob/all` , use GET methode and set Bearer Token. 
 
![RG Basic Tab](images/4.png)
&nbsp;

For all this routes, If you get `200 ok` status, then you are good. 

CONGRATULATIONS, you have now tested this application locally. 

## Please make sure you clone this project into your own project under your own GitHub Account

![RG Basic Tab](images/ImportRepository.PNG)
&nbsp;

## Deploying this project into Azure

1. In the Azure Portal, search for App Service.

2. Create a new Web App

![RG Basic Tab](images/AppService-1.PNG)
&nbsp;

3. Fill out the Form inputs as follows:
    - **Subscription** - Select your subscription
    - **Resource group** - Select your resource group  name. If you don't have, create new.
    - **Name** - Enter unique App Service name.
    - **Publish** - Select **Code**.
    - **Runtime stack** - Select **Node 14 LTS**.
    - **Operating system** - Select windows as operating system.
    - **Region** - Select your nearest region.

4. Click on **Review + create** button.


![RG Basic Tab](images/AppService-2.PNG)
&nbsp;

5. Click on **Create** button, if you think everything is ok otherwise you can go back.


![RG Basic Tab](images/AppService-3.PNG)
&nbsp;

6. This should start the Azure deployment to create a new Web App. Once done Click on **Go to resource ** button.


![RG Basic Tab](images/AppService-4.PNG)
&nbsp;

7. Click on **URL** of the newly created Web App on the top right side. This should take you to a Hello NodeJS Developer page. This is a sample app with no user code.


![RG Basic Tab](images/AppService-5.PNG)
&nbsp;

8. Click on **Deployment** button, to now start deploying your code.


![RG Basic Tab](images/AppService-6.PNG)
&nbsp;

9. Click on **Github** option from the dropdown. If you have code parked at other SCM, please override with that settings


![RG Basic Tab](images/AppService-7.PNG)
&nbsp;

10.  Fill out the Form inputs as follows:
  &nbsp;
     **Authenticate** with GitHub
     Then
    - **Organization** - Select your organization
    - **Repositoryp** - Select your repository
    - **Branch** - Select your branch
    - **Preview File ** - Select **Preview File**
    - 

11. Click on **Save** button uptop. This will start the deployment from your GitHub repository into this newly created Web App. You will be on the **Logs** tab


![RG Basic Tab](images/AppService-8.PNG)
&nbsp;

12. Click on or your deployment. Click on **commit id** link to see your deployment details


![RG Basic Tab](images/AppService-9.PNG)
&nbsp;

13. Please make sure it says 'Deployment successful' in the final messages. Click on **Close** button

## Step 6 - Configure Application settings by injecting values straight from the portal

1. Click on **Configuration** tab from the left blade. 

![RG Basic Tab](images/AppService-10.PNG)
&nbsp;

2. Click on **New Application setting** link. Add a new setting and the required value (key pair style)


![RG Basic Tab](images/AppService-11.PNG)
&nbsp;

3. Click on **Ok** button, to save. You can keep on doing this until you have finished entering all the required settings for this app

4. Once finished with all settings, Please make sure you click on **Save** button on the top. At this point, click on **Continue** Azure will restart the application and your application will inherit those settings once it comes back up.

![RG Basic Tab](images/AppService-13.PNG)
&nbsp;



## Test this application to verify it is running on Azure
   In Azure portal select your newly created **App service**. Copy the **URL**. Use this **URL** to verify the application is running on Azure.
   We will need this URL to test out with Postman

# Step 1 - To check Azure SQL database endpoint
In postman put the url `https://nodejs-be-protected.azurewebsites.net/api/product/all` , use GET methode and set Bearer Token. 
 
![RG Basic Tab](images/products.png)
&nbsp;

# Step 2 - To check Azure COSMOS DB endpoint
In postman put the url `https://nodejs-be-protected.azurewebsites.net/api/school/26c0378b-e8ec-4b43-ab26-fc024646179f` , use GET methode and set Bearer Token. 
 
![RG Basic Tab](images/school.png)
&nbsp;

# Step 3 - To checkAzure Storage account endpoint
In postman put the url `https://nodejs-be-protected.azurewebsites.net/api/blob/all` , use GET methode and set Bearer Token. 
 
![RG Basic Tab](images/blob.png)
&nbsp;

Make sure you see a 200 status and list of json objects

Congratulations, you have successfully deployed this application on Azure and made sure it is fully functional

In order for any UI to connect to this service, please make sure you add the cross origin reference to the webapp via the **API** settings and then selecting **CORS** 

![RG Basic Tab](images/AppService-14.PNG)
&nbsp;

##

Remember, this is a back-end REST-API project. To see this project being consumed by another client, please refer to the UI project
That way we can demonstrate a complete web application flow using Angular 11. The solution is available at  https://github.com/RobinGhosh64/angui-2-nodejs.git 

The UI authenticates with Azure AD, gets a valid JWT token and calls this back-end service with that token. Each button from the UI will exercise calls to this back end service.
From the UI:
1. Product button - Communicates with Azure SQL DB.

2. File button - Communicates with Azure blob storage.

3. School button - Communicates with Azure Cosmos DB.

Hope you all enjoyed working with this project and able to go deep into Azure. Feel free to put comments to Robin.Ghosh@microsoft.com 

