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
    }
})

const UsersModel = mongoose.model("users", usersSchema)

export default UsersModel
