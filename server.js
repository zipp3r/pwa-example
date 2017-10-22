'use strict';

const express = require('express');
const app = express();


app.use('/js/app.js', express.static('public/js/dist/app.js'));
app.use('/sw.js', express.static('public/js/dist/sw.js'));
app.use('/js/workbox.js', express.static('public/js/dist/workbox.js'));
app.use('/pic', express.static('public/pic'));
app.use(express.static('public/'));
app.use(express.static('node_modules/todomvc/examples/vanillajs', {
	index: '/index.html'
}));

app.get('/push-api/push-data/', (req, res) => {
	res.json({
		title: 'Новое оповещение',
		body: 'Нет времени объяснять, скорее ЖМИ!',
		url: 'https://mail.ru/'
	});
});

app.listen(8080, () => {
	console.log('Example app listening on port 8080!');
});