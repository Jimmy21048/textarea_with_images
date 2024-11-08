const express = require('express')
const mysql = require('mysql')
require('dotenv').config()
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const admin = require('firebase-admin')

const app = express()

app.use(cors({
    origin : 'http://127.0.0.1:5500',
    methods : 'GET, POST',
    allowedHeaders : 'Content-Type'
}))

app.use(express.urlencoded({ extended : true }))

const connection = mysql.createConnection({
    host : process.env.HOST,
    database : process.env.DB,
    port : process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD
})

const storage = multer.diskStorage({
    destination : (req, file, cb) => cb(null, 'uploads/'),
    filename : (req, file, cb) => cb(null, Date.now() + '-'+ file.originalname)
})

const upload = multer({storage})

admin.initializeApp({
    credential : admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.CLIENT_EMAIL
    }),
    storageBucket: process.env.STORAGE_BUCKET
})

const bucket = admin.storage().bucket()

app.get('/getNotes', (req, res) => {
    const query = "SELECT text.text_id, text_content, imgId FROM text INNER JOIN imgs ON text.text_id = imgs.text_id"
    connection.query(query, (err, results) => {
        if(err) {
            return console.log(err)
        }
        console.log(results)
        res.json(results)
    })
})

app.post('/upload-image', upload.single('image'),(req, res) => {
    const filePath = req.file.filename

    const query = "INSERT INTO text (text_content) VALUES (?)"
    const values = [req.body.text]

    const filePath1 = path.join(path.resolve(__dirname, '.'), req.file.path)
    
    connection.query(query, values, async (err) => {
        if(err) {
           return console.log(err)
        }
        console.log("Inserted successfully")

        const query1 = "SELECT * from text WHERE text_content = ?"
        connection.query(query1, values, (err, result) => {
            if(err) return console.log(err)

            const query2 = "INSERT INTO imgs (imgId, text_id) VALUES (?, ?)"
            const values2 = [filePath, result[0].text_id]
            connection.query(query2, values2, async (err) => {
                if(err) {
                    return console.log(err)
                }
    
                if(req.file) {
                    try {
                        await bucket.upload(filePath1, {
                            destination : `images/${req.file.filename}`,
                            metadata : {
                                contentType : req.file.mimetype
                            }
                        })
                        console.log("into firebase")
                    }catch(err) {
                        return console.log(err)
                    }
                }
            })
            
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
