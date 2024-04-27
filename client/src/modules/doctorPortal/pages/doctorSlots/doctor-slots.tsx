/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/table/table";
import { getSlots } from "../../slices/doctor-slots-slice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

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
  useEffect(() => {
    const fetchData = async () => {
      console.log("tokennnnn", token);
      await dispatch(getSlots(data) as any);
    };
    fetchData();
  }, []);
  return <TableComponent schedules={slots} />;
};

export default DoctorSlots;
