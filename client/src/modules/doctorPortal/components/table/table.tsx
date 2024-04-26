/* eslint-disable @typescript-eslint/no-explicit-any */
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";

const TableComponent = ({ schedules }: { schedules: any }) => {
  const navigate = useNavigate();
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Time</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {schedules.map((row: any, rowIndex: number) => (
          <TableRow key={rowIndex}>
            <TableCell>{row.patientFirstName}</TableCell>
            <TableCell>{row.time}</TableCell>
            <TableCell key={`${rowIndex}-column4`}>
              <div
                onClick={() => {
                  if (row.patientId !== undefined) {
                    navigate(`/doctorSlots/patient/${row.patientId}`);
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
