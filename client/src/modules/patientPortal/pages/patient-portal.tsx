import { BlockData } from "../../doctorPortal/components/blockData/block";
import { DiagnosisData } from "../../doctorPortal/components/diagnosisData/diagnosisData";
import { HistoryData } from "../../doctorPortal/components/historyData/history-data";
import classes from "../../doctorPortal/pages/doctor-portal/doctor-portal.module.css";
import styles from "./patient-portal.module.css";
export const PatientPortal = () => {
  return (
    <>
      <div className={styles.backgroundImage}>
        <div className={classes.pageContainer}>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              fontSize: "24px",
              color: "white",
            }}
          >
            <h2>Your Data</h2>
          </div>
          <div className={classes.flexContainer}>
            <BlockData patient={""} />
            <HistoryData id="" />
          </div>
          <div>
            <DiagnosisData id="" />
          </div>
        </div>
      </div>
    </>
  );
};
