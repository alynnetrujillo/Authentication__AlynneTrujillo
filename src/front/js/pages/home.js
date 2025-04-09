import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const token = localStorage.getItem("token");
	const [ user, setUser ] = useState();
	
	const navigate = useNavigate();
	
	const userLogOut = () => {
		actions.logout();
		navigate("/login");
	};

	useEffect(() => {
		if(!token) {
			navigate("/login", { replace: true });
		};
	}, [token, navigate])


	return (
		<div className="container d-flex justify-content-center">
			<div className="row">
				<h2>Welcome</h2>
				<button className="btn btn-primary"
					onClick={() => {
						userLogOut();
					}}>
					Logout
				</button>
			</div>
		</div>
	);
};
