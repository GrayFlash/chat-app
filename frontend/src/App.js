import React from 'react';
import {Route} from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import RegistrationPage from "./components/pages/RegistrationPage";
import MessagePage from './components/pages/MessagePage';


const App = () => (

<section className="hero">
  <Route path="/" exact component = {HomePage}/>
  <Route path="/login" exact component = {LoginPage}/>
  <Route path="/registration" exact component = {RegistrationPage}/>
  <Route path="/landing" exact component = {LandingPage}/>
  <Route path="/message" exact component = {MessagePage}/>

</section>
);

export default App;
