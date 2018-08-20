import React, { Component } from 'react';
import './App.css';

import PaymentForm from './components/PaymentForm';
import Heading from 'arui-feather/heading';
import Popup from 'reactjs-popup';
import ReactJson from 'react-json-view'
import {connect} from "react-redux";
import {resetPaymentInfo} from './actionCreators/paymentFormActions'

import Alpha from 'arui-feather/icon/brand/bank-2449';

class App extends Component {
  render() {
    const {paymentResponse} = this.props;
    return (
        <div className='app'>
            <Alpha className='logo' size='xl' colored={true}/>
            <Popup
                modal
                open={paymentResponse.status !== undefined}
                onClose={() => this.props.resetPaymentInfo()}
                contentStyle={{width: '25%',
                    minWidth: '250px'}}>
                <Heading size='s'>
                    Ответ сервера
                </Heading>
                <ReactJson enableClipboard={false} src={paymentResponse}/>
            </Popup>
            <Heading size='s'>
              Оплатите услугу
            </Heading>
            <PaymentForm/>
        </div>
    );
  }
}

function mapStateToProps(reduxState) {
    return {
        paymentResponse: reduxState.paymentResponse
    }
}

export default connect(mapStateToProps, {resetPaymentInfo})(App);
