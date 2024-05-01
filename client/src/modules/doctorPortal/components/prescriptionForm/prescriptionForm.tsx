import { Button, FormControl, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { patientActions, patientReducer } from "../../slices/patient-slice";
import { useDispatch, useSelector } from "react-redux";
import classes from "../form/form.module.css";
import { useState } from "react";

export const PrescriptionForm = ({
  isPrescriptionVisible,
}: {
  isPrescriptionVisible: boolean;
}) => {
  const dispatch = useDispatch();
  const prescriptionData = useSelector((state: any) => {
    state.patientReducer.prescriptionData;
  });
  const [drugName, setDrugName] = useState("");
  const [drugDose, setDrugDose] = useState("");
  const [drugTime, setDrugTime] = useState("");
  const [drugNote, setDrugNote] = useState("");
  const handleSubmit = () => {
    const data = {
      drugName: drugName,
      drugDose: drugDose,
      drugTime: drugTime,
      drugNote: drugNote,
    };
    dispatch(patientActions.setPrescriptionData(data));
  };
  return (
    <div className={classes.divForm}>
      {isPrescriptionVisible ? (
        <FormControl sx={{ width: "390px", height: "100%" }}>
          <CloseIcon
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(patientActions.setFormPrescrition(false));
            }}
          ></CloseIcon>
          <h2 style={{ marginTop: "0px", marginLeft: "5px", fontSize: "24px" }}>
            Prescription Form
          </h2>
          <div
            style={{
              marginLeft: "15px",
              display: "flex",
              flexDirection: "column",
              width: "90%",
            }}
          >
            <label style={{ marginTop: "5px", marginLeft: "10px" }}>
              {" "}
              Drug Name
            </label>
            <TextField
              onChange={(e) => {
                setDrugName(e.target.value);
              }}
            ></TextField>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "5px",
              marginLeft: "15px",
              width: "90%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label style={{ marginLeft: "10px", marginRight: "5px" }}>
                Dose
              </label>
              <TextField
                onChange={(e) => {
                  setDrugDose(e.target.value);
                }}
              >
                {"  "}
              </TextField>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "10px",
              }}
            >
              <label style={{ marginRight: "5px" }}>Time</label>
              <TextField
                onChange={(e) => {
                  setDrugTime(e.target.value);
                }}
              >
                {"  "}
              </TextField>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "15px",
              width: "90%",
            }}
          >
            <label style={{ marginRight: "5px" }}>Notes</label>
            <TextField
              inputProps={{ style: { height: "100px" } }}
              onChange={(e) => {
                setDrugNote(e.target.value);
              }}
            >
              {"  "}
            </TextField>
          </div>
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
                mt: "5px",
                mb: "8px",
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
      ) : null}
    </div>
  );
};
