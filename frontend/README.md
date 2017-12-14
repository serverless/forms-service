# Forms service frontend

Manage contacts and forms.

## Setup

```
npm install
```

## Running

```bash
npm start
```

## Building

```bash
npm run build
```

## Security Notes

- [Double submitted cookies](https://stackoverflow.com/questions/11518245/csrf-attacks-and-double-submitted-cookie#answer-29622103
)

## Setting up auth0

- Make sure [Cross-Origin Authentication](https://auth0.com/docs/cross-origin-authentication) is on.
- Plugin client ID in `/utils/auth.config.js`
