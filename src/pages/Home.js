import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import { ModalContextProvider  } from "../context/ModalContext";


function Home() {
  const [tasks, setTasks] = useState(null);
  const [open, setOpen] = useState(false);
  const getTaskData = async () => {
    try {
      const response = await axios.get("http://localhost:3002/tasks");
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data);
    }
  };
  useEffect(() => {
    getTaskData();
  }, []);


  return (
    <div>
      <ModalContextProvider>
      <Navbar />
      <TaskList tasks={tasks} />
      
      <TaskModal open={open} setOpen={setOpen} />
      </ModalContextProvider>

    </div>
  );
}

export default Home;
