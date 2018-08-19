import React, { Component } from 'react';
import './App.css';

import PaymentForm from './components/PaymentForm';
import Heading from 'arui-feather/heading';


class App extends Component {
  render() {
    return (
        <div className='app'>
            <Heading size='s'>
              Оплатите услугу
            </Heading>
            <PaymentForm/>
        </div>
    );
  }
}

export default App;
