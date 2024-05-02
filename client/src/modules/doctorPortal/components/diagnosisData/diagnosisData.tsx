import { TextField } from "@mui/material";
import classes from "../blockData/block.module.css";
import styles from "./diagnosisData.module.css";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
export const DiagnosisData = ({ id }: { id: string | undefined }) => {
  return (
    <div className={classes.block3}>
      <h2 className={classes.header}> Diagnosis Data</h2>
      <div className={styles.text}>
        <TextField ></TextField>
        <AddCircleIcon
          sx={{
            marginLeft: "7px",
          }}
        />
      </div>
      {/* // <h2>{id}</h2> */}
    </div>
  );
};
