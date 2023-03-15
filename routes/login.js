import express from "express"

const router = express.Router()

router.get("", (req, res) => {
    console.log("test")
})

router.post("/test", (req, res) => {
    const { id, pw } = req.body
    console.log(req.session)
    req.session.user = id
    return res.send("success")
})

export default router;
