import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";

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
  text: object;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string;
  isFormTestsVisible?: boolean;
  isPrescriptionVisible?: boolean;
  neededTest: string[];
  prescriptionData: object;
  text: object;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: "",
  isFormTestsVisible: false,
  neededTest: [],
  prescriptionData: {},
  text: {},
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
      .get(`http://localhost:10000/EMR/patient/${data}/medicalHistory`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

export const postText = createAsyncThunk(
  "patients/postText",
  async (requestData: object, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:10000/hl7Route/",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("daaaaaaaa", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// export const getPatientHistory = createAsyncThunk(
//   "patients/getPatientHistory",
//   async (data: object, thunkAPI) => {
//     try {
//       const response = await axios.get(
//         "http://localhost:10000/hl7Route/",
//         data,
//       );
//       console.log("daaaaaaaa", response.data);
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

export const getPatientHistory = createAsyncThunk(
  "patients/getPatientHistory",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:10000/hl7Route/${data.parsedId}`
      );

      console.log("daaaaaaaa", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
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
    setText(state, action: PayloadAction<object>) {
      state.text = action.payload;
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
    builder.addCase(getDataRecord.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDataRecord.fulfilled, (state, action) => {
      state.patients.push(action.payload);
      state.loading = false;
      console.log("recordddd", action.payload);
    });
    builder.addCase(postText.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postText.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getPatientHistory.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPatientHistory.fulfilled, (state, action) => {
      state.loading = false;
      console.log("gggggggggggggg", action.payload.data);
      state.patients.push(...state.patients, action.payload.data);
    });
  },
});

export const patientActions = patientSlice.actions;
export const patientReducer = patientSlice.reducer;
