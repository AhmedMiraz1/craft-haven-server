const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6w72r5l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

   

    const artCraftCollection = client.db("artCraftDB").collection("artCraft");


   

    // artCraft collection //

    app.get("/artCraft", async (req, res) => {
      const cursor = artCraftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/artCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCraftCollection.findOne(query);
      res.send(result);
    });

    app.post("/artCraft", async (req, res) => {
      const newArtAndCraft = req.body;
      console.log(newArtAndCraft);
      const result = await artCraftCollection.insertOne(newArtAndCraft);
      res.send(result);
    });

    app.put("/artCraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedArtCraft = req.body
      const ArtCraft = {
        $set: {
          image: updatedArtCraft.image,
          itemName: updatedArtCraft.itemName,
          subcategoryName: updatedArtCraft.subcategoryName,
          price: updatedArtCraft.price,
          shortDescription:updatedArtCraft.shortDescription,
          rating:updatedArtCraft.rating,
          customization:updatedArtCraft.customization,
          processingTime:updatedArtCraft.processingTime,
          stockStatus:updatedArtCraft.stockStatus,
        },

        
      };
      const result = await artCraftCollection.updateOne(filter, ArtCraft, options )
      res.send(result)
    });

    app.delete("/artCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCraftCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("art craft making server is running");
});

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
