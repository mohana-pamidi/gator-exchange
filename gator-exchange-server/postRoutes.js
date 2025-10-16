const express = require('express');
const database = require('./connect')
const router = express.Router(); // router object

// 1 - retrieve all
router.route("/users").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("users").find().toArray();

    if (data.length > 0) {
        response.json(data);
    } else {
        throw new Error("Data was not found D:");
    }
});

// 2 - retrieve one
router.route("/users/:id").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("users").findOne({ _id: new ObjectID(request.params.id) });

    if (Object.keys(data).length > 0) {
        response.json(data);
    } else {
        throw new Error("Data was not found D:");
    }
});

// 3 - create one
router.route("/users").get(async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
        name: request.body.name
        // email: request.body.email,
    }
    let data = await db.collection("users").insertOne(mongoObject);

    if (Object.keys(data).length > 0) {
        response.json(data);
    } else {
        throw new Error("Data was not found D:");
    }
});

// 4 - update one
router.route("/users/:id").put(async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password // can update these
    }
    let data = await db.collection("users").updateOne({ _id: new ObjectID(request.params.id) }, { $set: mongoObject });

    if (data.modifiedCount > 0) {
        response.json(data);
    } else {
        throw new Error("Data was not found D:");
    }
});

// 5 - delete one
router.route("/users/:id").delete(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("users").deleteOne({ _id: new ObjectID(request.params.id) });

    response.json(data);
});

module.exports = router;

// you can copy and paste this code for other collections, just change "users" to the name of the collection you want to use
// also change the fields in the mongoObject to match the fields in your collection
// remember to import ObjectID from mongodb if you haven't already: const { ObjectID } = require('mongodb');