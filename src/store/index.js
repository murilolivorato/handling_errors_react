import { configureStore } from "@reduxjs/toolkit";
import registerUserReducer from './modules/registerUserSlice';

export const store = configureStore({
    reducer: {
        registerUser: registerUserReducer
    }
})