import SignInPage from "./modules/auth/pages/sign-in_module";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DoctorSlot from "./modules/doctorPortal/pages/doctorSlots/doctor-slots";
import  PatientData  from "./modules/doctorPortal/pages/doctor-portal/doctor-portal";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" Component={SignInPage} />
          <Route path="/doctorSlots/:id" Component={DoctorSlot} />
          <Route path="/doctorSlots/patients/:id" Component={PatientData} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
