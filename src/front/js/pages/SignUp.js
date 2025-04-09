import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const complete_sign_up = async () => {
        if (password !== verifyPassword) {
            setMsg("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${process.env.BACKEND_URL}api/sign_up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const data = await response.json();

            if (data.msg) {
                setMsg(data.msg);
            } else {
                setMsg("Sign up was successful!");
                alert("Sign up successful, please log in.");
                navigate("/login");
            }
        } catch (error) {
            setMsg("An error has occurred. Please try again.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        complete_sign_up();
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="row">
                <div className="col-12">
                    <div className="card-body">
                        <h3 className="text-center">Sign up!</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="label mb-2">
                                <label htmlFor="emailInput">Email</label>
                                <input type="email" className="form-control"
                                    id="emailInput" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="label mb-2">
                                <label htmlFor="passwordInput" className="form-label">Password</label>
                                <input type="password"
                                    className="form-control"
                                    id="passwordInput"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </div>
                            <div className="label mb-2">
                                <label htmlFor="verifyPassword" className="form-label">Verify Password</label>
                                <input type="password"
                                    className="form-control"
                                    id="verifyPassword"
                                    value={verifyPassword}
                                    onChange={(e) => setVerifyPassword(e.target.value)}
                                    required />
                            </div>
                            <button type="submit" className="btn btn-primary mt-3 w-100">
                                Sign Up!
                            </button>
                        </form>
                        <div className="text-center">
                            {msg && <p>{msg}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}