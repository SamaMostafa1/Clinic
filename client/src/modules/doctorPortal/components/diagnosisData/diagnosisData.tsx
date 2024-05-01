import classes from "../blockData/block.module.css";
export const DiagnosisData = ({ id }: { id: string | undefined }) => {
  return (
    <div className={classes.block3}>
      <h2 className={classes.header}> Diagnosis Data</h2>
     {/* // <h2>{id}</h2> */}
    </div>
  );
};
