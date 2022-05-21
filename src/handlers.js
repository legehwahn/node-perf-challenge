import http from 'http'; // eslint-disable-line no-unused-vars
import { pbkdf2decrypt, pbkdf2encrypt } from './crypto.js'; // eslint-disable-line sort-imports

/**
 * @param {http.IncomingMessage} request TODO:
 * 
 * @returns {Promise<string>} TODO:
 */
function readBody(request) {

	return new Promise((resolve, reject) => {

		const body = [];
		request.on('data', chunk => {
			body.push(chunk);
		}).on('end', () => {

			if (body.length !== 0) {
				resolve(Buffer.concat(body).toString());
			} else {
				resolve();
			}

		}).on('error', error => {
			reject(error);
		});
	});
}

/**
 * @param {http.IncomingMessage} request TODO:
 * @param {http.ServerResponse} response TODO:
 * 
 * @returns {Promise<void>} TODO:
 */
async function decryptor(request, response) {

	try {

		const { encryptedData, password } = JSON.parse(await readBody(request));
		response.end(await pbkdf2decrypt(encryptedData, password)); // TODO: supply required args

	} catch (error) {

		response.statusCode = 418; // eslint-disable-line require-atomic-updates
		response.end();
	}
}

/**
 * @param {http.IncomingMessage} request TODO:
 * @param {http.ServerResponse} response TODO:
 * 
 * @returns {Promise<void>} TODO:
 */
async function encryptor(request, response) {

	try {

		const { data, password } = JSON.parse(await readBody(request));
		response.end(await pbkdf2encrypt(data, password)); // TODO: supply required args

	} catch (error) {

		response.statusCode = 418; // eslint-disable-line require-atomic-updates
		response.end();
	}
}

export {
	decryptor,
	encryptor
};