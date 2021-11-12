import * as information from './db_model.mjs';
import express from 'express';

const app = express();
const PORT = 3000;

let TotalRequest = 0
let RequestWithZeroQuery = 0

function RequestReminder() {
    if (TotalRequest > 0 && TotalRequest % 2 == 0) {
        console.log(`Total retrieve requests: ${TotalRequest}`)
        console.log(`Retrieve requests with 0 query parameters: ${RequestWithZeroQuery}`)
        console.log(`Retrieve requests with 1 or more query parameters: ${TotalRequest - RequestWithZeroQuery}`)
    }
}

app.get("/create", (req, res) => {
    console.log(req.query)
    information.createPerson(req.query.name, req.query.age, req.query.email, req.query.phoneNumber)
        .then(info => {
            res.send(info)
        })
        .catch(error => {
            console.log(error)
            res.send({ error: 'Request failed' })
        })
});

app.get("/retrieve", (req, res) => {
    let filter = []
    const array = ["_id", "name", "age", "email", "phoneNumber"]
    for (let i = 0; i < array.length; i++) {
        if (req.query[array[i]] != undefined) {
            const obj = {}
            obj[array[i]] = req.query[array[i]]
            filter.push(obj)
        }
    }

    information.retievePerson(filter)
        .then(info => {
            TotalRequest++
            console.log(TotalRequest)
            if (filter.length == 0) {
                RequestWithZeroQuery++
            }
            RequestReminder()
            res.send(info)
        })
        .catch(error => {
            console.log(error)
            res.send({ error: 'Request failed' })
        })

})

app.get("/update", (req, res) => {
    if (req.query._id != undefined) {
        const filter = {}
        const array = ["name", "age", "email", "phoneNumber"]
        for (let i = 0; i < array.length; i++) {
            if (req.query[array[i]] != undefined) {
                filter[array[i]] = req.query[array[i]]
            }
        }
        console.log(filter)

        information.updatePerson(req.query._id, filter)
            .then(update => {
                console.log(update)
                res.send({ modifiedCount: update })
            })
            .catch(error => {
                console.log(error)
                res.send({ error: "Not found" })
            })
    }
    else {
        res.send({ error: "There is no id found" })
    }
})

app.get("/delete", (req, res) => {
    const array = ["_id", "name", "age", "email", "phoneNumber"]
    const filter = []
    for (let i = 0; i < array.length; i++) {
        if (req.query[array[i]] != undefined) {
            const obj = {}
            obj[array[i]] = req.query[array[i]]
            filter.push(obj)
        }
    }
    console.log(filter)

    information.deletePerson(filter)
        .then(deleteCount => {
            console.log(deleteCount)
            res.send({ deleteCount: deleteCount })
        })
        .catch(error => {
            console.log(error)
            res.send({ error: 'Request Invalid' })
        })

})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);

});