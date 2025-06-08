// STEPS TO GET YOUR MONGODB ATLAS USERNAME & PASSWORD:
//
// 1. SIGN UP / LOG IN TO MONGODB ATLAS
//    • Visit: https://www.mongodb.com/cloud/atlas
//    • Create a free account or log in.
//
// 2. CREATE OR SELECT A PROJECT
//    • In the Atlas dashboard, click "Projects".
//    • Click "New Project" to create one, or select an existing project.
//
// 3. DEPLOY A CLUSTER (IF NEEDED)
//    • Inside your project, click "Build a Cluster".
//    • Choose the Shared (free) tier.
//    • Pick your cloud provider & region, then "Create Cluster".
//    • Wait for provisioning to complete (a few minutes).
//
// 4. ADD A DATABASE USER (THIS IS YOUR USERNAME & PASSWORD)
//    • In the left menu, choose "Database Access".
//    • Click "+ ADD NEW DATABASE USER".
//    • Under "Authentication Method," select "Password."
//    • Enter your desired Username (e.g. myAppUser).
//    • Enter & confirm a secure Password (make note of it).
//    • Under "Database User Privileges," grant at least "Read and write to any database."
//    • Click "Add User."
//
// 5. WHITELIST YOUR IP ADDRESS
//    • In the left menu, go to "Network Access."
//    • Click "+ ADD IP ADDRESS."
//    • Click "Add Current IP Address" or enter 0.0.0.0/0 (less secure).
//    • Click "Confirm."
//
// 6. COPY YOUR CONNECTION STRING
//    • In the left menu, click "Clusters."
//    • On your cluster, click the blue "Connect" button.
//    • Choose "Connect your application."
//    • Copy the URI, e.g.:
//      mongodb+srv://<username>:<password>@cluster0.t5l2pir.mongodb.net/RTASK?retryWrites=true&w=majority
//    • Replace <username> and <password> with the ones you created.
//
// 7. STORE CREDENTIALS IN ENVIRONMENT VARIABLES
//    • Create a file named `.env` at your project root (add `.env` to `.gitignore`):
//        MONGO_USER=myAppUser
//        MONGO_PASS=YourSecurePassword123
//        MONGO_CLUSTER=cluster0.t5l2pir.mongodb.net
//        MONGO_DB=RTASK
//
// 8. UPDATE YOUR CODE TO USE DOTENV
//    • Install dotenv: `npm install dotenv`
//    • In your code:
//      ```js
//      import mongoose from 'mongoose';
//      import dotenv from 'dotenv';
//      dotenv.config();
//
//      const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env;
//      const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;
//
//      export const connectDB = async () => {
//        try {
//          await mongoose.connect(uri);
//          console.log('DB CONNECTED');
//        } catch (err) {
//          console.error('DB CONNECTION ERROR:', err);
//        }
//      };
//      ```
//
// You can now safely paste these commented steps into your code file! 😊

// IF HAVE ANY QUERIES CALL ON +91 8299431275  OR EMAIL ON: hexagonsservices@gmail.com

import mongoose from 'mongoose';
import 'dotenv/config';

// Construct MongoDB Atlas URI from environment variables
const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env;
const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

export const connectDB = async () => {
    try {
        // Ensure all required environment variables exist
        if (!MONGO_USER || !MONGO_PASS || !MONGO_CLUSTER || !MONGO_DB) {
            throw new Error('Missing required MongoDB Atlas environment variables');
        }

        // Connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        // Attempt connection
        const conn = await mongoose.connect(MONGODB_URI, options);
        
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        
        // Connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.info('✅ MongoDB reconnected successfully');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('👋 MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error during MongoDB disconnection:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        if (error.name === 'MongoServerSelectionError') {
            console.error('⚠️ Please check your MongoDB Atlas credentials and network connection');
        }
        process.exit(1);
    }
};
