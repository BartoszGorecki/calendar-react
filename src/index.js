import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './style/buttons.css'
import './style/getevent.css'
import './style/listofevents.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
