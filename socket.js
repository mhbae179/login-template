export default (io) => {
    io.on("connection", socket => {
        console.log(`${socket.id} user connected`)
        socket.on('auth', (data) => {
            console.log(data)
            socket.broadcast.emit('auth', data)
        })
    })
}