import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    expires: {
        type: Date,
        require: true
    },
    session: {
        type: String,
        require: true
    }
})

const SessionModel = mongoose.model('sessions', sessionSchema)

export default SessionModel
