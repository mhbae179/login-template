import express from "express"
import jwt from "jsonwebtoken"
import UsersModel from "../models/user.js"
import sessionAuth from "../middlewares/auth.js"

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

    if (!user)
        return res.send({ status: "400", message: "유저 정보 없음" })
    else if (pw !== user.pw) // 비밀번호 해쉬함수 비교 추가
        return res.send({ status: "400", message: "패스워드가 틀림" })
    else if (req.session.user) {
        return res.send({ status: "400", message: "로그인 중인 아이디", type: 1 })
    }

    const cookie = {
        name: user.name
    }
    const token = jwt.sign({ token: cookie }, "token", { expiresIn: 86400000 })
    req.session.user = id
    req.session.token = token
    res.cookie("token", token, { maxAge: 86400000, path: "/", httpOnly: true })
    // ipaddress 확인 추가
    return res.send("success")
})

router.get("/logout", (req, res) => {
    delete req.session
    res.clearCookie("token")

    res.send({ message: "success" })
})

export default router;
