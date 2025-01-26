const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require('express');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.json())
// marathonsystem
// QtilMCa4Vp9HYpF8


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.ih9r7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
app.get('/', (req,res)=>{
    res.send('marathon is started')
})

app.listen(port,()=>{
    console.log(`marathon waited at:${port}`)
})

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // marathons api
        const marathonCollection = client.db('manageMaraathon').collection('marathon');

        app.get('/marathon', async (req, res) => {
            const cursor = marathonCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });
    }
    catch (error) {
        console.log('error connecting to mongobd', error)
    }
    // finally {
    //     // Ensures that the client will close when you finish/error
    //     await client.close();
    // }
}
run().catch(console.dir);
