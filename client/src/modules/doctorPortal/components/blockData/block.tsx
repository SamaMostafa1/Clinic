/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import classes from "./block.module.css";
import { Patient } from "../../slices/patient-slice";

export const BlockData = ({ patient }: { patient: any }) => {
  return (
    <div className={classes.block}>
      {
        <>
          <h2 className={classes.header}>Block Data</h2>
          <ul>
            <li>Name: {`${patient?.firstName} ${patient?.lastName}`}</li>
            {/* <li>Age: 65 </li>
            <li>Weight: 70</li>
            <li>Height: 170</li>
            <li>Gender: male</li>
            <li>Blood Type: A-</li> */}
          </ul>
        </>
      }
    </div>
  );
};
