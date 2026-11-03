require("dotenv").config()

const io = require("socket.io")(process.env.PORT, {
  cors: {
    origin: "*"
  },
  methods: ["GET", "POST"]
})

const users = {}

io.on("connection", socket => {
  socket.on("new-user-joined", name => {
    users[socket.id] = name
    socket.broadcast.emit("user-joined", name)
  })

  socket.on("send", message => {
    socket.broadcast.emit("receive", {name: users[socket.id], message})
  })

  socket.on("disconnect", () => {
    const name = users[socket.id]
    socket.broadcast.emit("leave", name)
    delete users[socket.id]
  })
})