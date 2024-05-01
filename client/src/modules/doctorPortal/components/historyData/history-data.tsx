/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import classes from "../blockData/block.module.css";
export const HistoryData = ({ id }: { id: string | undefined }) => {
  return (
    <div className={`${classes.block} ${classes["block-no-margin"]}`}>
      <h2 className={classes.header}>History Data</h2>
      <h2>{id}</h2>
    </div>
  );
};
