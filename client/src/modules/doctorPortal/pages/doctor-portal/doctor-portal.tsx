/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import classes from "./doctor-portal.module.css";
import { BlockData } from "../../components/blockData/block";
import { useParams } from "react-router-dom";
import { HistoryData } from "../../components/historyData/history-data";
import { DiagnosisData } from "../../components/diagnosisData/diagnosisData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPatientData } from "../../slices/patient-slice";
import { Button } from "@mui/material";

const PatientData = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const parsedId = id ? parseInt(id, 10) : undefined;
  useEffect(() => {
    async function fetchData() {
      await dispatch(getPatientData(parsedId) as any);
    }
    fetchData();
  });

  const patients = useSelector((state: any) => state.patientReducer.patients);
  const patientData = patients.find((patient: any) => patient.id === parsedId);

  return (
    <div className={classes.pageContainer}>
      <div className={classes.flexContainer}>
        {parsedId ? (
          <>

              <BlockData patient={patientData} />
              <HistoryData id={id} />

          </>
        ) : null}
      </div>
      <div>{parsedId ? <DiagnosisData id={id} /> : null}</div>
      <div className={classes.flexContainer}>
        <Button
          sx={{
            mt: 2,
            backgroundColor: "#C6C6C6",
            color: "black",
            width: "50%",
            marginRight: 2,
            fontSize: "20px",
            fontFamily: "sans-serif",
          }}
        >
          T<span style={{ textTransform: "lowercase" }}>ests</span>
        </Button>
        <Button
          sx={{
            mt: 2,
            backgroundColor: "#C6C6C6",
            color: "black",
            width: "50%",
            fontSize: "20px",
            fontFamily: "sans-serif",
          }}
        >
          P<span style={{ textTransform: "lowercase" }}>rescription</span>
        </Button>
      </div>
    </div>
  );
};

export default PatientData;
