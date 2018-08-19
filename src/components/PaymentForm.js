import React, {Component} from 'react';
import {connect} from 'react-redux';

import Form from 'arui-feather/form';
import FormField from 'arui-feather/form-field';
import Input from 'arui-feather/input';
import MoneyInput from 'arui-feather/money-input';
import Button from 'arui-feather/button';
import RadioGroup from 'arui-feather/radio-group';
import Radio from 'arui-feather/radio';
import CardInput from 'arui-feather/card-input';
import Plate from 'arui-feather/plate';
import InputGroup from 'arui-feather/input-group';

class PaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: {
                number: 0.0,
                currency: 'rub'
            },
            wasClicked: {},
            cardNumber: '',
            expiration: '',
            cvv: '',
            holderName: '',
            isFine: false
        }
    }

    handleInputBlur = (_id) => {
        const {wasClicked} = this.state;
        this.setState({
            wasClicked: {
                ...wasClicked,
                [_id]: true
            }
        });
    };

    handleMoneyInputChange = (money) => {
        const {amount} = this.state;
        const moneyNumber = parseFloat(money.replace(/\s/g, '').replace(/,/g, '.'));
        this.setState({
            amount: {
                ...amount,
                number: money ? moneyNumber : 0
            }
        }, () =>
            this.setState({
                isFine: this.checkIfFine()
            })
        )
    };

    handleCurrencyChange = (cur) => {
        const {amount} = this.state;
        this.setState({
          amount: {
              ...amount,
              currency: cur
          }
        })
    };

    handleCardNumberInputChange = (number) => {
        const cNumber = number.replace(/\s/g, '');
        this.setState({
            cardNumber: cNumber
        }, () => {
            this.setState({
                isFine: this.checkIfFine()
            })
        })
    };

    handleExpirationDateInputChange = (exp) => {
        this.setState({
            expiration: exp
        }, () => {
            this.setState({
                isFine: this.checkIfFine()
            })
        })
    };

    handleCVVInputChange = (cvv) => {
        this.setState({
            cvv
        }, () => {
            this.setState({
                isFine: this.checkIfFine()
            })
        })
    };

    handleCardHolderNameInputChange = (name) => {
        if (name.split(' ').length<3) {
            this.setState({
                holderName: name.toUpperCase()
            }, () => {
                this.setState({
                    isFine: this.checkIfFine()
                })
            })
        }
    };

    checkIfFine = () => {
        const {amount, cardNumber, cvv, holderName} = this.state;
        return amount.number > 0
            && (cardNumber.length === 16 || cardNumber.length === 18)
            && this.checkExpirationDate()
            && cvv.length === 3
            && holderName.match(/^[a-zA-Z ]+$/)
            && holderName.split(' ').filter(s => s !== '').length === 2;
    };

    checkExpirationDate = () => {
        const {expiration} = this.state;
        let [month, year] = expiration.split('/');
        month = parseInt(month);
        year = parseInt(year) + 2000;
        let curDate = new Date();
        let [curYear, curMonth] = [curDate.getFullYear(), curDate.getMonth() + 1];
        return (year > curYear || (curYear === year && month > curMonth)) && (month > 0 && month < 13);
    };

    render() {
        const {amount, wasClicked, isFine, cardNumber, cvv, holderName} = this.state;
        return(
            <Plate>
                <Form
                    onSubmit={ () => { alert('Мы перезвоним вам в течение 5 минут'); } }
                    footer={
                        <Button size='m' view='extra' type='submit' disabled={!isFine}>Оплатить</Button>
                    }>
                    <div className='form__body'>
                        <FormField>
                            <MoneyInput
                                width='available'
                                label='Сумма платежа'
                                onChange={this.handleMoneyInputChange}
                                onBlur={this.handleInputBlur.bind(this,'money')}
                                error={ amount.number <= 0 && wasClicked.money ? 'Сумма платежа должна быть больше нуля' : null }
                                rightAddons={
                                    <RadioGroup type='button'>
                                        {
                                            [{key: '₽', name: 'rub'}, {key: '$', name: 'usd'}, {key: '€', name: 'eur'}].map(item => (
                                                <Radio
                                                    key={ item.key }
                                                    size='s'
                                                    type='button'
                                                    checked={amount.currency === item.name}
                                                    text={ item.key }
                                                    onChange={this.handleCurrencyChange.bind(this,item.name)}
                                                />
                                            ))
                                        }
                                    </RadioGroup>
                                }
                            />
                        </FormField>
                        <FormField>
                            <CardInput
                                width='available'
                                label='Номер карты'
                                placeholder='1234 1234 1234 1234'
                                error={ (cardNumber.length !== 16 && cardNumber.length !== 18)
                                && wasClicked.card ? 'Номер карты должен состоять из 16 или 18 цифр' : null }
                                onChange={this.handleCardNumberInputChange}
                                onBlur={this.handleInputBlur.bind(this,'card')}
                            />
                        </FormField>
                        <FormField>
                            <InputGroup
                                width='available'>
                                <Input
                                    label='Срок действия'
                                    mask='11/11'
                                    placeholder='01/20'
                                    error={!this.checkExpirationDate()
                                    && wasClicked.expiration ?
                                    'Срок действия введен неверно или карта больше недействительна' : null}
                                    onChange={this.handleExpirationDateInputChange}
                                    onBlur={this.handleInputBlur.bind(this,'expiration')}
                                />
                                <Input
                                    label='CVV'
                                    mask='111'
                                    placeholder='000'
                                    error={ cvv.length !== 3
                                    && wasClicked.cvv ? 'CVV код должен состоять из 3 цифр' : null }
                                    onChange={this.handleCVVInputChange}
                                    onBlur={this.handleInputBlur.bind(this,'cvv')}
                                />
                            </InputGroup>
                        </FormField>
                        <FormField>
                            <Input
                                value={holderName}
                                label='Имя держателя'
                                placeholder='IVAN IVANOV'
                                width='available'
                                onChange={this.handleCardHolderNameInputChange}
                                onBlur={this.handleInputBlur.bind(this,'holderName')}
                                error={(!holderName.match(/^[a-zA-Z ]+$/) || holderName.split(' ').filter(s => s !== '').length !== 2)
                                && wasClicked.holderName ? 'Поле должно включать только латинские буквы и состоять из имени и фамилии' : null }
                            />
                        </FormField>
                    </div>
                </Form>
            </Plate>
        )
    }
}

function mapStateToProps(reduxState) {
    return {
        lang: reduxState.lang,
        loggedIn: reduxState.loggedIn
    }
}

export default connect(mapStateToProps)(PaymentForm);