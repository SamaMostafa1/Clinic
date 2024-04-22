/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "./sign-in_module.css";
// import { signDataActions } from '../slices/auth-slice';
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, login } from "../slices/auth-slice";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const errors = useSelector((state: any) => state.authReducer.error);
  const token = useSelector((state: any) => state.authReducer.authToken);
  const userName = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      userName: userName.current?.value,
      password: password.current?.value,
    };
    async function fetchData() {
      if (token) {
        dispatch(getData(token) as any);
      }
    }
    dispatch(login(data) as any).then((res: any) => {
      if (res.payload) {
        fetchData();
      }
      navigate("/doctorSlots")
    });


  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Username</label>
          <input type="text" name="username" ref={userName} />
          {errors.username && <span>{errors.username}</span>}
        </div>
        <div className="form-field">
          <label>Password</label>
          <input type="password" name="password" ref={password} />
          {errors.password && <span>{errors.password}</span>}
        </div>
        <button className="submit-button" type="submit">
          Sign In
        </button>
        <button className="submit-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
