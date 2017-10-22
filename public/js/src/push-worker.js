const SW_PROJECT_NAME = 'pwa-example';
const SW_SERVER_URL = '/push-api/push-data/';
const SW_ICON = 'pic/notification.png';

function validate(data) {
	if (!data.title) {
		throw new Error({
			code: 'invalid_format',
			message: 'Empty title'
		});
	}

	if (!data.body) {
		throw new Error({
			code: 'invalid_format',
			message: 'Empty body'
		});
	}

	if (!data.url) {
		throw new Error({
			code: 'invalid_format',
			message: 'Empty url'
		});
	}

	return data;
}

self.addEventListener('install', (event) => {
	event.waitUntil(this.skipWaiting());
});

self.addEventListener('message', (message) => {
	console.log(message)
});

self.addEventListener('push', (event) => {
	return event.waitUntil(
		fetch(SW_SERVER_URL)
			.then((response) => {
				if (response.status !== 200) {
					throw new Error({
						code: 'invalid_response',
						message: 'Invalid Response'
					});
				}
				return response.json();
			})
			.then(validate)
			.then((data) => {
				const d = new Date();
				const context = {
					body: data.body || '',
					icon: data.icon || SW_ICON,
					data: {
						url: data.url || '/'
					},
					tag: `${data.tag || d.getTime()}`
				};
				return this.registration.showNotification(data.title, context);
			})
			.catch((err) => {
				console.error('Invalid data', err.code, err.message);
			})
	);
});

self.addEventListener('notificationclick', (event) => {
	const payload = event.notification;
	const url = (payload.data || {}).url || '/';

	event.notification.close();
	event.waitUntil(clients.openWindow(url));
});