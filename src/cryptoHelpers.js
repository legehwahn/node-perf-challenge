import crypto from 'crypto';

// #region Hash

/**
 * Create hash from a supplied string.
 * 
 * @param {string} target The string to hash.
 * @param {string} [algorithm] The algorithm to use for the hash operation. `Default sha256`
 * @param {BufferEncoding} [encoding] The encoding to use for the hash operation. `Default hex`
 * @param {string} [salt] The encoding to use for the hash operation. `Default ''`
 *
 * @returns {string} The hashed string.
 */
function hash(target, algorithm = 'sha256', encoding = 'hex', salt = '') {

	// Return hashed string in the requested encoding to the caller.
	return crypto.createHash(algorithm).update(salt + target).digest(encoding);
}

// #endregion

// #region Asymmetric encryption / decryption

/**
 * Encrypt data using an asymmetric public key.
 * 
 * @param {string} data - The data to encrypt.
 * @param {crypto.RsaPublicKey|crypto.RsaPrivateKey|crypto.KeyLike} key - The utf8 string representing the asymmetric public or private key.
 * Because RSA public keys can be derived from private keys, a private key may be passed instead of a public key.
 * @param {BufferEncoding} [inputEncoding] - Optional, the encoding of the provided data. `Default utf8`
 * @param {BufferEncoding} [outputEncoding] - Optional, the encoding to apply on the encrypted data string. `Default base64`
 * 
 * @returns {string} The encrypted data.
 */
function publicEncrypt(data, key, inputEncoding = 'utf8', outputEncoding = 'base64') {

	return crypto.publicEncrypt(key, Buffer.from(data, inputEncoding)).toString(outputEncoding);
}

/**
 * Decrypt data using an asymmetric public key.
 * 
 * @param {string} encryptedData - The data to encrypt.
 * @param {crypto.RsaPublicKey|crypto.RsaPrivateKey|crypto.KeyLike} key - The utf8 string representing the asymmetric public key.
 * Because RSA public keys can be derived from private keys, a private key may be passed instead of a public key.
 * @param {BufferEncoding} [inputEncoding] - Optional, the encoding of the provided encrypted data. `Default base64`
 * @param {BufferEncoding} [outputEncoding] - Optional, the encoding to apply on the decrypted string. `Default utf8`
 * 
 * @returns {string} The encrypted data.
 */
function publicDecrypt(encryptedData, key, inputEncoding = 'base64', outputEncoding = 'utf8') {

	return crypto.publicDecrypt(key, Buffer.from(encryptedData, inputEncoding)).toString(outputEncoding);
}

/**
 * Encrypt data using an asymmetric private key.
 * 
 * @param {string} data - The data to decrypt.
 * @param {crypto.KeyLike} privateKey - The utf8 string representing the asymmetric private key.
 * @param {string} privateKeyPassword - The passphrase to the private key.
 * @param {BufferEncoding} [inputEncoding] - Optional, the encoding of the provided data. `Default utf8`
 * @param {BufferEncoding} [outputEncoding] - Optional, the encoding to apply on the encrypted data string. `Default base64`
 * 
 * @returns {string} The encrypted data.
 */
function privateEncrypt(data, privateKey, privateKeyPassword, inputEncoding = 'utf8', outputEncoding = 'base64') {

	return crypto.privateEncrypt(
		{
			key: privateKey,
			passphrase: privateKeyPassword
		},
		Buffer.from(data, inputEncoding)
	).toString(outputEncoding);
}

/**
 * Decrypt data using an asymmetric private key.
 * 
 * @param {string} encryptedData - The data to decrypt.
 * @param {crypto.KeyLike} privateKey - The utf8 string representing the asymmetric private key.
 * @param {string} privateKeyPassword - The passphrase to the private key.
 * @param {BufferEncoding} [inputEncoding] - Optional, the encoding of the provided encrypted data. `Default base64`
 * @param {BufferEncoding} [outputEncoding] - Optional, the encoding to apply on the decrypted string. `Default utf8`
 * 
 * @returns {string} The decrypted data.
 */
function privateDecrypt(encryptedData, privateKey, privateKeyPassword, inputEncoding = 'base64', outputEncoding = 'utf8') {

	return crypto.privateDecrypt(
		{
			key: privateKey,
			passphrase: privateKeyPassword
		},
		Buffer.from(encryptedData, inputEncoding)
	).toString(outputEncoding);
}

// #endregion

// #region Password-Based Key Derivation Function 2

