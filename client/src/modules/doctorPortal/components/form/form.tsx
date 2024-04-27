/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Form } from "react-router-dom";
import { patientActions } from "../../slices/patient-slice";
import { patientReducer } from "../../slices/patient-slice";
import { Label } from "@mui/icons-material";
import { FormControl, InputLabel, Menu, MenuItem, Select, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";

export const TestForm: React.FC<{ isFormVisible: boolean }> = ({
  isFormVisible,
}) => {
    const dispatch = useDispatch();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "2",
        border: "1px solid black",
        backgroundColor: "white",
        borderRadius: "5px",
      }}
    >
      {isFormVisible ? (
        <FormControl sx={{ width: "390px", height: "300px" }}>
            <CloseIcon
                style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    cursor: "pointer",
                }}
                onClick={() => {
                    dispatch(patientActions.setTestsVisibility(false));
                }}
            ></CloseIcon>
          <h2 style={{ marginTop: "0px", marginLeft: "5px", fontSize:"24px" }}>Test Form</h2>
          <div style={{marginLeft:"17px", width:"100%"}}>
            <label id="demo-simple-select-label" >Select Test</label>
            <Select sx={{width:"90%"}}>
              <MenuItem value="test1">Test 1</MenuItem>
              <MenuItem value="test2">Test 2</MenuItem>
              <MenuItem value="test3">Test 3</MenuItem>
            </Select>
            </div>
            <div>
            <label style={{marginTop:"10px", marginLeft:"17px"}}>Write Test</label>
            <TextField style={{marginLeft:"17px", width:"90%"}}> </TextField>
            </div>
        </FormControl>
      ) : null}
    </div>
  );
};
