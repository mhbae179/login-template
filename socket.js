export default (io) => {
    io.on("connection", socket => {
        console.log(`${socket.id} user connected`)
    })
}