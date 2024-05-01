import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Patient {
  id?: string;
  gender?: string;
  name: string;
  weight: number;
  length: number;
  age?: number;
  bloodType?: string;
  neededTest?: string[];
  prescriptionData?: object;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string;
  isFormTestsVisible?: boolean;
  isPrescriptionVisible?: boolean;
  neededTest: string[];
  prescriptionData: object;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: "",
  isFormTestsVisible: false,
  neededTest: [],
  prescriptionData: {},
};

export const getPatientData = createAsyncThunk(
  "patients/getPatientData",
  (data: any) => {
    return axios
      .get(`http://localhost:10000/patient/${data.parsedId}`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

export const getDataRecord = createAsyncThunk(
  "patients/getDataRecord",
  (data: number | undefined) => {
    return axios
      .get(`http://localhost:10000/EMR/patient/2/record`)
      .then((res) => {
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
    setTestsVisibility(state, action: PayloadAction<boolean>) {
      console.log("action");
      state.isFormTestsVisible = action.payload;
    },
    setFormPrescrition(state, action: PayloadAction<boolean>) {
      state.isPrescriptionVisible = action.payload;
    },
    setPatientData(state, action: PayloadAction<Patient[]>) {
      state.patients = action.payload;
    },
    setNeededTests(state, action: PayloadAction<string[]>) {
      state.neededTest = action.payload;
    },
    setPrescriptionData(state, action: PayloadAction<object>) {
      state.prescriptionData = action.payload;
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
    builder.addCase(getDataRecord.fulfilled, (state, action) => {
      state.patients.push(...action.payload);
      console.log(action.payload);
    });
  },
});

export const patientActions = patientSlice.actions;
export const patientReducer = patientSlice.reducer;
