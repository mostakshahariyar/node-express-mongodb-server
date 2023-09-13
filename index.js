const express = require('express');
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;
// const objectId = new ObjectId();

app.use(cors())
app.use(express.json());

// mongodb
const uri = "mongodb+srv://mostakshahariyar18:Kga13hwzIsJYLogX@cluster0.at4k8pd.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
        serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
        }
});

async function run() {
        try {
                await client.connect();
                const database = client.db('insertDB');
                const userCollection = database.collection('user');
                // get method
                app.get('/users', async (req, res) => {
                        const cursor = userCollection.find({});
                        const users = await cursor.toArray();
                        res.send(users);
                })
                app.get('/users/:id', async (req, res) => {
                        const id = req.params.id;
                        const query = new ObjectId(id);
                        const user = await userCollection.findOne(query);
                        res.send(user);
                        console.log("id", id);
                })

                // delete method

                app.delete('/deleteUsers/:id', async (req, res) => {
                        const id = req.params.id; // Extract the ID from params
                        const objectId = new ObjectId(id); // Convert it to ObjectId
                        const result = await userCollection.deleteOne({ _id: objectId });
                        console.log(result);

                        if (result.deletedCount === 1) {
                                res.json({ message: 'User deleted successfully' });
                        } else {
                                res.status(404).json({ message: 'User not found' });
                        }
                });

                // post method express
                app.post('/users', async (req, res) => {
                        const newUser = req.body;
                        const result = await userCollection.insertOne(newUser);
                        res.json(result);
                        console.log(`A document was inserted with the _id: ${result.insertedId}`);
                        console.log(result)
                })



        }
        finally {
                // await client.close()
        }
}
run().catch(console.dir);


app.listen(port, () => {
        console.log("port number: ", port);
})