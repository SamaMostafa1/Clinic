/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import classes from "./block.module.css";
import { Patient } from "../../slices/patient-slice";
import { useSelector } from "react-redux";

export const BlockData = ({
  patient,
  isTrue,
}: {
  patient: any;
  isTrue: boolean;
}) => {
  const loggedUser = useSelector(
    (state: any) => state.authReducer.loggedInData.data
  );

  return (
    <div className={classes.block} style={{ width: "30%" }}>
      <>
        <h2 className={classes.header}>Patient Data</h2>
        <ul>
          <>
            {loggedUser.role === "Patient" ? (
              <li>Name: {`${patient?.firstName} ${patient?.lastName}`}</li>
            ) : (
              <li>
                Name: {`${patient?.data.firstName} ${patient?.data.lastName}`}
              </li>
            )}
            {/* <li>Weight: {`${patient.weight}`}</li>
              <li>Height: {`${patient.length}`}</li> */}
          </>
        </ul>
      </>
    </div>
  );
};
