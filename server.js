require('dotenv').config();
const express = require('express')
const RebillyAPI = require('rebilly-js-sdk').default
const app = express()
const port = 3000
app.use(express.static('client'));
app.use(express.json());

const api = RebillyAPI({apiKey: process.env.API_KEY, organizationId: process.env.ORG_ID, sandbox: true})
app.post('/create-transaction', async(req, res) => {
    const {id, billingAddress} = req.body;
    
    const customerData = {
        paymentToken: id,
        primaryAddress: billingAddress
    }

    try {
        const {fields: customerFields} = await api.customers.create({data: customerData});
        const transactionData = {
            websiteId: 'my-awesome-website',
            customerId: customerFields.id,
            currency: 'USD',
            amount: 40,
            type: 'sale'
        }
        const {fields: transactionFields} = await api.transactions.create({data: transactionData});
        res.send(transactionFields);
    } catch (err) {
        res.status(err.status).send({message: err.details});
    }
})

app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
})
