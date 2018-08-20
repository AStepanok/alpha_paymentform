import {actions} from "../actionCreators/constants";

const initialState = {
    amount: {
        number: '',
        currency: 'rub'
    },
    cardNumber: '',
    expiration: '',
    cvv: '',
    holderName: '',
    paymentResponse: {}
};

export default function rootReducer(state = initialState, action) {
    switch (action.type){
        case actions.CHANGE_AMOUNT:
            return {
                ...state,
                amount: {
                    ...state.amount,
                    ...action.amount
                }
            };
        case actions.CHANGE_CARD_NUMBER:
            return {
                ...state,
                cardNumber: action.number
            };
        case actions.CHANGE_EXPIRATION_DATE:
            return {
                ...state,
                expiration: action.date
            };
        case actions.CHANGE_CVV:
            return {
                ...state,
                cvv: action.cvv
            };
        case actions.CHANGE_HOLDER_NAME:
            return {
                ...state,
                holderName: action.name
            };
        case actions.SEND_PAYMENT:
            return {
                ...state,
                paymentResponse: action.res
            };
        case actions.RESET_PAYMENT_INFO:
            if (state.paymentResponse.status === 'success')
                return initialState;
            return {
                ...state,
                paymentResponse: {}
            };
        default:
            return state;
    }
}