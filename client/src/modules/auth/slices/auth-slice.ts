/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Auth {
  username: string;
  password: string;
}

interface AuthState {
  user: Auth;
  loading: boolean;
  error: string;
  accessToken: string;
}

const initialState: AuthState = {
  user: {
    username: "",
    password: "",
  },
  loading: false,
  error: "",
  accessToken: "",
};
export const login = createAsyncThunk("auth/login", (data: any, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  return axios
    .post("http://localhost:10000/login/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log("res", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log("err", err.message);
      return rejectWithValue(err.message);
    });
});

export const getData = createAsyncThunk("auth/getData", (token: string) => {
  return axios
    .get("http://localhost:10000/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("res", res.data);
      return res.data;
    });
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.user = action.payload;
      console.log("hoooo", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.accessToken = action.payload.accessToken;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const authReducer = authSlice.reducer;
export const signDataActions = authSlice.actions;
