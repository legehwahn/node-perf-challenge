# node-perf-challenge

### Prerequisites

- [nodejs v18](https://nodejs.org/en/download/current/)

### Run

(optional) Specify PORT environment variable. `default: 3000`

1. `npm install` (only required to perform once to install dependencies)
1. `npm start`

### Test

An asymmetric key pair can be generated using
[this keygen script](https://github.com/legehwahn/keygen).

Set Public Key

```
curl --request POST \
  --url http://localhost:3000/keys/public \
  --header 'Content-Type: text/plain' \
  --data '-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAypB75hh8laEE5TktJ4AZ
qg6iSEjg4XYAcL/tk5sDcDsJhkF6x9JIMNfYyKeOwpnT4xVjF6ofM9cSO435vl8P
45buCV0+uOFe2lcKQSmh/gfF9i/iSh6ZNfcY5X3xbKfe6GCOMMbVa5r6686JJcxT
X0qE9BufIlWWzRBgKkrxVaxEpwtX+7IQhzgMZzvEvskUXxRHAw1KnD981iFzBqVW
TXmZbaPbY1vlUgLk440Pybx88A2sqnTB/vMZknUyCR6Wat/YlxMVof+o/uwGapES
6TRqqyD3ETTnjjRkYzGIO/nt5SkZRL++ZM1mtow22u+oxxzZBNO0yLXcyECnP5Rq
R8cI3dfAzVEEHng5ksm7k+/3EhU2zAoLY6J6I0yQ0ys8z6b8fkNc+cm+DRXr6gOw
5XhTgXWChGq/2iYozenppjcX3N7O+pjnaMpYiddZVpvRZ88JveCFpWP0YHckPgcb
DXcWpAtX5aO30BQND7yms8IoCPbhcFUtZi7NVVUJj+cPgWKLeRpBdxVq8m6AcdfJ
TpT463vV18XrcLoeiIkrCwWL1NV7UuNxTX34/lPpgkOTId8TK4tAB4ggMLlOMLMv
xXob7VkN7edXEnADEVnnJn0LKnd+wsNQP6HMCa8nyHfhJf6xdPkNaHO/KiIUyt0Z
frl8jn0HMKddFqVTzdYeUnsCAwEAAQ==
-----END PUBLIC KEY-----
'
```

Set Private Key

```
curl --request POST \
  --url http://localhost:3000/keys/private \
  --header 'Content-Type: text/plain' \
  --header 'passphrase: ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT' \
  --data '-----BEGIN ENCRYPTED PRIVATE KEY-----
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
-----END ENCRYPTED PRIVATE KEY-----
'
```

**Encrypt**

Performs a private encrypt which requires the private key and passphrase to be
set.

```
curl --request POST \
  --url http://localhost:3000/encrypt \
  --header 'Content-Type: application/json' \
  --data '{
	"data": "something to encrypt"
}'
```

**Decrypt**

Performs a public decrypt which requires the public key to be set.

```
curl --request POST \
  --url http://localhost:3000/decrypt \
  --header 'Content-Type: application/json' \
  --data '{
	"encryptedData": "ung3ogEN39jrToWDn6QH+HryQIXBNZ6W/c9OF+9Q0/CgWCuLGLbJnQo8+VUAX36GZiWzJf1fDn187y7hp9yL3f2MjguzkqT2ksHaiQfChdjkxRk5jNPity3nHo3xChzv4FMN0EL53eSXmf6sroL5a28vKmBmUsJMlZvN+Zg3az0mei13jykosOum3EUOqqKBmnsG+MYJINn2JxFsKzNPgZvP3H/fB8xDHuRcFKhsvksZfBzcqsf3cM56WlM2s+dpfsgHuoUNPJjIGTH5S8suM8yW5OZSe+eXU6Vnah8Vsw4/WicehJnsmCHtkEF+6GHdwbJ2bldJSFQwUPrukixlFxNIdPMdRyy03LwFb4RlPvan4ruaHsZjlDRbCHT5dxdZoJEx6OKwkE8wvARZhRLYMlex0xT+hxuz95nULWOpfo9dY9hLNBiwS75oS5jSX1+87OtJWtJl70MUn0elcHmU/8lwzgPdVlYXT5z7ePZ0XRDMVZFxsY/NW5fJXOluhpzQ9Z/Olw7eP5oco28NUbvK8qAwu4Ffzqkt2WcvZ1Dn+NboJ6Famuo0IrVaPn2qlMJkYXNCHJDj2HrbKp9TaQoKBGNrFxROCN0xm6vWY/3h+w+36mYyWdU5vEtyhpAor1KEry8T4geHfuilVRGuXfoB2YneNmI2p+ZDgwHnZkIxUsg="
}'
```
