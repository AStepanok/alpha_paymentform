import {actions, API_URL} from "./constants";

export function changeAmount(amount) {
    return dispatch => {
        dispatch(handleChangeAmount(amount));
    }
}

export function changeCardNumber(number) {
    return dispatch => {
        dispatch(handleChangeCardNumber(number));
    }
}

export function changeExpirationDate(date) {
    return dispatch => {
        dispatch(handleChangeExpirationDate(date));
    }
}

export function changeCVV(cvv) {
    return dispatch => {
        dispatch(handleChangeCVV(cvv));
    }
}

export function changeHolderName(name) {
    return dispatch => {
        dispatch(handleChangeHolderName(name));
    }
}

export function sendPayment(payment) {
    return dispatch => {
        return fetch(`${API_URL}/payment`, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payment)
        })
        .then(data => data.json())
        .then(data => dispatch(handleSendPayment(data)))
        .catch(err => {
            dispatch(handleSendPayment({
                status: 'error',
                message: 'Something wrong with the server'
            }))
        });
    }
}

export function resetPaymentInfo() {
    return dispatch => {
        dispatch(handleResetPaymentInfo());
    }
}

function handleChangeAmount(amount) {
    return {
        type: actions.CHANGE_AMOUNT,
        amount
    }
}

function handleChangeCardNumber(number) {
    return {
        type: actions.CHANGE_CARD_NUMBER,
        number
    }
}

function handleChangeExpirationDate(date) {
    return {
        type: actions.CHANGE_EXPIRATION_DATE,
        date
    }
}

function handleChangeCVV(cvv) {
    return {
        type: actions.CHANGE_CVV,
        cvv
    }
}

function handleChangeHolderName(name) {
    return {
        type: actions.CHANGE_HOLDER_NAME,
        name
    }
}

function handleSendPayment(res) {
    return {
        type: actions.SEND_PAYMENT,
        res
    }
}

function handleResetPaymentInfo() {
    return {
        type: actions.RESET_PAYMENT_INFO
    }
}

