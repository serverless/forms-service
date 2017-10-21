import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import formsReducer from './redux/forms'
import userReducer from './redux/user'

const logger = store => next => action => {
  if (action.type) {
    console.log(`>> dispatching ${action.type}`, JSON.stringify(action))
  }
  //console.log(chalk.blue(JSON.stringify(action, null, 3)))
  let result = next(action)
  //console.log(chalk.yellow(`next state`))
  //console.log(chalk.yellow(JSON.stringify(store.getState(), null, 3)))
  return result
}

export default function configureStore(initialState) {
  return createStore(
    combineReducers({
      forms: formsReducer,
      user: userReducer
    }),
    initialState,
    applyMiddleware(logger, thunk)
  );
}
