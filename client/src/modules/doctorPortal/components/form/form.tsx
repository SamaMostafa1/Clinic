/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { patientActions } from "../../slices/patient-slice";
import { patientReducer } from "../../slices/patient-slice";
export const TestForm: React.FC<{ isFormVisible: boolean }> = ({ isFormVisible }) => {
    return (
        <div>
            {isFormVisible ? (
                <form>
                    <label>
                        Test Name
                        <select name="name">
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </label>
                </form>
            ) : null}
        </div>
    );
};
  
