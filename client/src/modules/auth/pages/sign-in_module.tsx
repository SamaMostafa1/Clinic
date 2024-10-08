/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "./sign-in_module.css";
// import { signDataActions } from '../slices/auth-slice';
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn, login } from "../slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { signDataActions } from "../slices/auth-slice";
import { getSlots } from "../../doctorPortal/slices/doctor-slots-slice";
import { CircularProgress } from "@mui/material";

const SignInPage = () => {
  const errors = useSelector((state: any) => state.authReducer.error);
  //  const load = useSelector((state: any) => state.authReducer.loading);
  // const token = useSelector((state: any) => state.authReducer.user.accessToken);
  const userName = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInRole = useSelector((state: any) => {
    // state.authReducer.loggedInData.data["role"];
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      userName: userName.current?.value,
      password: password.current?.value,
    };

    dispatch(login(data) as any).then((res: any) => {
      // if (res.payload) {

      //   fetchData();
      // }
      // fetchData();
      const token = res.payload.accessToken;

      dispatch(signDataActions.setToken(token));
      if (token) {
        console.log("tokenDispatch", res.payload.accessToken);
        dispatch(loggedIn(token) as any).then((res: any) => {
          console.log("resssbb", res.payload.data["role"]);
          if (res.payload.data["role"] === "Patient") {
            navigate(`/patient/${res.payload.data["userId"]}`);
          } else {
             navigate(`/doctorSlots/${res.payload.data.userId}`);
          }
        });
      }
    });
  };

  return (
    <>
      <div className="background">
        <div className="sign-in-container">
          <form onSubmit={handleSubmit}>
            <h2>Login/Sign Up</h2>
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                ref={userName}
                style={{ width: "400px" }}
              />
              {errors.username && <span>{errors.username}</span>}
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                ref={password}
                style={{ width: "400px" }}
              />
              {errors.password && <span>{errors.password}</span>}
            </div>
            <div style={{ display: "flex" }}>
              <button
                className="submit-button"
                type="submit"
                style={{ marginRight: "5px" }}
              >
                Sign In
              </button>
              <button className="submit-button" type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
