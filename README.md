# Serverless Form Collection Application

Collect and manage form data with serverless tech.

## Frontend

- React application using [create react app](https://github.com/facebookincubator/create-react-app)
- Routing via [react router 4](https://reacttraining.com/react-router/web/guides/philosophy)
- State management via [redux](https://redux.js.org/)
- Talks to API Gateway via [axios](https://github.com/axios/axios)
- Auth via [Auth0](https://auth0.com)
- Hosted on [Netlify](https://www.netlify.com/)

## Backend

- Node backend running in AWS Lambda Functions
- DynamoDB noSQL for database
- Authorization via API Gateway Custom Authorizer Function

![slsforms](https://user-images.githubusercontent.com/532272/34530669-bc0efe0c-f064-11e7-94fe-5a17b636d5f7.png)

## Setup

1. Clone down the repo and install the dependencies

  ```bash
  # install frontend dependencies
  cd frontend && npm i

  # install backend dependencies
  cd backend && npm i
  ```

2. Setup auth0 client. See Auth0 Setup below

3. Then deploy the backend application. ([install `serverless`](https://serverless.com/getting-started/) if you haven't already)

  ```bash
  cd backend

  serverless deploy
  ```

4. Add the API values to `src/_config.js` and bootup the frontend!

  ```
  cd frontend

  npm start
  ```

## Deployment

Connect your repo to netlify and add the build command `cd frontend && npm install && npm run build`  

## Auth0 Setup

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
