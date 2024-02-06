const {MongoClient} = require('mongodb')

let dbConnection
function connectToDb(callBack){
    MongoClient.connect('mongodb+srv://madhu:2003@cluster0.yqgfcma.mongodb.net/ExpenseTracker?retryWrites=true&w=majority').then
    (function(client){
       dbConnection = client.db()
        callBack()
    }).catch(function(error){
        callBack(error)
    })
    //console.log(dbConnection)
}

function getDb(){
    return dbConnection
}
module.exports = {connectToDb, getDb}