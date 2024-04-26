/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Patient {
  id?: string;
  gender: string;
  name: string;
  weight: number;
  height: number;
  age: number;
  bloodType: string;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: "",
};

export const getPatientData = createAsyncThunk(
  "patients/getPatientData",
  (id: number | undefined) => {
    return axios
      .get(`http://localhost:3005/patients?id=${id}`)
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
      console.log("hoooo", action.payload);
      console.log("hoooo", state.patients);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPatientData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPatientData.fulfilled, (state, action) => {
      state.loading = false;
      state.patients = action.payload;
    });
    builder.addCase(getPatientData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });
  },
});

export const patientActions = patientSlice.actions;
export const patientReducer = patientSlice.reducer;
