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
import Spin from 'arui-feather/spin';

import Visa from 'arui-feather/icon/brand/card-visa';
import Mir from 'arui-feather/icon/brand/card-mir';
import MasterCard from 'arui-feather/icon/brand/card-mastercard';

import {changeAmount, changeCardNumber, changeCVV, changeExpirationDate, changeHolderName, sendPayment} from '../actionCreators/paymentFormActions';

class PaymentForm extends Component {
    constructor(props) {
        super(props);

        // wasClicked хранит информацию о том, были ли выбраны поля формы хотя бы один раз
        // isFine - все ли в порядке с формой, если true, то кнопка отправки становится активной
        // requestInProgrss - отправка платежа на сервер произошла, но ответ еще не получен
        this.state = {
            wasClicked: {},
            isFine: false,
            requestInProgress: false
        }
    }

    // Этот метод нужен для проверки корректности формы после внесения изменений в какое либо из полей
    componentWillReceiveProps(nextProps) {
        this.setState({
            isFine: this.checkIfFine(nextProps)
        });
    }

    // Отправка формы на сервер
    handleFormSubmit = (e) => {
        e.preventDefault();
        this.setState({
            requestInProgress: true
        }, function () {
            this.props.sendPayment(this.props)
            .then(() => {
                this.setState({
                    requestInProgress: false,
                }, function () {
                    if (this.props.paymentResponse.status === 'success') {
                        this.setState({
                            wasClicked:[],
                            isFine: false
                        })
                    }
                });
            });
        })
    };

    // Отслеживание клика по полю. Добавления поля в массив wasClicked
    handleInputBlur = (_id) => {
        const {wasClicked} = this.state;
        this.setState({
            wasClicked: {
                ...wasClicked,
                [_id]: true
            }
        });
    };

    // Отслеживание введения суммы платежа
    handleMoneyInputChange = (money) => {
        let moneyNumber = money.replace(/\s/g, '').replace(/,/g, '.');
        if (this.props.amount.number === '0' && moneyNumber[moneyNumber.length-1] !== '.') {
            moneyNumber = moneyNumber.substr(1);
        }
        this.props.changeAmount({number: money ? moneyNumber : '0'});
    };

    // Отслеживание изменения валюты платежа
    handleCurrencyChange = (cur) => {
        this.props.changeAmount({currency: cur});
    };

    // Отслеживание изменения номера карты платежа
    handleCardNumberInputChange = (number) => {
        const cNumber = number.replace(/\s/g, '');
        this.props.changeCardNumber(cNumber);
    };

    // Отслеживание изменения даты истечения срока действия карты
    handleExpirationDateInputChange = (exp) => {
        this.props.changeExpirationDate(exp);
    };

    // Отслеживание изменения CVV кода карты
    handleCVVInputChange = (cvv) => {
        this.props.changeCVV(cvv);
    };

    // Отслеживание изменения имени владельца карты
    handleCardHolderNameInputChange = (name) => {
        if (name.split(' ').length<3) {
            this.props.changeHolderName(name.toUpperCase());
        }
    };

    // Сама проверка возможности отправки платежа
    checkIfFine = (nextProps) => {
        const {amount, cardNumber, cvv, holderName} = nextProps;
        return amount.number > 0
            && (cardNumber.length === 16 || cardNumber.length === 18)
            && this.checkExpirationDate(nextProps)
            && cvv.length === 3
            && holderName.match(/^[a-zA-Z ]+$/)
            && holderName.split(' ').filter(s => s !== '').length === 2;
    };

    // Дополнительная функция для проверки срока истечения на корректность
    checkExpirationDate = (props) => {
        const {expiration} = props;
        let [month, year] = expiration.split('/');
        month = parseInt(month);
        year = parseInt(year) + 2000;
        let curDate = new Date();
        let [curYear, curMonth] = [curDate.getFullYear(), curDate.getMonth() + 1];
        return (year > curYear || (curYear === year && month > curMonth)) && (month > 0 && month < 13);
    };

    render() {
        const {wasClicked, isFine, requestInProgress} = this.state;
        const {amount, cardNumber, cvv, holderName, expiration} = this.props;

        // Иконка платежной системы по первой цифре
        let paymentIcon;
        switch (cardNumber[0]) {
            case '2':
                paymentIcon = <Mir colored={true}/>;
                break;
            case '4':
                paymentIcon = <Visa colored={true}/>;
                break;
            case '5':
                paymentIcon = <MasterCard colored={true}/>;
                break;
            default:
                paymentIcon = undefined
        }

        return(
            <Plate>
                <Form
                    onSubmit={this.handleFormSubmit}
                    footer={
                        <Button icon={
                            <Spin
                                size='s'
                                visible={requestInProgress}
                            />
                        } size='m' view='extra' type='submit' disabled={!isFine}>Оплатить</Button>

                    }>
                    <div className='form__body'>
                        <FormField>
                            <MoneyInput
                                width='available'
                                label='Сумма платежа'
                                value={amount.number}
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
                                onChange={this.handleMoneyInputChange}
                                onBlur={this.handleInputBlur.bind(this,'money')}
                                error={ amount.number <= 0 && wasClicked.money ? 'Сумма платежа должна быть больше нуля' : null }
                            />
                        </FormField>
                        <FormField>
                            <CardInput
                                width='available'
                                label='Номер карты'
                                placeholder='1234 1234 1234 1234'
                                value={cardNumber}
                                error={ (cardNumber.length !== 16 && cardNumber.length !== 18)
                                && wasClicked.card ? 'Номер карты должен состоять из 16 или 18 цифр' : null }
                                onChange={this.handleCardNumberInputChange}
                                onBlur={this.handleInputBlur.bind(this,'card')}
                                rightAddons={
                                    paymentIcon
                                }
                            />
                        </FormField>
                        <FormField>
                            <InputGroup
                                width='available'>
                                <Input
                                    label='Срок действия'
                                    mask='11/11'
                                    placeholder='01/20'
                                    value={expiration}
                                    error={!this.checkExpirationDate(this.props)
                                    && wasClicked.expiration ?
                                    'Срок действия введен неверно или карта больше недействительна' : null}
                                    onChange={this.handleExpirationDateInputChange}
                                    onBlur={this.handleInputBlur.bind(this,'expiration')}
                                />
                                <Input
                                    label='CVV'
                                    mask='111'
                                    placeholder='000'
                                    value={cvv}
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

// Сопостовляем redux и props
function mapStateToProps(reduxState) {
    return {
        amount: reduxState.amount,
        cardNumber: reduxState.cardNumber,
        cvv: reduxState.cvv,
        holderName: reduxState.holderName,
        expiration: reduxState.expiration,
        paymentResponse: reduxState.paymentResponse
    }
}

export default connect(mapStateToProps, {changeAmount, changeCardNumber, changeExpirationDate, changeCVV, changeHolderName, sendPayment})(PaymentForm);