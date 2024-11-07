const express = require('express')
const mysql = require('mysql')
require('dotenv').config()
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const app = express()

app.use(cors({
    origin : 'http://127.0.0.1:5500',
    methods : 'GET, POST',
    allowedHeaders : 'Content-Type'
}))
// app.use(express.json())
app.use(express.urlencoded({ extended : true }))

const connection = mysql.createConnection({
    // host : process.env.HOST,
    // database : process.env.DB,
    // port : process.env.PORT,
    // user: process.env.USER,
    // password: process.env.PASSWORD
    host : 'localhost',
    database : 'texteditable',
    port : 3306,
    user: 'root',
    password: ''
})

const storage = multer.diskStorage({
    destination : (req, file, cb) => cb(null, 'uploads/'),
    filename : (req, file, cb) => cb(null, Date.now() + '-'+ file.originalname)
})

const upload = multer({storage})

// const filePath = req.file.fi

app.post('/upload-image', upload.single('image'),(req, res) => {
    const filePath = req.file.filename
    // console.log(filePath)
    // console.log(req.body.text)

    const query = "INSERT INTO text (text_content) VALUES (?)"
    const values = [req.body.text]

    connection.query(query, values, (err) => {
        if(err) {
           return console.log(err)
        }
        console.log("Inserted successfully")

        const query1 = "INSERT INTO imgs (imgId, text_id) VALUES (?, ?)"
        const values1 = [filePath, 3]
        connection.query(query1, values1, (err) => {
            if(err) {
                return console.log(err)
            }
        }) 
        
    })
})

connection.connect((err) => {
    if(err) return console.log(err);
    console.log("DB connected");

    app.listen(3000, (err) => {
        if(err) return console.log(err);
    
        console.log("Connected");
    })
})
