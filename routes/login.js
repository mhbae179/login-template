import express from "express"
import jwt from "jsonwebtoken"
import UsersModel from "../models/user.js"
import sessionAuth from "../middlewares/auth.js"
import SessionsModel from "../models/sessions.js"
import mongoose from "mongoose"

const router = express.Router()

router.get("/user", sessionAuth, async (req, res) => {
    const user = await UsersModel.find()
    console.log(user)
    res.send(user)
})

router.post("/user", async (req, res) => {
    const { id, pw, name } = req.body

    const user = await UsersModel.findOne({ id: id })

    if (user) return res.status(401)

    try {
        // 유저 정보 암호화 함수 추가
        const newUser = new UsersModel({
            id: id,
            pw: pw,
            name: name
        })
        newUser.save()
    } catch (e) {
        console.error(e)
    }
    res.send({ status: "success", message: "create new user" })
})

router.post("", async (req, res) => {
    const { id, pw } = req.body
    const user = await UsersModel.findOne({ id: id })
    const sessions = await SessionsModel.find({ session: { $regex: id } })
    const now = new Date()
    let timeDiff = 0
    if (user.login_time)
        timeDiff = now.getTime() - user.login_time.getTime()
    else
        timeDiff = 0
    console.log(parseInt(timeDiff / (1000 * 60 * 60 * 24)))

    // ip 비교 추가 고려
    if (!user)
        return res.send({ status: "400", message: "유저 정보 없음" })
    else if (user.status === 1)
        return res.status(401).send({ message: "잠금된 계정입니다. 관리자에게 문의하시기 바랍니다." })
    else if (pw !== user.pw) // 비밀번호 해쉬함수 비교 추가
        return res.send({ status: "400", message: "패스워드가 틀림" })
    else if (parseInt(timeDiff / (1000 * 60 * 60 * 24)) > 90) {
        await UsersModel.findOneAndUpdate({ id: id }, { status: 1 })
        return res.status(401).send({ message: "장기간 미접속으로 계정이 잠금되었습니다. 관리자에게 문의하시기 바랍니다." })
    } else if (sessions.length > 0) {
        await SessionsModel.findOneAndDelete({ session: { $regex: id } })
        return res.send({ status: "400", message: "로그인 중인 아이디", type: 1, id: user.id })
    }

    const cookie = {
        name: user.name
    }
    const token = jwt.sign({ token: cookie }, "token", { expiresIn: 86400000 })
    req.session.user = id
    req.session.token = token
    res.cookie("connect.sid", token, { maxAge: 86400000, path: "/", httpOnly: true })
    await UsersModel.findOneAndUpdate({ id: id }, { login_time: now })
    // ipaddress 확인 추가
    return res.send({ result: "success", id: user.id })
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.clearCookie("connect.sid")

    res.send({ message: "success" })
})

export default router;
