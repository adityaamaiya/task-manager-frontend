import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Container } from "@mui/material";
import { useModal } from "../context/ModalContext";
import Snackbar from "@mui/material/Snackbar";
import UploadIcon from "@mui/icons-material/Upload";
import { API_URL } from "../config";

import axios from "axios";

function TaskForm() {
  const { taskId, setIsModalOpen, setTaskId } = useModal();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    linkedFile: null, // To hold the uploaded file
  });

  const getTaskById = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks/${taskId}`);
      const task = response.data;
      setFormData({
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        linkedFile: null, // Reset the file field
      });
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
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first file
    setFormData((prevData) => ({
      ...prevData,
      linkedFile: file, // Save the file in state
    }));
  };

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Task ID:", taskId);

    try {
      // Create a FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("deadline", formData.deadline);

      if (formData.linkedFile) {
        formDataToSend.append("linkedFile", formData.linkedFile);
      }

      // Debugging: Log FormData entries to ensure it's populated
      console.log("FormData Contents:");
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      let response;
      if (taskId) {
        response = await axios.put(
          `${API_URL}/tasks/${taskId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(`${API_URL}/tasks`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Response:", response.data);

      // Reload the page or handle success
      window.location.reload();

      // Reset the form
      setFormData({
        title: "",
        description: "",
        deadline: "",
        linkedFile: null,
      });
    } catch (error) {
      console.error(
        "Error in handleSubmit:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.error || "An unexpected error occurred"
      );
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
          <Grid item xs={12}>
            <Button variant="contained" component="label">
              <UploadIcon style={{ marginRight: "8px" }} />
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="application/pdf" // Optional: Restrict to PDFs
              />
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
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
