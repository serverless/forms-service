import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import formsReducer from './redux/forms'

export default function configureStore(initialState) {
  return createStore(
    combineReducers({
      forms: formsReducer
    }),
    initialState,
    applyMiddleware(thunk)
  );
}
