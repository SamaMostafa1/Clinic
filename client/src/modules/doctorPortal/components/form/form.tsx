/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Form } from "react-router-dom";
import { patientActions } from "../../slices/patient-slice";
import { patientReducer } from "../../slices/patient-slice";
import { Label } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import classes from "./form.module.css";
import { useState } from "react";

export const TestForm: React.FC<{ isFormVisible: boolean }> = ({
  isFormVisible,
}) => {
  const dispatch = useDispatch();
  const [selectedTest, setSelectedTest] = useState<string[]>([]);
  const [testText, setTestText] = useState("");

  const handleSubmit = () => {
    console.log("donee");
    console.log(selectedTest);
    console.log(testText);
    dispatch(patientActions.setNeededTests(selectedTest));
  };
  return (
    <>
      {isFormVisible ? (
        <div className={classes.divForm}>
          <FormControl sx={{ width: "390px", height: "250px" }}>
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
            <h2
              style={{ marginTop: "0px", marginLeft: "5px", fontSize: "24px" }}
            >
              Test Form
            </h2>
            <div style={{ marginLeft: "17px" }}>
              <label id="demo-simple-select-label">Select Test</label>
              <Select
                multiple
                sx={{ width: "90%" }}
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value as string[])}
                renderValue={(selected) => (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {(selected as string[]).map((value) => (
                      <div
                        key={value}
                        style={{
                          margin: "2px",
                          backgroundColor: "gray",
                          borderRadius: "5px",
                        }}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                )}
              >
                <MenuItem value="Test 1">Test 1</MenuItem>
                <MenuItem value="Test 2">Test 2</MenuItem>
                <MenuItem value="Test 3">Test 3</MenuItem>
              </Select>
            </div>
            {/* <div>
              <label style={{ marginTop: "10px", marginLeft: "17px" }}>
                Write Test
              </label>
              <TextField
                style={{ marginLeft: "17px", width: "90%" }}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
              >
                {" "}
              </TextField>
            </div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                alignContent: "center",
              }}
            >
              <Button
                sx={{
                  width: "50%",
                  backgroundColor: "#C7C7C7",
                  color: "black",
                  border: "1px solid ",
                  mt: "15px",
                }}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {" "}
                S<span style={{ textTransform: "lowercase" }}>ave </span>
              </Button>
            </div>
          </FormControl>
        </div>
      ) : null}
    </>
  );
};
