import { TextField } from "@mui/material";
import classes from "../blockData/block.module.css";
import styles from "./diagnosisData.module.css";
import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patientActions, postText } from "../../slices/patient-slice";
export const DiagnosisData = ({ id }: { id: number | undefined }) => {
  const [text, setText] = useState(" ");
  const dispatch = useDispatch();
  const data = {
    diagnosis: text,
    userId: id,
  };
  const loggedRole = useSelector(
    (state: any) => state.authReducer.loggedInData.data.role
  );
  const handleClick = async () => {
    dispatch(patientActions.setText(data));
    try {
      await dispatch(postText(data) as any);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className={classes.block3}>
      <h2 className={classes.header}> Diagnosis Data</h2>
      {loggedRole === "Doctor" && (
        <div className={styles.text}>
          <TextField
            inputProps={{ style: { height: "130px" } }}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />

          <div
            onClick={() => {
              handleClick();
            }}
          >
            <AddBoxIcon
              sx={{
                marginLeft: "7px",
              }}
            />
          </div>
        </div>
      )}
      {/* // <h2>{id}</h2> */}
    </div>
  );
};
