/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import classes from "../blockData/block.module.css";
export const HistoryData = ({
  id,
  data,
}: {
  id: string | undefined;
  data: any;
}) => {
  const loggedUser = useSelector(
    (state: any) => state.authReducer.loggedInData.data
  );
  let dataArray = [];
  if (loggedUser.role === "Patient") {
    dataArray = Object.values(data);
  } else {
    dataArray = data?.diagnosis;
    console.log(dataArray);
  }

  return (
    <div className={`${classes.block} ${classes["block-no-margin"]}`}>
      <h2 className={classes.header}>History Data</h2>
      <div style={{ display: "flex" }}>
        {dataArray && dataArray.length > 0 && (
          <>
            <div
              style={{
                border: "2px solid ",
                padding: "5px",
                borderRadius: "5px",
                width: "30%",
              }}
            >
              <h3 style={{ fontWeight: "500", margin: "0px" }}> Illnesses</h3>
              <ul style={{ margin: "0" }}>
                {dataArray.map((item: any, index: number) => (
                  <li
                    key={index}
                    style={{ color: "black", margin: "0px", padding: "0px" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
