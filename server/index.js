const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

app.use('/css', express.static('dist/spa/css'))
app.use('/fonts', express.static('dist/spa/fonts'))
app.use('/js', express.static('dist/spa/js'))
app.use('/statics', express.static('dist/spa/statics'))

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/dist/spa/index.html');
})

io.on('connection', function (socket) {
  socket.on('room', function(room) {
    socket.join(room)
  })
  socket.on('message', function (msg) {
    io.to(msg.room).emit('message', msg)
  })
})

http.listen(port, function(){
  console.log('listening on *:' + port)
})
