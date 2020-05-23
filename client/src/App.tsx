import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Register from './components/registration/Register';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
        <Route path="/register" component={Register} />
        <Route path="/home" component={Home} />
        <Route path="/" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
