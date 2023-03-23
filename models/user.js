import mongoose from "mongoose"

const usersSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    pw: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        require: true,
        default: 0,
    },
    login_time: {
        type: Date,
        require: false,
        default: ""
    }
})

const UsersModel = mongoose.model("users", usersSchema)

export default UsersModel
