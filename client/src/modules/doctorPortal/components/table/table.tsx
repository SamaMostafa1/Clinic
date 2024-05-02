/* eslint-disable @typescript-eslint/no-explicit-any */
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";
import styles from "./table.module.css";
import classes from "../../../patientPortal/pages/patient-portal.module.css";
import { Collapse } from "@mui/material";
const TableComponent = ({ schedules }: { schedules: any }) => {
  const navigate = useNavigate();
  return (
    <Table
      sx={{
        border: "2px solid",
        borderRadius: "15px",
        overflow: "hidden",
        borderCollapse: "separate",
        borderSpacing: "revert",
      }}
    >
      <TableHead sx={{ border: "2px solid", borderRadius: "15px" }}>
        <TableRow>
          <TableCell
            sx={{
              backgroundColor: "#4a6588",
              fontSize: "20px",
              fontWeight: "500",
              color: "white",
            }}
          >
            Name
          </TableCell>
          <TableCell
            sx={{
              backgroundColor: "#4a6588",
              fontSize: "20px",
              fontWeight: "500",
              color: "white",
            }}
          >
            Time
          </TableCell>
          <TableCell sx={{ backgroundColor: "#4a6588" }}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {schedules &&
          schedules.map((row: any, rowIndex: number) => (
            <TableRow
              key={rowIndex}
              sx={{
                backgroundColor: rowIndex % 2 === 0 ? "white" : "#ebebeb",
              }}
            >
              <TableCell
                sx={{ fontSize: "15px" }}
              >{`${row.firstName} ${row.lastName}`}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell key={`${rowIndex}-column3`}>
                <div
                  onClick={() => {
                    if (row.userId !== undefined) {
                      navigate(`/doctorSlots/patients/${row.userId}`);
                    }
                  }}
                  style={{ justifyContent: "center", display: "flex" }}
                >
                  <PreviewIcon style={{ width: "38px", height: "38px" }} />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
