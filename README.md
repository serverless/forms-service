# Serverless Form Service

Collect and manage form data.

## Install

```
npm i
```

## Setup

1. [Create an Auth0 Client](https://manage.auth0.com/#/clients/create)

    1. Choose Single Page web app
    2. Grab your auth0 domain and clientID from your auth0 client settings
    3. plug those values into the frontend and backend config

2. Install the [Auth0 Authorization extension](https://manage.auth0.com/#/extensions) in your auth0 account

3. Add an [auth0 rule](https://manage.auth0.com/#/rules) that will attach user roles to your JWT token

    ```js
    function (user, context, callback) {
      if (context.clientID === 'your-auth-client-id') {
        // Update namespace with your namespace
        var namespace = 'https://serverless.com/';
        // console for debug purposes
        console.log('user.roles', user.roles);
        // add role to JWT token
        context.idToken[namespace + 'roles'] = user.roles;
      }
      callback(null, user, context);
    }
    ```

4. Add your auth0 values to `/frontend/src/_config.js`
