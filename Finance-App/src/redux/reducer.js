import * as actionTypes from './actionTypes';

const initState = {
    isAuth: false,
    token: null,
    userId: null
}

export const rootReducer = (state = initState, action) => {
    switch (action.type) {
      
            case actionTypes.AUTHENTICATE_USER:
                return {
                    ...state,
                    isAuth: true,
                    token: action.payload.token,
                    userId: action.payload.userId
                }
            default:
                return state;
    }
}