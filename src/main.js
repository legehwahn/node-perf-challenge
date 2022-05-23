import http from 'http';
import { decryptor, encryptor, setPrivateKey, setPublicKey } from './handlers'; // eslint-disable-line sort-imports

const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {

	try {

		if (request.method !== 'POST') { // eslint-disable-line eqeqeq
			response.statusCode = 405;
			response.end();
			return; // eslint-disable-line newline-before-return
		}

		const url = new URL(request.url, `http://${request.headers.host}`);

		switch (url.pathname) {

			case '/keys/private':
				setPrivateKey(request, response);
				break;

			case '/keys/public':
				setPublicKey(request, response);
				break;

			case '/encrypt':
				encryptor(request, response);
				break;

			case '/decrypt':
				decryptor(request, response);
				break;

			default:
				response.statusCode = 418;
				response.end();
				break;
		}

	} catch (error) {

		response.statusCode = 420;
		response.end(JSON.stringify({
			code: error.code,
			message: error.message
		}));
	}
});

server.on('clientError', (error, socket) => {

	if (error.code === 'ECONNRESET' || !socket.writable) {
		return;
	}

	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(port, '0.0.0.0');

console.log(`server listening on http://localhost:${port}`);