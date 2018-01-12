import React from 'react'
import AppLayout from '../../fragments/AppLayout'

const Welcome = ({ location }) => (
  <AppLayout>
    <div style={{marginBottom: 60}}>
      <h1>Serverless Forms Application</h1>
      <p>Collect and manage form data with serverless tech. <a href="https://github.com/serverless/forms-service">View source code on github</a></p>
      <h2>About the Frontend</h2>
      <ul>
        <li>
          React application based on <a href="https://github.com/facebookincubator/create-react-app">create react app</a>
        </li>
        <li>
          Routing via <a href="https://reacttraining.com/react-router/web/guides/philosophy" rel="nofollow">react router 4</a>
        </li>
        <li>
          State management via <a href="https://redux.js.org/" rel="nofollow">redux</a>
        </li>
        <li>
          Talks to AWS API Gateway via <a href="https://github.com/axios/axios">axios</a>
        </li>
        <li>
          User auth via <a href="https://auth0.com" rel="nofollow">Auth0</a>
        </li>
        <li>
          Hosted on <a href="https://www.netlify.com/" rel="nofollow">Netlify</a>
        </li>
      </ul>
      <h2>About the Backend</h2>
      <ul>
        <li>Node backend running in AWS Lambda Functions</li>
        <li>Using AWS DynamoDB noSQL database</li>
        <li>User Authorization handled via API Gateway Custom Authorizer Functions</li>
      </ul>

      <div>
        <img
          src="https://user-images.githubusercontent.com/532272/34530669-bc0efe0c-f064-11e7-94fe-5a17b636d5f7.png" alt="slsforms" style={{maxWidth: '800px'}}
        />
      </div>

      <h2>
        <a href="https://github.com/serverless/forms-service">Fork on github</a>
      </h2>

    </div>
  </AppLayout>
)

export default Welcome
