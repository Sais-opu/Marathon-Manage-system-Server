

const express = require('express');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
app.get('/', (req, res) => {
    res.send('marathon is started')
})

app.listen(port, () => {
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
        //apply list collection apis make
        const applyCollection = client.db('manageMaraathon').collection('apply_application');

        // first 6
        app.get('/marathon/first6', async (req, res) => {

            const cursor = marathonCollection.find().limit(6);
            const result = await cursor.toArray();
            console.log('Fetched marathons:', result); // Debug
            res.send(result);

        });


        // all marathon
        app.get('/marathon', async (req, res) => {
            const email = req.query.eamil;
            let query = {}
            if (email) {
                query = { emial }
            }
            const cursor = marathonCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });
        // specific details
        app.get('/marathon/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await marathonCollection.findOne(query)
            res.send(result)
        })


        // post for addmarathon
        app.post('/marathon', async (req, res) => {
            const addMarathon = req.body;
            const result = await marathonCollection.insertOne(addMarathon);
            res.send(result);

        })
        // marathon list update and delete start
        app.put('/marathon/:id/update', async (req, res) => {
            const marathonId = req.params.id;
            const { Title, RegistrationDeadline, MarathonStartDate, Location } = req.body;
            try {
                const result = await marathonCollection.updateOne(
                    { _id: new ObjectId(marathonId) },
                    {
                        $set: {
                            Title,
                            RegistrationDeadline,
                            MarathonStartDate,
                            Location,
                        },
                    }
                );
                if (result.modifiedCount > 0) {
                    res.status(200).json({ message: 'Marathon updated successfully' });
                } else {
                    res.status(404).json({ message: 'Marathon not found or no changes made' });
                }
            } catch (error) {
                console.error('Error updating marathon:', error.message);
                res.status(500).json({ message: 'Error updating marathon', error: error.message });
            }
        });
        
        app.delete('/marathon/:id/delete', async (req, res) => {
            const marathonId = req.params.id;
            try {
                const result = await marathonCollection.deleteOne({ _id: new ObjectId(marathonId) });
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'Marathon deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Marathon not found' });
                }
            } catch (error) {
                console.error('Error deleting marathon:', error.message);
                res.status(500).json({ message: 'Error deleting marathon', error: error.message });
            }
        });
        // marathon list update and delete end

        // apply list delete and update start
        app.put('/apply-application/:id/update', async (req, res) => {
            const applicationId = req.params.id;
            const { apply_email, marathon_id, status } = req.body;
            try {
                const result = await applyCollection.updateOne(
                    { _id: new ObjectId(applicationId) },
                    {
                        $set: {
                            apply_email,
                            marathon_id,
                            status,
                        },
                    }
                );
                if (result.modifiedCount > 0) {
                    res.status(200).json({ message: 'Application updated successfully' });
                } else {
                    res.status(404).json({ message: 'Application not found or no changes made' });
                }
            } catch (error) {
                console.error('Error updating application:', error.message);
                res.status(500).json({ message: 'Error updating application', error: error.message });
            }
        });
        app.delete('/apply-application/:id/delete', async (req, res) => {
            const applicationId = req.params.id;
            try {
                const result = await applyCollection.deleteOne({ _id: new ObjectId(applicationId) });
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'Application deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Application not found' });
                }
            } catch (error) {
                console.error('Error deleting application:', error.message);
                res.status(500).json({ message: 'Error deleting application', error: error.message });
            }
        });
        // apply list delete and upddate end


        // apply list making get form database for list start
        app.get('/job-applylist', async (req, res) => {
            const email = req.query.email;
            const query = { apply_email: email };
            const result = await applyCollection.find(query).toArray();

            for (const list of result) {
                const queryList = { _id: new ObjectId(list.marathon_id) };
                const listapply = await marathonCollection.findOne(queryList);

                if (listapply) {
                    list.Title = listapply.Title;
                    list.MarathonStartDate = listapply.MarathonStartDate;
                }
            }
            console.log("Enriched result:", result); // Debug here
            res.send(result);
        });
        // apply list making get form database for list end


        // apply list apis to database
        app.post('/apply-applications', async (req, res) => {
            const application = req.body;
            const result = await applyCollection.insertOne(application);
            res.send(result);

        })
        // apply list apis to database 


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
