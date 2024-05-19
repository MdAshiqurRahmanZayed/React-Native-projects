import * as actionTypes from './actionTypes';

const initState = {
    bookList: [],
    isAuth: false,
    token: null,
    userId: null
}

export const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_PLACE:
            return {
                ...state,
                bookList: state.bookList.concat(action.payload)
            }
            case actionTypes.DELETE_PLACE:
                return {
                    ...state,
                    bookList: state.bookList.filter(place => place.key !== action.payload)
                }
                case actionTypes.SET_BOOKS:
                    return {
                        ...state,
                        bookList: action.payload
                    }
                    case actionTypes.AUTHENTICATE_USER:
                        return {
                            ...state,
                            isAuth: true,
                            token: action.payload.token,
                            userId: action.payload.userId
                        }

            case actionTypes.REMOVE_TOKEN:
                return {
                    ...state,
                    isAuth: false,
                    token: null
                }
                        default:
                            return state;
    }
}