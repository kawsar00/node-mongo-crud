const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const password = 'q3pBasUBMc8ADocV'
const uri = "mongodb+srv://organicdb:q3pBasUBMc8ADocV@cluster0.ggbl3.mongodb.net/organicUser?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


client.connect(err => {
  const productCollection = client.db("organicUser").collection("products");
  
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })
  
  app.get('/products', (req, res) =>{
    productCollection.find({})
    .toArray((err, documents) => {
        res.send(documents)
    })
  })

  app.post('/addProduct', (req, res) => {
    const product = req.body
    productCollection.insertOne(product)
  .then(result =>{
    console.log('data added');
    res.redirect('/')
  })
  })


  app.get('/product/:id', (req, res) =>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
  })
  })

  app.patch('/update/:id', (req, res) =>{
   
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result =>{
      // console.log(result)
      res.send(result.modifiedCount > 0)
    })

  })


  app.delete(`/delete/:id`, (req, res) => {
    console.log(req.params.id)
  
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      // console.log(result)
      res.send(result.deletedCount > 0)
    })
  
  })


});





app.listen(3000)