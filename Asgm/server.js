const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const firebase = require('firebase-admin'); // Firebase Admin SDK for server-side access

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize Firebase Admin SDK
firebase.initializeApp({
    credential: firebase.credential.cert(require('./wble2-f5f4d-firebase-adminsdk-e3nlk-da063232cc.json')),
    databaseURL: 'https://wble2-f5f4d-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const todoRef = firebase.firestore().collection('todos');

// Function to check upcoming tasks and emit notifications
const checkForUpcomingTasks = () => {
    todoRef.get().then((querySnapshot) => {
        const currentTime = new Date(); // Get the current time as a Date object
        querySnapshot.forEach((doc) => {
            const { date, time } = doc.data();
            
            // Combine the date and time into a single Date object for the task
            const taskDateTime = new Date(`${date} ${time}`);

            // Calculate the difference in milliseconds between the current time and the task time
            const timeDifference = taskDateTime.getTime() - currentTime.getTime();

            if (timeDifference <= 180000 && timeDifference > 0) {
                io.emit('upcomingTask', {
                    title: doc.data().title,
                    description: doc.data().description,
                    date: doc.data().date,
                    time: doc.data().time,
                });
            }
        });
    }).catch((error) => {
        console.log('Error getting documents: ', error);
    });
};


setInterval(checkForUpcomingTasks, 180000);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
