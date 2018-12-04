import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client'

import App from './App';

import './index.css';


const socket = io('http://localhost:4000');
socket.on('connect', function() {
	console.log('connect', arguments)
});
socket.on('event', function() {
	console.log('event', arguments)
});
socket.on('disconnect', function() {
	console.log('disconnect', arguments)
});

ReactDOM.render(<App />, document.getElementById('root'));
