import React from "react";

const Logout = () => {
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <button className="logout-button" onClick={logout}>
            Logout
        </button>
    );
};

export default Logout;