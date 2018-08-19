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
    }

    render() {
        return(
            <Plate>
                <Form
                    onSubmit={ () => { alert('Мы перезвоним вам в течение 5 минут'); } }
                    size='xl'
                    footer={
                        <Button size='m' view='extra' type='submit'>Оплатить</Button>
                    }>
                    <div className='form__body'>
                    <FormField>
                        <MoneyInput
                            width='available'
                            label='Сумма платежа'
                            rightAddons={
                                <RadioGroup type='button'>
                                    {
                                        ['₽', '$', '€'].map(item => (
                                            <Radio
                                                key={ item }
                                                size='s'
                                                type='button'
                                                text={ item }
                                                onChange={ () => {} }
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
                            placeholder='1234 5678 9876 5432'
                        />
                    </FormField>
                    <FormField>
                        <InputGroup
                            width='available'>
                            <Input
                                label='Срок действия'
                                mask='11/11'
                                placeholder='01/20'
                            />
                            <Input
                                label='CVV'
                                mask='111'
                                placeholder='000'
                            />
                        </InputGroup>
                    </FormField>
                    <FormField>
                        <Input
                            label='Имя держателя'
                            placeholder='IVAN IVANOV'
                            width='available'
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