import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../../modules/auth/slices/auth-slice";
import { slotsReducer } from "../../modules/doctorPortal/slices/doctor-slots-slice";
import { patientReducer } from "../../modules/doctorPortal/slices/patient-slice";

const store = configureStore({
  reducer: {
    authReducer,
    slotsReducer,
    patientReducer,
  },
});

export default store;
