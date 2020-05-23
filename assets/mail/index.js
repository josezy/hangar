const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.post('/contact', (req, res) => {
    fs.readFile('contact.json', function (err, data) {
        let json = JSON.parse(data || '[]')
        json.push(req.body)
        fs.writeFile("contact.json", JSON.stringify(json))
    })
    res.send({success: true})
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}...`))
