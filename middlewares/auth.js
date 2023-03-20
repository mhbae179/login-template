// token 비교 미들웨어
const sessionAuth = (req, res, next) => {
    if (req.session.token === req.cookies.token)
        next()
    else
        res.status(400).send({ message: "유효하지 않은 세션 정보입니다", type: 1 })
}

export default sessionAuth
