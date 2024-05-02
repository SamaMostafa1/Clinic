import { TextField } from "@mui/material";
import classes from "../blockData/block.module.css";
import styles from "./diagnosisData.module.css";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { patientActions, postText } from "../../slices/patient-slice";
export const DiagnosisData = ({ id }: { id: string | undefined }) => {
  const [text, setText] = useState(" ");
  const dispatch = useDispatch();
  const handleClick = async () => {
    dispatch(patientActions.setText(text));
    try {
      await dispatch(postText(text) as any);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className={classes.block3}>
      <h2 className={classes.header}> Diagnosis Data</h2>
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
          <AddCircleIcon
            sx={{
              marginLeft: "7px",
            }}
          />
        </div>
      </div>
      {/* // <h2>{id}</h2> */}
    </div>
  );
};
