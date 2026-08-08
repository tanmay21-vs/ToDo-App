import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";

const AddTasks = ({ reload, URL, setReload, id, setId, tasks }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      for (let i = 0; i < tasks.length; i++) {
        if (id === tasks[i]._id) {
          setName(tasks[i].name);
          setDescription(tasks[i].description);
          break;
        }
      }
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(name, description);

    //send data to api
    let api;
    if (id) {
      api = await axios.put(
        `${URL}/${id}`,
        { name, description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );


    } else {
      api = await axios.post(
        `${URL}/`,
        { name, description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

    }


    setReload(!reload);
    setName("");
    setDescription("");
    setId("");
    
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
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Enter Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">{id ? "Edit Task" : "Add Task"}</button>
      </form>
    </div>
  );
};

export default AddTasks;
