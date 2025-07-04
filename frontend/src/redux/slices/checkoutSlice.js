import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk("checkout/createCheckout", async (checkoutdata, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, checkoutdata, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        checkoutData: null,
        loading: false,
        error: null,
    },
    reducers: {
        setCheckoutData: (state, action) => {
            state.checkoutData = action.payload;
        },
        clearCheckoutData: (state) => {
            state.checkoutData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkoutData = action.payload;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { setCheckoutData, clearCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;