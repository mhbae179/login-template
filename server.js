import express from "express"
import loginRouter from "./routes/login.js"
import MongoStore from "connect-mongo"
import session from "express-session"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const app = express()
mongoose.connect(process.env.DATABASE_ACCESS).then(() => {
    console.log("database connected")
})

app.use(express.json())
app.use(session({
    secret: "participant",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_ACCESS,
        autoRemove: "native",
        crypto: {
            secret: "squirrel"
        }
    })
}))
app.use("/login", loginRouter)

app.listen("8080", () => console.log("express app start"))
