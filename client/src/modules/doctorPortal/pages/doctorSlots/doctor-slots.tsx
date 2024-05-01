import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/table/table";
import { getSlots } from "../../slices/doctor-slots-slice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const DoctorSlots = () => {
  const { id } = useParams();
  const parsedId = id ? parseInt(id, 10) : undefined;
  const slots = useSelector((state: any) => state.slotsReducer.slots.data);
  console.log("slots", slots);
  const token = useSelector((state: any) => state.authReducer.user.accessToken);
  const dispatch = useDispatch();
  const data: any = {
    parsedId,
    token,
  };
  const load = useSelector((state: any) => state.slotsReducer.loading);

  useEffect(() => {
    const fetchData = async () => {
      console.log("tokennnnn", token);
      await dispatch(getSlots(data) as any);
    };
    fetchData();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor:"",
        background: "linear-gradient(285.17deg, #a8bebe 10.66%, #dcdcdc 102.7%)",
        height:"100vh"
      }}
    >
      {load ? <CircularProgress /> : <TableComponent schedules={slots} />}
    </div>
  );
};

export default DoctorSlots;