/**
 * Generate a PBKDF2 key.
 * 
 * @param {string} password - Password to the key.
 * @param {string} salt - Salt to use in conjunction with the password.
 * @param {number} iterations - The amount of hashes to compute as part of the key generation.
 * @param {number} keyLength - The desired length of the key.
 * @param {string} keyDigest - The digest of the key.
 * 
 * @returns {Promise<Buffer>} The key.
 */
function _pbkdf2(password, salt, iterations, keyLength, keyDigest) {

	return new Promise((resolve, reject) => {

		crypto.pbkdf2(password, salt, iterations, keyLength, keyDigest, (error, derivedKey) => {

			if (error) {
				return reject(error);
			}

			return resolve(derivedKey);
		});
	});
}

/**
 * Encrypt data using Password-Based Key Derivation Function 2, using aes-256-cbc.
 * 
 * @param {Object} options - Options relating to the encryption instruction.
 * @param {string} options.data - The data to encrypt.
 * @param {string} options.password - The password to use when generating the key.
 * @param {string} options.salt - The salt to be used for key generation as well as initialization vector for the cipher.
 * @param {string} options.ivBase16char - The 16 character string to use as filler in case the salt is less than 16 characters.
 * @param {crypto.Encoding} [options.inputEncoding] - Optional, the encoding of the provided data. `Default utf8`
 * @param {BufferEncoding} [options.outputEncoding] - Optional, the encoding to apply on the encrypted data string. `Default base64`
 * @param {number} [options.iterations] - Optional, the amount of hashes to compute as part of the key generation. `Default 250000`
 * @param {string} [options.keyDigest] - Optional, the digest of the key. `Default sha256`
 * 
 * @returns {Promise<string>} The encrypted data.
 */
async function pbkdf2encrypt({ data, password, salt, ivBase16char, inputEncoding = 'utf8', outputEncoding = 'base64', iterations = 250000, keyDigest = 'sha256' }) {

	const algorithm = 'aes-256-cbc';
	const keyLength = 32;

	// Ensure we have a 16 char iv.
	// Key length based on algorithm, cater for dynamic sizes or derive from target algo somehow.
	let iv = salt.substring(0, 16);
	if (iv.length < 16) {
		iv += ivBase16char.substring(0, 16 - iv.length);
	}

	const key = await _pbkdf2(password, salt, iterations, keyLength, keyDigest);

	const cipher = crypto.createCipheriv(algorithm, key, iv);
	const encrypted = Buffer.concat([cipher.update(data, inputEncoding), cipher.final()]);

	return encrypted.toString(outputEncoding);
}

/**
 * Decrypt data using Password-Based Key Derivation Function 2, using aes-256-cbc.
 * 
 * @param {Object} options - Options relating to the decryption instruction.
 * @param {string} options.encryptedData - The data to decrypt.
 * @param {string} options.password - The password to use when generating the key.
 * @param {string} options.salt - The salt to be used for key generation as well as initialization vector for the decipher.
 * @param {string} options.ivBase16char - The 16 character string to use as filler in case the salt is less than 16 characters.
 * @param {crypto.Encoding} [options.inputEncoding] - Optional, the encoding of the provided encrypted data. `Default base64`
 * @param {BufferEncoding} [options.outputEncoding] - Optional, the encoding to apply on the decrypted string. `Default utf8`
 * @param {number} [options.iterations] - Optional, the amount of hashes to compute as part of the key generation. `Default 250000`
 * @param {string} [options.keyDigest] - Optional, the digest of the key. `Default sha256`
 * 
 * @returns {Promise<string>} The decrypted data.
 */
async function pbkdf2decrypt({ encryptedData, password, salt, ivBase16char, inputEncoding = 'base64', outputEncoding = 'utf8', iterations = 250000, keyDigest = 'sha256' }) {

	const algorithm = 'aes-256-cbc';
	const keyLength = 32;

	const key = await _pbkdf2(password, salt, iterations, keyLength, keyDigest);

	// Ensure we have a 16 char iv.
	// Key length based on algorithm, cater for dynamic sizes or derive from target algo somehow.
	let iv = salt.substring(0, 16);
	if (iv.length < 16) {
		iv += ivBase16char.substring(0, 16 - iv.length);
	}

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	const decrypted = Buffer.concat([decipher.update(encryptedData, inputEncoding), decipher.final()]);

	return decrypted.toString(outputEncoding);
}

// #endregion

export {
	hash,
	publicDecrypt,
	publicEncrypt,
	privateDecrypt,
	privateEncrypt,
	pbkdf2decrypt,
	pbkdf2encrypt
};