import { useParams } from "react-router-dom";
import { BlockData } from "../../doctorPortal/components/blockData/block";
import { DiagnosisData } from "../../doctorPortal/components/diagnosisData/diagnosisData";
import { HistoryData } from "../../doctorPortal/components/historyData/history-data";
import classes from "../../doctorPortal/pages/doctor-portal/doctor-portal.module.css";
import styles from "./patient-portal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authReducer } from "../../auth/slices/auth-slice";
import {
  getDataRecord,
  getPatientData,
  patientActions,
} from "../../doctorPortal/slices/patient-slice";
import { CircularProgress } from "@mui/material";

export const PatientPortal = () => {
  const { id } = useParams();
  const parsedId = id ? parseInt(id, 10) : undefined;
  const dispatch = useDispatch();
  // const token = useSelector((state: any) => state.authReducer.accessToken);
  const dataLogged = useSelector(
    (state: any) => state.authReducer.loggedInData.data
  );
  const patientRecord = useSelector(
    (state: any) => state.patientReducer.patients
  );

  const records = patientRecord[0]?.records[0];
  const patient = { ...dataLogged, ...records };
  const history = patientRecord[0]?.illnesses;

  const historyData = { ...history };
  console.log("paaaggggga", historyData);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getDataRecord(parsedId) as any).then((res: any) => {
        // dataLogged = { ...dataLogged + res.payload };
      });
    };
    fetchData();
  }, []);

  const patientData = useSelector(
    (state: any) => state.patientReducer.patients
  );
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
          {historyData[0] ? (
            <div style={{ height: "100vh" }}>
              <div className={classes.flexContainer}>
                <BlockData patient={patient} isTrue={true} />
                <HistoryData id={id} data={historyData} />
              </div>
              <div>
                <DiagnosisData id={parsedId} />
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                backgroundColor: "",
                background:
                  "linear-gradient(285.17deg, #a8bebe 10.66%, #dcdcdc 102.7%)",
                height: "100vh",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
