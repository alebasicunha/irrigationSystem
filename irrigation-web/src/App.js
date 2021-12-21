import './App.css';
import React from 'react';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import ListSistemasComponent from './components/ListSistemasComponent';

function App() { 
  return (
    <div className="corpo">
      <HeaderComponent />      
      <div className="container">
        <h1>Sistemas de Irrigação</h1>       
        <ListSistemasComponent/> 
      </div>
      <FooterComponent />
    </div>
  );
}

export default App;
