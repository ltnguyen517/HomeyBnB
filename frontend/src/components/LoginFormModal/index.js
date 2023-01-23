import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <>
      <div className="login-modal">
        <h1 className="login-text">Log In</h1>
        <form className="login-modal-container" onSubmit={handleSubmit}>
          <ul className="errors-container">
            {errors.map((error, idx) => (
              <li className="error-list" key={idx}>{error}</li>
            ))}
          </ul>
          <label>
            Username or Email
            <input
              className="data"
              type="text"
              placeholder="Username or Email"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              className="data"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="login-button" type="submit">Log In</button>
          <button
            className="login-button"
            type="submit"
            onClick={() => {
              setCredential('Demo-lition');
              setPassword('password');
            }}
          >
            Demo User
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
