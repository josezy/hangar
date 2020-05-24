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
        json.push(req.body)
        fs.writeFile("data/contact.json", JSON.stringify(json), err => {if(err) console.log(err)})
    })
    res.send({success: true})
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/home.html")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Running ${ENV} environment on port ${PORT}...`))
