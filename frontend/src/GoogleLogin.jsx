import React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
    const handleSuccess = async (credentialResponse) => {
        try {
            const api = await axios.post(
                "https://todo-app-0l64.onrender.com/auth/google",
                {
                    credential: credentialResponse.credential,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            localStorage.setItem("token", api.data.token);
            localStorage.setItem("user", JSON.stringify(api.data.user));

            window.location.reload();

            console.log("Login response:", api.data);
        } catch (error) {
            console.log("Login error:", error);
        }
    };

    const handleError = () => {
        console.log("Google Login Failed");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
};

export default GoogleLoginButton;