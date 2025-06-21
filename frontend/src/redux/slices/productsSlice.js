import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//async thunk to fetch products by collection and optional filters

export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    category,
    size,
    flavor,
    minPrice,
    maxPrice,
    sortBy,
    search,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (category) query.append("category", category);
    if (size) query.append("size", size);
    if (flavor) query.append("flavor", flavor);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (limit) query.append("limit", limit);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );
    return response.data;
  }
);
// asyn thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

//Async thunk to fetch similar products

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

//async thunk to delete a products
export const fetchSimilarProducts = createAsyncThunk("products/fetchSimilarProducts", async ({id}) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
}
);
const productsSlice = createSlice({
     name : "products",
    initialState: {
        products: [],
        selectedProduct: null,
        similarProducts: [],
        loading: false,
        error: null,
        filters: {
            category:"",
            size: "",
            flavor: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
        },
    },
    reducers:{
        setFilters: (state, action) => {
            state.filters = {...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: "",
                size: "",
                flavor: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProductsByFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle fetching single product details
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle updating a product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload;
                const index = state.products.findIndex(
                    (product) => product._id === updatedProduct._id
                );
                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle fetching similar products
            .addCase(fetchSimilarProducts.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
              state.loading = false;
              state.similarProducts = action.payload;
          })
          .addCase(fetchSimilarProducts.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
          });
    }
})

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;