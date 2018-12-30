import React, { Component } from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomeScreen from '../HomeScreen'
import Header from '../Header'
import Page404 from './Page404'
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={HomeScreen} />
            <Route path="/about" component={HomeScreen} />
            <Route component={Page404} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
