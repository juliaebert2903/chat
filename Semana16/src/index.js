const express = require('express');
const app = express();

// ATENCAO
const http = require('http');
const { disconnect } = require('process');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/meu.html');
});

io.on('connection', (socket) => {
    socket.client.nick = socket.client.id;
    io.emit('chat message', `${socket.client.nick} se conectou`);
    io.emit('chat message', `${socket.client.nick} estão online! `);
    console.log('a user connected');
    // console.log({ socket });


    //criar um vetor de pessoas e compartilhar 
    







    


    socket.on('chat message', (msg) => {
        console.log('sid: ' + socket.client.id + '\tmessage: ' + msg);
        io.emit('chat message', socket.client.nick + " disse: " + msg);
    });

    socket.on('set nick', (msg) => {
        const oldNick = socket.client.nick
        io.emit('chat message', `${oldNick} trocou seu nome para ${msg}`);
        socket.client.nick = msg;
    });
    socket.on('disconnect', (msg) => {
        io.emit('chat message', `${socket.client.nick} se desconectou`);
        console.log('user disconnect');
    });

    
}); 

server.listen(3000, () => {
    console.log('listening on *:3000');
});