# node-crypto-performance

### Prerequisites

- nodejs
- npm

### Local setup

- `npm i`

### Run

(optional) Specify PORT environment variable. `default: 3000`

1. `npm start`
1. `node --experimental-specifier-resolution=node main.js`

### Test

```
curl --request POST \
  --url http://localhost:3000/encrypt \
  --header 'Content-Type: application/json' \
  --data '{
	"data": "something to encrypt",
	"password": "alpha-bravo-charlie-delta-echo-foxtrot"
}'
```
