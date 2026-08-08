import React from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Tasks = ({ tasks, URL, reload, setReload, id, setId}) => {
  const deleteTask = async (id) => {
    const api = await axios.delete(
      `${URL}/${id}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("deleted Data", api);

    
    setReload(!reload);


toast.success(api.data.message, {
position: "top-right",
autoClose: 2000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
});


  };


  return (
    <div className="tasks">
      {tasks.map((task) => (
        <div key={task._id} className="task">
          <div>
            <h3 className="task-name ">{task.name}</h3>
            <p className="task-description">{task.description}</p>
            <p className="task-time">
              {new Date(task.createdTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          <div className="task-buttons ">
            <button className="task-button" onClick={() => setId(task._id)}>Edit</button>
            <button
              className="task-button"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
