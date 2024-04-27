/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

export default interface Slot {
  _id?: string;
  patientFirstName?: string;
  doctorId?: number;
  patientId?: number;
  weekDay: string;
  time: string | null;
  slotId?: string | undefined;
  loading?: boolean;
}

interface SlotsState {
  slots: Slot[];
  selectedDate: string | null;
  slotsLength: number;
  isVisible: boolean;
  loading?: boolean;
}

const initialStateSlots: SlotsState = {
  slots: [],
  selectedDate: null,
  slotsLength: 0,
  isVisible: false,
  loading: false,
};

export const addSlot = createAsyncThunk(
  "slots/addSlot",
  ({ time, weekDay }: { time: string | null; weekDay: string }, _) => {
    return axios
      .post(
        "http://localhost:3005/slots",
        {
          time,
          weekDay,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

export const getSlots = createAsyncThunk<Slot[], string | void>(
  "slots/getSlots",
  async (data: any) => {
    return axios
      .get(`http://localhost:10000/patient/doctor/${data.parsedId}`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        console.log("res.data", res.data);
        return res.data;
      })
      .catch((err) => {
        console.log(data.token);
        console.log("eeeeeeeeeeeee", err);
      });
  }
);

const slotsSlice = createSlice({
  name: "slots",
  initialState: initialStateSlots,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSlots.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSlots.fulfilled, (state, action) => {
      state.loading = false;
      state.slots = action.payload;
    });
    builder.addCase(getSlots.rejected, (state, action) => {
      console.log("actionnnnnnnn", action);
      state.loading = false;
    });
  },
});

export const slotsReducer = slotsSlice.reducer;
export const slotsActions = slotsSlice.actions;
