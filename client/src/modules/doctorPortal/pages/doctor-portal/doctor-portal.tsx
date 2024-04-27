/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import classes from "./doctor-portal.module.css";
import { BlockData } from "../../components/blockData/block";
import { useParams } from "react-router-dom";
import { HistoryData } from "../../components/historyData/history-data";
import { DiagnosisData } from "../../components/diagnosisData/diagnosisData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPatientData } from "../../slices/patient-slice";
import { Button } from "@mui/material";
import { patientActions } from "../../slices/patient-slice";
import { TestForm } from "../../components/form/form";

const PatientData = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const token = useSelector((state: any) => state.authReducer.accessToken);

  const parsedId = id ? parseInt(id, 10) : undefined;
  const data = {
    parsedId,
    token,
  };
  useEffect(() => {
    async function fetchData() {
      await dispatch(getPatientData(data) as any).then((res: any) => {
        console.log("resssssssss", res.payload);
        dispatch(patientActions.setPatientData(res.payload.data) as any);
      });
    }
    fetchData();
    console.log("parsedId", parsedId);
  }, [dispatch, parsedId]);

  const patients = useSelector((state: any) => state.slotsReducer.slots.data);

  //const [isVisible, setTestsVisibility] = useState(() => {})
  const isVisible = useSelector((state: any) => state.patientReducer.isVisible);
  const patientData = patients.find(
    (patient: any) => patient.userId === parsedId
  );
  const handleClick = () => {
    dispatch(patientActions.setTestsVisibility(!isVisible));
  };
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
          onClick={() => {
            handleClick();
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
      <TestForm isFormVisible={isVisible} />
    </div>
  );
};

export default PatientData;
