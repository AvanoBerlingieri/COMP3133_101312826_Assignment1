import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@as-integrations/express5';
import schema from "./schemas/schema.js";
import resolvers from "./resolvers/resolvers.js";
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const DB_CONNECTION = process.env.DB_CONNECTION_STRING

const connectDB = async () => {
    await mongoose.connect(DB_CONNECTION)
}

async function startServer() {
    //Define Apollo Server
    const server = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers
    });

    //Start the Apollo Server
    await server.start();

    //Apply middleware to the Express app
    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server)
    );

    app.listen(process.env.PORT, () => {
        console.log(`Server ready at http://localhost:${process.env.PORT}/graphql`);
        try {
            connectDB()
            console.log('Connected to MongoDB Atlas');
        } catch (error) {
            console.log(`Unable to connect to DB : ${error.message}`);
        }
    })
}

startServer();