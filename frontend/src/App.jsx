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

  const URL = "http://localhost:2000";

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
        {!user && <GoogleLoginButton />}

        {user && (
            <>
                <p>Welcome, {user.name}</p>
                <p>{user.email}</p>
                <Logout />
            </>
        )}

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

        <h1>To-Do App</h1>

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
);
}

export default App;
