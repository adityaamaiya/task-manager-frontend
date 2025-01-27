import React, { use, useEffect, useState } from "react";
import { TextField, Button, Grid, Container } from "@mui/material";
import { useModal } from "../context/ModalContext";
import Snackbar from "@mui/material/Snackbar";

import axios from "axios";

function TaskForm() {
  const { taskId, setIsModalOpen ,setTaskId} = useModal();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const getTaskById = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/tasks/${taskId}`);
      const task = response.data;
      setFormData(task);
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      setErrorMessage("Error fetching task by ID");
      setOpen(true);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskById();
    }
  }, [taskId]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can send this data to the server here
    console.log(taskId);
    try {
      if (taskId) {
        const { _id,__v, ...updateData } = formData;
        const response = await axios.put(
          `http://localhost:3002/tasks/${taskId}`,
          updateData
        );
        console.log(response.data);
      } else {
        const reponse = await axios.post(
          "http://localhost:3002/tasks",
          formData
        );
        console.log(reponse.data);
      }
      window.location.reload();
      // Reset the form after successful submission
      setFormData({
        title: "",
        description: "",
        deadline: "",
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error.response.data);
      setErrorMessage(error.response.data.error);
      setOpen(true);
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Deadline"
              variant="outlined"
              fullWidth
              type="date"
              required
              name="deadline"
              value={
                formData.deadline
                  ? new Date(formData.deadline).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} style={{display:"flex",justifyContent:"space-between"}} >
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setTaskId(null);
                setIsModalOpen(false);
              }}
              
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
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
    </Container>
  );
}

export default TaskForm;
