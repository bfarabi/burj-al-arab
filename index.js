const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.fway0.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors());
const port = 5000

app.get('/', (req, res) => {
    
        res.send('heroku is working');
    
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaWatson").collection("products");
  const ordersProducts = client.db("emaWatson").collection("orders");
        app.post('/addProducts', (req, res) => {
          const  product = req.body;
          
              products.insertMany(product)
              .then(result => {
                  
                  res.send(result.insertedCount)
              })
        })

        app.get('/products', (req, res) => {
            products.find({})
            .toArray((err, document) => {
                res.send(document);
            })
        })

        app.get('/product/:key', (req, res) => {
            products.find({key: req.params.key})
            .toArray((err, document) => {
                res.send(document[0]);
            })
        })

        app.post('/productByKeys', (req, res) => {
            const productKey = req.body;
            products.find({key: { $in : productKey}})
            .toArray((err, document) => {
                res.send(document);
            })
        })
            app.post('/addOrder', (req, res) => {
                const order = req.body;
                ordersProducts.insertOne(order)
                .then(result => {
                    res.send(result.insertedCount > 0)
                })
            })
});


app.listen(process.env.PORT || port);