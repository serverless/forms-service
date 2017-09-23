import ReactDOM from 'react-dom'
import { makeMainRoutes } from './routes'
import './index.css'

const routes = makeMainRoutes()
const mountNode = document.getElementById('root')

// render app
ReactDOM.render(routes, mountNode)
