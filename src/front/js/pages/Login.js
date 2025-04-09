import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
 
    const complete_login = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.BACKEND_URL}api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),

            });
            if (!response.ok) {
                const error = await response.json();
                setMsg(error.message || "Login failed");
                return ;
            }
            const data = await response.json();

            localStorage.setItem("token", data.access_token);
            actions.login(data.access_token);
            localStorage.setItem("user_id", data.user_id);

            setMsg("Login successful");
            navigate("/");
        } catch (error) {
            console.error(error);
            setMsg("An error has occured. Please try again.");
        }
    };
    return (
        <div className="container d-flex justify-content-center">
            <div className="row">
                <div className="col-12">
                    <div className="card-body">
                        <h2 className="text-center">Login!</h2>
                        <form onSubmit={complete_login}>
                            <div className="label mb-2">
                                <label htmlFor="emailInput">Email</label>
                                <input type="email" className="form-control"
                                id="emailInput" value={email}
                                onChange={(e) => setEmail(e.target.value)} required />

                            </div>
                            <div className="label mb-2">
                                <label htmlFor="emailInput">Password</label>
                                <input type="password" className="form-control"
                                id="passwordInput" value={password}
                                onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary mt-4 w-100">
                                Login
                            </button>
                            <Link to="/sign_up">
                                <h5>Click to create an account!</h5>
                            </Link>
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
