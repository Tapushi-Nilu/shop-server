const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const {ObjectId} = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1tknw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    // console.log('database connected');
    const database = client.db('doctor_portal');
    const productsCollection = database.collection('products');
    const userCollection = database.collection('users');
    const ordersCollection = database.collection('orders');
    const reviewCollection = database.collection('review');

    //Get products APi
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
     const products = await cursor.toArray();
     res.send(products);
    })

    //Get single Service
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting', id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    });





   // GET orders
   app.get('/orders', async (req, res) => {
    const cursor = ordersCollection.find({});
    const order = await cursor.toArray();
    res.json(order);
  })
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
      
      // app.get("/orders/­:email", async (req, res) => {
      // const myOrder = await ordersCollection.find({email: req.params.email}).toArray();
      // res.send(myOrder);
      // });



      
// delect api
      app.get('/orders/­:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const query = { _id: ObjectId(id) };
        const result = await ordersCollection.findOne(query)
        res.json(result);
        });

        app.delete("/­orders/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await ordersCollection.deleteOne(query);
          res.json(result);
          });
           
      app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
      });





      //add review
      app.post('/addreview', async (req, res) => {
        const result = await reviewCollection.insertOne(req.body);
        res.send(result);
      });
      app.get('/review', async (req, res) => {
        const result = await reviewCollection.find({}).toArray();
        res.json(result);
      });


      //Manage All Service
      app.get('/allorder', async (req, res) => {
        const result =await ordersCollection.find({}).toArray();
        res.send(result);
      })





        //GET ADD API
        app.get('/services', async (req, res) => {
          const cursor = productsCollection.find({});
          const services = await cursor.toArray();
          res.send(services)
      })

      // POST API
      app.post('/services', async (req, res) => {
          const service = req.body;
          console.log('hit services', service);
        
          const result = await productsCollection.insertOne(service);
          console.log(result);
          res.json(result)
      });



        //Add orders api
      app.post('/booking', async (req, res) => {
          const order = req.body
          const result = await userCollection.insertOne(order);
          res.json(result) 
      });
      app.get('/booking', async (req, res) => {
          const cursor = userCollection.find({})
          const orders = await cursor.toArray();
          res.send(orders)
      }); 


    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const user = await userCollection.findOne(query);
      console.log(user)
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });


    app.get('/users', async (req, res) => {
     const cursor = userCollection.find({});
     const users = await cursor.toArray();
     res.send(users);
    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
      
    });

    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const options = { upsert: true };
      const updateDoc = {$set: user};
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      console.log('put', user)
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}};
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });


        

  }
  finally{
    // await client.close();
  }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(port, () => {
  console.log(`Listening at ${port}`)
})