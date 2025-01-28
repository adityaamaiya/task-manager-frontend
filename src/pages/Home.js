import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import { ModalContextProvider } from "../context/ModalContext";
import { Snackbar } from "@mui/material";
import { API_URL } from "../config";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const getTaskData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      if (response.status === 200) {
      setTasks(response.data);
      setLoading(false);
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data);
      setErrorMessage("Error fetching tasks. Please try again later.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTaskData();
  }, []);

  return (
    <div>
      <ModalContextProvider>
        <Navbar />
        {loading ? (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h2>Loading Tasks...</h2>
          </div>
        ) : (
          <TaskList tasks={tasks} />
        )}

        <TaskModal />
      </ModalContextProvider>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={errorMessage}
        ContentProps={{
          style: {
            backgroundColor: "#da2222",
            color: "white",
            border: "none",
          },
        }}
      />
    </div>
  );
}

export default Home;
