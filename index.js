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
                // delete method
                app.delete('/deleteUsers/:id', async (req, res) => {
                        const id = req.params;
                        const result = await userCollection.deleteOne({ _id: ObjectId(id) });
                        console.log(result);
                })

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