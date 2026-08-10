import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import GoogleLoginButton from "./GoogleLogin";
import Tasks from "./Tasks";
import AddTasks from "./AddTasks";
import "./App.css";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Logout from "./Logout";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState("");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const URL = "https://todo-app-0l64.onrender.com";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
        return;
    }
    const fetchData = async () => {
      const api = await axios.get(`${URL}/`, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });

      console.log(api.data.tasks);
      setTasks(api.data.tasks);
    };
    fetchData();
  }, [reload]);

  console.log("Getting id for edit", id);

return (
    <div>

<ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
/>

<div className="app-layout">
    <div className="main-content">
        <h1>To-Do App</h1>

        {!user && (
            <div className="google-login">
                <GoogleLoginButton />
            </div>
        )}

        {user && (
            <>
                <AddTasks
                    tasks={tasks}
                    URL={URL}
                    reload={reload}
                    setReload={setReload}
                    id={id}
                    setId={setId}
                />

                <Tasks
                    tasks={tasks}
                    URL={URL}
                    reload={reload}
                    setReload={setReload}
                    id={id}
                    setId={setId}
                />
            </>
        )}
    </div>

    {user && (
        <div className="user-section">
            <div className="user-info">
                <span className="user-name">Welcome, {user.name}</span>
                <span className="user-email">{user.email}</span>
            </div>

            <Logout />
        </div>
    )}
</div>
</div>

);
}

export default App;
