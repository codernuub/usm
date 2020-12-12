const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);

app.use('/client',express.static('client'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.redirect('/testroomId'))
app.get('/:room', (req, res) => res.render('room', { roomId: req.params.room }))

io.on('connection', socket => {

    socket.on('join-room', ({roomId, userId }) => {
        console.log('client connected from ' + userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', (userId))

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', (userId))
        })
    })

})

server.listen(process.env.PORT || 3001, () => console.log('connected'));