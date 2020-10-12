const express = require('express')
const AWS = require('aws-sdk')

const app = express();
const port = process.env.PORT || 3000;

AWS.config.update({
    region: "us-east-2",
    accessKeyId: process.env.ACCESS_KEY || "",
    secretAccessKey: process.env.SECRET_KEY || ""
});

var dynamodb = new AWS.DynamoDB.DocumentClient();



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/todo/:id*?', (req, res) => {

    if (req.params.id) {
        dynamodb.query({
            TableName: "Todo",
            KeyConditionExpression: "#uid = :dd",
            ExpressionAttributeNames: {
                "#uid": "unique_id"
            },
            ExpressionAttributeValues: {
                ":dd": req.params.id
            }
        }, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                res.send("Not Found Item").status(200);
            }
            else {
                console.log(data);
                res.send(data.Items).status(200).end();
            }        // successful response
        });
    }
    else {
        dynamodb.scan({
            TableName: "Todo"
        }, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                res.send("Not Found Item").status(200);
            }
            else {
                console.log(data);
                res.send(data.Items).status(200).end();
            }        // successful response
        });
    }

});

app.put('/todo/:title', (req, res) => {
    if (!req.params.title) {
        res.send("title can not be empty").status(200).end();
    }
    else {
        var uid = UUID();
        var params = {
            TableName: "Todo",
            Item: {
                unique_id: uid,
                title: req.params.title,
                create_date: new Date().formate("-"),
                status: 0
            }
        };

        dynamodb.put(params, function (err, data) {
            if (err) {
                console.log(err);
                res.send(err).status(200).end();
            } else {
                console.log(data);
                res.send(uid).status(200).end();
            }
        });
    }
});


Date.prototype.formate = function (str = '-') {
    str = str || "-";
    return new Date().toISOString().slice(0, 10).replace(/-/g, str);
}

function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}