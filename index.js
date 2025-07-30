import express from "express"
import cors from 'cors'
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import * as fs from "fs"
import * as fsp from "fs/promises"


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/", authRoutes)

if(!fs.existsSync('db.json')){
    await fsp.writeFile('db.json', '[]')
}

app.listen(5000, () => {
    console.log("App started on port 5000")
})