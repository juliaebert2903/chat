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

let pessoas = [];

io.on('connection', (socket) => {
    socket.client.nick = socket.client.id;
    pessoas.push({
        id: socket.client.id,
        nick: socket.client.nick
    });
    io.emit('chat message', `${socket.client.nick} se conectou`);
    
    let quantidade = pessoas.length;
    let nicks = "";

    for (i = 0; i < quantidade ; i++){
         nicks = nicks + " - " + pessoas[i].nick    
    }

    //alterar o nick quando o user connectar

    io.emit('chat message', `${quantidade} estão online! Nicks: ${nicks}`);
    console.log('a user connected');
    console.log(pessoas);
    // console.log({ socket });



    socket.on('chat message', (msg) => {
        console.log('sid: ' + socket.client.id + '\tmessage: ' + msg);
        io.emit('chat message', socket.client.nick + " disse: " + msg);
    });

    socket.on('set nick', (msg) => {
        // DENTRO DO VETOR DE PESSOAS, UM OBJETO QUE O ID = socket.client.id
        const oldNick = socket.client.nick
        io.emit('chat message', `${oldNick} trocou seu nome para ${msg}`);
        pessoas = pessoas.map(pessoa => {
            if (pessoa.id == socket.client.id) {
                pessoa.nick = msg
            }
            return pessoa
        })

        socket.client.nick = msg;
    });
    
    socket.on('disconnect', (msg) => {
        io.emit('chat message', `${socket.client.nick} se desconectou`);
        console.log('user disconnect');
        pessoas = pessoas.filter(pessoa => pessoa.id != socket.client.id) 

        let quantidade = pessoas.length;
        let nicks = "";

        for (i = 0; i < quantidade; i++) {
            nicks = nicks + " - " + pessoas[i].nick
        }

        io.emit('chat message', `${quantidade} estão online! Nicks: ${nicks}`);       
    });

    
}); 

server.listen(3000, () => {
    console.log('listening on *:3000');
});