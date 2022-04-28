const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const rateLimit = require("express-rate-limit")

const app = express()

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1 // limit each IP to max requests per windowMs
})

const ENV = process.env.NODE_ENV || 'dev'

app.use(cors())
app.use(bodyParser.json())

if (ENV != 'prod') app.use(express.static('assets'))

app.post('/contact', limiter, (req, res) => {
    fs.readFile('data/contact.json', 'utf8', (err, data) => {
        let json = JSON.parse(data || '[]')
        json.push({
            ...req.body,
            timestamp: Date.now(),
        })
        fs.writeFile(
            "data/contact.json",
            JSON.stringify(json),
            err => {if(err) console.log(err)}
        )
    })
    res.send({success: true})
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/home.html")
})

app.get("/covid", (req, res) => {
    res.sendFile(__dirname + "/templates/mask.html")
})

app.get("/encuesta-covid", (req, res) => {
    res.sendFile(__dirname + "/templates/encuesta-covid.html")
})

app.use(express.static('webpages/andres_hoyos/creative'))
app.get("/ah", (req, res) => {
    res.sendFile(__dirname + "/webpages/andres_hoyos/creative/index.html")
    // res.sendFile(__dirname + "/webpages/andres_hoyos/agency/index.html")
})

const PORT = process.env.PORT || 3000
const running_msg = `Running ${ENV} environment on port ${PORT}...`
app.listen(PORT, () => console.log(running_msg))
