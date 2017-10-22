//Ключ размещен здесь в целях демонстрации тенологии, никогда не используйте серверный ключ в клиентском коде
const serverKey = 'AAAA-LeR6PU:APA91bG9nkRbIIUJNKKUYP6UYUIywIXtyHON6zDPw9-tNnxcU7TkZbc5BrGLAUHIKtIVxTBlTiWd7u2d9D4FoXXbkWi7c74e4ZJ8r59P8ryHk_ndirrHxECu-nZi-O6mAdXbpR-3ldXJ';

var config = {
	apiKey: "AIzaSyBNqV-P95-91WX4d3nrpY4m76dl_Qy3BSw",
	authDomain: "pwa-example-zipp3r.firebaseapp.com",
	databaseURL: "https://pwa-example-zipp3r.firebaseio.com",
	projectId: "pwa-example-zipp3r",
	storageBucket: "pwa-example-zipp3r.appspot.com",
	messagingSenderId: "1068231682293"
};

if ('firebase' in window) {
	firebase.initializeApp(config);

	var messaging = firebase.messaging();
	messaging.requestPermission()
		.then(function() {
			registerServiceWorker('sw.js').then((registration => {
				messaging.useServiceWorker(registration);
			})).then(() => {
				getToken();
			});
		})
		.catch(function(err) {
			console.log('Unable to get permission to notify.', err);
		});
}

function registerServiceWorker(workerPath) {
	return navigator.serviceWorker.register(workerPath)
		.then(function(registration) {
			console.log('Service worker successfully registered.');
			return registration;
		})
		.catch(function(err) {
			console.error('Unable to register service worker.', err);
		});
}

function getToken () {
	messaging.getToken()
		.then(function(currentToken) {
			if (currentToken) {
				const cUrl = `curl -X POST -H "Authorization: key=${serverKey}" -H "Content-Type: application/json" -d '{"notification": {"title": "Test"},"to": "${currentToken}"}' "https://fcm.googleapis.com/fcm/send";`
				console.log(cUrl);
				//todo.controller.addItem(cUrl);
			}
		})
		.catch(function(err) {
			console.log('An error occurred while retrieving token. ', err);
		});
}