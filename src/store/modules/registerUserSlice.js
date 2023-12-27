import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = [
    {}
]
const  pageInfo = {
    STORE_URL: 'http://localhost:8080/api/register'
}

const registerUserSlice = createSlice({
    name: 'registerUser',
    initialState,
    reducers: {

    }
})

export const store = (data) => {
    console.log('data', data)
    return async () => {
        const fetchData = async () => {
            const response = await axios.post(pageInfo.STORE_URL, data)
            return await response.data;
        };

        try {
            return await fetchData();
        } catch (error) {
            console.log('error -->', error.response)
            throw error.response
        }
    }
}

export default registerUserSlice.reducer