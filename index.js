//https://socket.io/get-started/chat#getting-this-example

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

let users = [];

io.on('connection', (socket) => {

	let userName = '';

	socket.on('new user', user => {
		console.log(`${user} has joined the chat`);
		userName = user;
		users.push(userName);
		io.emit('new user', user);
	});

	socket.on('chat message', ({user, msg}) => {
		console.log(user + ': ' + msg);
		io.emit('chat message', {user, msg});
	});

	socket.on('user is typing', user => {
		io.emit('user is typing', user);
	});

	socket.on('user stop typing', user => {
		io.emit('user stop typing', user);
	});

	socket.on('disconnect', () => {
		console.log(`${userName} disconnected`);
		io.emit('user left', userName);
		users = users.filter(el => el !== userName);
	});

});

server.listen(3000, () => {
	console.log('listening on *:3000');
});
