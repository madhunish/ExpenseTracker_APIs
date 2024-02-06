const express = require('express')
const bodyParser = require('body-parser')
const {connectToDb, getDb} = require('./dbConnection.cjs')
const {ObjectId} = require('mongodb')
const app = express()
app.use(bodyParser.json());

let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else { 
        //process.env.PORT : cloud services
        // 8000 : local machine
        const port = process.env.PORT || 8000 
        app.listen(port)
        db = getDb()
        console.log(`Listening on port ${port}...`)
    }
})

//insert data
app.post('/add-entry', function(request, response) {
    db.collection('ExpenseData').insertOne(request.body).then(function() {
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    })
    .catch(function () {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})

//get data
app.get('/get-entries', function(request, response) {
    // Declaring an empty array
    const entries = []
    db.collection('ExpenseData')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function() {
        response.status(404).json({
            "status" : "Could not fetch documents"
        })
    })
})

//delete data
app.delete('/delete-entry', function(request,response){
    if(ObjectId.isValid(request.query.id)){
    db.collection('ExpenseData').deleteOne({
        _id : new ObjectId(request.query.id)
    }).then(function(){
        response.status(200).json({
            "status" : "successfully deleted"
        })
    }).catch(function(){
        response.status(501).json({
            "status" : "entry failed"
        })
    })}
    else {
        response.status(501).json({
            "status" : "ObjectId Invalid"
        })
    }
})

//update data0
app.patch('/update-entry/:id', function(request, response){
   // console.log(request.params.id)
   db.collection('ExpenseData').updateOne(
    {_id : new ObjectId(request.params.id)} , //identifier
    {$set : request.body}  //the data to be updated
   ).then(function(){
    response.status(200).json({
        "status" : "successfully updated"
    })
}).catch(function(){
    response.status(501).json({
        "status" : "entry update failed"
    })
})
})