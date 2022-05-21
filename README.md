# node-crypto-performance

### Prerequisites

- nodejs
- npm
- vscode (only required for debugging)

### Local setup

- `npm ci`

### Debugging

- F5

### Run standalone

Specify PORT environment variable

- `npm start`
- `node --experimental-specifier-resolution=node main.js`

### Test

```
curl --request POST \
  --url http://localhost:3000/encrypt \
  --header 'Content-Type: application/json' \
  --data '{
	"data": "something to encrypt",
	"password": "chuck-norris-strength-level-secure-key"
}'
```
