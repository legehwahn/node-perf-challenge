import http from 'http'; // eslint-disable-line no-unused-vars
import { publicDecrypt, privateEncrypt } from './cryptoHelpers.js'; // eslint-disable-line sort-imports

const keys = {
	publicKey: '',
	passphrase: '',
	privateKey: ''
};

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
async function setPublicKey(request, response) {

	try {

		keys.publicKey = await readBody(request);

		response.statusCode = 204;
		response.end();

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
async function setPrivateKey(request, response) {

	try {

		keys.privateKey = await readBody(request);
		keys.passphrase = request.headers.passphrase || '';

		response.statusCode = 204;
		response.end();

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
async function decryptor(request, response) {

	try {

		const { encryptedData } = JSON.parse(await readBody(request));
		response.end(await publicDecrypt(encryptedData, keys.publicKey));

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

		const { data } = JSON.parse(await readBody(request));
		response.end(await privateEncrypt(data, keys.privateKey, keys.passphrase));

	} catch (error) {

		response.statusCode = 418; // eslint-disable-line require-atomic-updates
		response.end();
	}
}

export {
	decryptor,
	encryptor,
	setPublicKey,
	setPrivateKey
};