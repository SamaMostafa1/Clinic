import SignInPage from "./modules/auth/pages/sign-in_module";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DoctorSlot from "./modules/doctorPortal/pages/doctorSlots/doctor-slots";
import PatientData from "./modules/doctorPortal/pages/doctor-portal/doctor-portal";
import { PatientPortal } from "./modules/patientPortal/pages/patient-portal";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" Component={SignInPage} />
          <Route path="/doctorSlots/:id" Component={DoctorSlot} />
          <Route path="/doctorSlots/patients/:id" Component={PatientData} />
          <Route path="/Patient" Component={PatientPortal} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
