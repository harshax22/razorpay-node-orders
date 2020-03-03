const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const moment = require('moment');
const fetch = require('node-fetch');

const api_key = ``;
const api_secret = ``;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

app.get('/create', (req, res) => res.sendFile(__dirname + "/create.html"));

app.post('/create', (req, res) => {

    const createOrderAmount = req.body.orderAmount;
    const createOrderCurrency = req.body.orderCurrency;

    const create_url = `https://${api_key}:${api_secret}@api.razorpay.com/v1/orders`

    const data = {
        amount: createOrderAmount * 100,
        currency: createOrderCurrency,
        payment_capture: 1
    };
    const jsonData = JSON.stringify(data)

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(create_url, options).then((res) => res.json()).then((api_response) => 

    res.send(`
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <style>
     .note {
         margin-top: 10px;
     }
    </style>
    <div class="jumbotron">
    <p class="lead">
    <strong>
    Razorpay Order ID: ${api_response.id} 
    <p class="lead">Status: ${api_response.status}</p>
    <p class="lead"><strong>Amount: ${api_response.amount/100}</strong></p>
    <p class="lead"><strong>Currency: ${api_response.currency}</strong></p>
    <p class="lead"><strong>Created At: ${moment.unix(api_response.created_at).utcOffset(330).format("dddd, MMMM Do YYYY, h:mm:ss a")}</strong></p>
    </strong>
    </p>
    <h4>You can use the newly created order_id to make a GET request back in the home page</h4>
    <a class="btn btn-primary" href="/" role="button">Back to Home</a>
    </div>
    `)
    
    )
})

app.post('/', (req, res) => {
    const orderId = req.body.apiEndpoint;
    const fetch_url = `https://${api_key}:${api_secret}@api.razorpay.com/v1/orders/${orderId}`


    https.get(fetch_url, (response) => {

        if(response.statusCode === 200) {

            response.on('data', (data) => {
                const api_response = JSON.parse(data)
                const order_id = api_response.id
                const status = api_response.status
                const createdAt = moment.unix(api_response.created_at).utcOffset(330).format("dddd, MMMM Do YYYY, h:mm:ss a")
                const amount = (api_response.amount)/100;
                const currency = api_response.currency;
                res.send(`
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                 <style>
                 .btn {
                     padding: 20px 20px;
                     margin-left: 2px;
                 }
                 
                 </style>
                  <div class="jumbotron">
                  <p class="lead"><strong>Razorpay Order ID</strong>: ${order_id}</p>
                  <p class="lead"></p>
                  <hr class="my-4">
                  <p class="lead"><strong>Status</strong>: ${status}</p>
                  <p class="lead"></p>
                  <hr class="my-4">
                  <p class="lead"><strong>Amount</strong>: ${amount} ${currency}</p>
                  <p class="lead"></p>
                  <hr class="my-4">
                  <p class="lead"><strong>Created At</strong>: ${createdAt}</p>
                </div>
                <a class="btn btn-primary" href="/" role="button">Go Back</a>
                `)
            })
        }
        else {
            res.send(`
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            <body>
        <div class="jumbotron">
            <h1 class="display-4">Failure!!</h1>
            <p class="lead"></p>
            <hr class="my-4">
            <p class="lead">Please Retry the API request</p>
            <form class="" action="/failure" method="POST">
            <button class="btn btn-lg btn-warning">Try Again</button>
          </div>
    </body>
            `)
        }
        
    })
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})
app.listen(process.env.PORT || 8050, () => console.log('app running on port 8050'));
