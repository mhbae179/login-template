import express from "express"
import MongoStore from "connect-mongo"
import session from "express-session"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookies from "cookie-parser"
import cors from "cors"
import { Server } from "socket.io"
import { createServer } from "http"
import loginRouter from "./routes/login.js"

dotenv.config()

const app = express()
mongoose.connect(process.env.DATABASE_ACCESS).then(() => {
    console.log("database connected")
})

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ["*"]
}))
app.use(cookies())
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 60 * 8000
    },
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_ACCESS,
        autoRemove: "native",
    })
}))
app.use("/login", loginRouter)

app.listen("8080", () => console.log("express app start"))

const httpServer = createServer()
const io = new Server(httpServer)

io.on("connection", socket => {
    console.log(`${socket.id} user connected`)
    socket.on('auth', (data) => {
        socket.broadcast.emit('auth', data)
    })
})

httpServer.listen(8088)
