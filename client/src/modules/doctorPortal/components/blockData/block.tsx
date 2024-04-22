/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import classes from "./block.module.css";
import { Patient } from "../../slices/patient-slice";

export const BlockData = ({ patient }: { patient: Patient }) => {
  return (
    <div className={classes.block}>
      {patient ? (
        <>
          <h2>Block Data</h2>
          <ul>
            <li>Name: {patient.name}</li>
            <li>Age: {patient.age} </li>
            <li>Weight: {patient.weight}</li>
            <li>Height: {patient.height} </li>
            <li>Gender: {patient.gender}</li>
            <li>Blood Type: {patient.bloodType} </li>
          </ul>
        </>
      ) : null}
    </div>
  );
};
