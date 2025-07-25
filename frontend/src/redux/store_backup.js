import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import adminProductReducer from './slices/adminProductSlice';
import adminOrderReducer from './slices/adminOrderSlice';
import adminIngredientReducer from './slices/adminIngredientSlice';
import analyticsReducer from './slices/analyticsSlice';
import inventoryReducer from './slices/inventorySlice';
import managerOrderReducer from './slices/managerOrderSlice';
import bakerOrderReducer from './slices/bakerOrderSlice';
import deliveryOrderReducer from './slices/deliveryOrderSlice';

import inventoryReducer from './slices/inventorySlice';
import managerOrderReducer from './slices/managerOrderSlice';
import bakerOrderReducer from './slices/bakerOrderSlice';
import deliveryOrderReducer from './slices/deliveryOrderSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        ingredients: ingredientsReducer,
        cart : cartReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        admin: adminReducer,
        adminProducts: adminProductReducer,
        adminOrders: adminOrderReducer,
        adminIngredients: adminIngredientReducer,
        analytics: analyticsReducer,
        inventory: inventoryReducer,
        managerOrders: managerOrderReducer,
        bakerOrders: bakerOrderReducer,
        deliveryOrders: deliveryOrderReducer,
    },
});

export default store;
