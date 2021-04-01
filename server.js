const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("dotenv").config();
// console.log(process.env.DB_NAME);

//MongoDB

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mc3nu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("anayrasDB").collection("products");
  const ordersCollection = client.db("anayrasDB").collection("orders");
  // perform actions on the collection object
  console.log("DB Connected");

  app.post("/addProducts", (req, res) => {
    const newProduct = req.body;
    console.log("adding event", newProduct);
    productsCollection.insertOne(newProduct).then((result) => {
      console.log(result.insertedCount);
      res.send({ count: result.insertedCount });
    });
  });
  app.get("/allProducts", (req, res) => {
    productsCollection.find({}).toArray((err, products) => {
      res.send(products);
    });
  });

  app.get("/product/:id", (req, res) => {
    productsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, product) => {
        res.send(product[0]);
      });
  });
  app.post("/addOrders", (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder).then((result) => {
      console.log(result.insertedCount);
      res.send({ count: result.insertedCount });
    });
  });
  app.get("/orders", (req, res) => {
    ordersCollection.find({ email: req.query.email }).toArray((err, orders) => {
      res.send(orders);
    });
  });
  app.delete("/delete/:id", (req, res) => {
    productsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
});

app.listen(5000, () => {
  console.log("Listening to Port 5000");
});
