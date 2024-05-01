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
import { patientReducer } from "../../slices/patient-slice";
import { TestForm } from "../../components/form/form";
import { PrescriptionForm } from "../../components/prescriptionForm/prescriptionForm";
import styles from "../../../patientPortal/pages/patient-portal.module.css";
const PatientData = () => {
  const dispatch = useDispatch();
  const formTest = 1;
  const prescriptionForm = 2;
  const { id } = useParams();
  const token = useSelector((state: any) => state.authReducer.accessToken);
  const testData = useSelector((state: any) => state.patientReducer.neededTest);
  const prescriptionData = useSelector(
    (state: any) => state.patientReducer.prescriptionData
  );

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
  const isFormTestsVisible = useSelector(
    (state: any) => state.patientReducer.isFormTestsVisible
  );
  const isPrescriptionVisible = useSelector(
    (state: any) => state.patientReducer.isPrescriptionVisible
  );
  const patientData = patients.find(
    (patient: any) => patient.userId === parsedId
  );
  const handleClick = (form: number) => {
    if (form === formTest)
      dispatch(patientActions.setTestsVisibility(!isFormTestsVisible));
    else {
      dispatch(patientActions.setFormPrescrition(!isPrescriptionVisible));
    }
  };
  return (
    <div className={styles.backgroundImage}>
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
          <div
            style={{ display: "flex", flexDirection: "column", width: "50%" }}
          >
            <Button
              sx={{
                mt: 2,
                backgroundColor: "#4a6588",
                color: "white",
                fontSize: "20px",
                fontWeight: "500",
                fontFamily: "sans-serif",
                border: "2px solid",
                borderColor: "black",
                mr: "10px",
              }}
              onClick={() => {
                handleClick(formTest);
              }}
            >
              T<span style={{ textTransform: "lowercase" }}>ests</span>
            </Button>
            <div style={{ display: "flex" }}>
              {testData[0] ? (
                <div
                  style={{
                    backgroundColor: "rgb(239 239 239)",
                    marginRight: "9px",
                    width: "100%",
                  }}
                >
                  {testData.map((test: any, index: number) => (
                    <div key={index}>{test}</div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "50%" }}
          >
            <Button
              sx={{
                mt: 2,
                backgroundColor: "#4a6588",
                color: "white",
                fontSize: "20px",
                fontWeight: "500",
                fontFamily: "sans-serif",
                border: "2px solid",
                borderColor: "black",
              }}
              onClick={() => {
                handleClick(prescriptionForm);
              }}
            >
              P<span style={{ textTransform: "lowercase" }}>rescription</span>
            </Button>
            <div
              style={{
                backgroundColor: "rgb(239 239 239)",
                width: "100%",
              }}
            >
              {prescriptionData["drugName"] ? (
                <div>
                  <h3 style={{ fontWeight: "600", margin: "0px" }}>
                    {prescriptionData["drugName"]}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {prescriptionData["drugDose"]}
                  </div>
                  <div>{prescriptionData["drugTime"]}</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {isFormTestsVisible ? (
          <>
            <TestForm isFormVisible={isFormTestsVisible} />
          </>
        ) : null}
        {isPrescriptionVisible ? (
          <>
            <PrescriptionForm isPrescriptionVisible={isPrescriptionVisible} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PatientData;
