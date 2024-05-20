import * as actionTypes from './actionTypes';
import {
    navigate
} from '../NavigationRoot.js';
import {
    jwtDecode
} from 'jwt-decode';


export const authUser = (token,userId) => {
    return {
        type: actionTypes.AUTHENTICATE_USER,
        payload: {token,userId}
    }
}


export const tryAuth = (email, password, mode) => dispatch => {
    let url = "";
    const API_KEY = "AIzaSyDnvMY0V-1ZOsZQUhVBU3ACKlTHdnH3ktA";
    if (mode === "signup") {
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY;
    } else if (mode === "login") {
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + API_KEY;
    }
    // console.log(url);
    fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .catch(err => {
            console.log(err);
            alert("Authentication Failed!");
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error.message);
            } else {
                const userId = jwtDecode(data.idToken)
                // console.log(userId.user_id);
                dispatch(authUser(data.idToken, userId.user_id));
                navigate("FinanceMain");
            }
            // console.log(data.idToken)
        })


}