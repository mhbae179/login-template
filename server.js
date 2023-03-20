import express from "express"
import MongoStore from "connect-mongo"
import session from "express-session"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookies from "cookie-parser"
import socket from "socket.io"
import loginRouter from "./routes/login.js"

dotenv.config()

const app = express()
mongoose.connect(process.env.DATABASE_ACCESS).then(() => {
    console.log("database connected")
})

app.use(express.json())
app.use(cookies())
app.use(session({
    secret: "participant",
    saveUninitialized: false,
    resave: false,
    cookie: {
        expires: 36000
    },
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_ACCESS,
        autoRemove: "native",
        // 세션 암호화
        // crypto: {
        //     secret: "squirrel"
        // }
    })
}))
app.use("/login", loginRouter)

app.listen("8080", () => console.log("express app start"))
