import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <>
    <div className="signup-modal">
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-box" onSubmit={handleSubmit}>
        <ul className="errors-container">
          {errors.map((error, idx) => (
            <li className="error-list" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          <input
            type="text"
            className="datasignup"
            value={email}
            placeholder=" Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            className="datasignup"
            value={username}
            placeholder=" Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            className="datasignup"
            value={firstName}
            placeholder=" First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            className="datasignup"
            value={lastName}
            placeholder=" Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            className="datasignup"
            value={password}
            placeholder=" Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            className="datasignup"
            placeholder=" Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="modal-button" type="submit">Sign Up</button>
      </form>
    </div>
    </>
  );
}

export default SignupFormModal;
