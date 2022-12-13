const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('server is running');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugpmzsn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)

async function run(){
    try{
        const appointmentCollections = client.db('appointment').collection('data')
        app.get('/appointment', async(req,res)=>{
            const query = {}
            const result = await appointmentCollections.find(query).toArray();
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err =>{
    console.log(err.message)
})





app.listen(port, ()=>{
    console.log('server is running');
})