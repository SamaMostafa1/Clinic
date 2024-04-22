/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/table/table";
import { getSlots } from "../../slices/doctor-slots-slice";
import { useEffect } from "react";

const DoctorSlots = () => {
  const slots = useSelector((state: any) => state.slotsReducer.slots);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getSlots() as any);
    };
    fetchData();
  }, []);
  return <TableComponent schedules={slots} />;
};

export default DoctorSlots;
