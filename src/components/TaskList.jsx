import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useModal } from "../context/ModalContext";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { API_URL } from "../config";

export default function TaskList({ tasks }) {
  console.log(tasks);
  const { setIsModalOpen, setTaskId } = useModal();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  if (tasks.length === 0) {
    return (
      <h1
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        No task Found!
      </h1>
    );
  }

  const handleEdit = (id) => {
    setTaskId(id);
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      setErrorMessage("Error in Deleting the task");
      setOpen(true);
    }
  };

  const handleDownload = async (id) => {
    try {
      const { linkedFile } = tasks.find((task) => task._id === id);
      if (!linkedFile) {
        setErrorMessage("No file linked to this task");
        setOpen(true);
        return;
      }
      // Fetch task by ID to get the linked file (assuming it's a PDF or Blob)
      const response = await axios.get(`${API_URL}/tasks/${id}/file`, {
        responseType: "blob", // This is necessary to handle binary data (file download)
      });
      console.log(response.data);

      const fileBlob = response.data; // The binary data (Blob) of the file

      const url = URL.createObjectURL(fileBlob); // Create a URL for the Blob data
      const link = document.createElement("a");
      link.href = url;
      link.download = `task-${id}.pdf`; // Set the desired filename (could be dynamic based on file type)
      link.click(); // Trigger the download
      URL.revokeObjectURL(url); // Clean up the object URL
    } catch (error) {
      console.error("Error in handleDownload:", error.response);
      setErrorMessage("Error in downloading the task.");
      setOpen(true);
    }
  };

  const handleTaskStatusChange = async (task, newStatus) => {
    try {
      if (!task) {
        setErrorMessage("Task not found.");
        setOpen(true);
        return;
      }

      // Check if the deadline has passed
      const currentDate = new Date();
      const taskDeadline = new Date(task.deadline);

      if (currentDate > taskDeadline) {
        setErrorMessage("Cannot change status. The deadline has passed.");
        setOpen(true);
        return;
      }

      // Prepare data excluding sensitive fields
      const { _id, __v, linkedFile, ...taskData } = task;

      // Send the updated task data
      const response = await axios.put(`${API_URL}/tasks/${task._id}`, {
        ...taskData,
        status: newStatus,
      });

      console.log("Task status updated:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error in handleTaskStatusChange:", error);
      setErrorMessage("Error changing task status.");
      setOpen(true);
    }
  };

  const getTaskStatus = (task) => {
    const { status, deadline } = task;
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    if (status === "TODO" && currentDate <= deadlineDate) {
      return "In Progress";
    }

    if (status === "DONE" && currentDate <= deadlineDate) {
      return "Achieved";
    }

    if (status === "TODO" && currentDate > deadlineDate) {
      return "Failed";
    }

    return "Invalid"; // For any unexpected status
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 850, margin: "auto", marginTop: 5 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>
              Title
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>
              Descpition
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>
              Deadline
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {task.title}
              </TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                {new Date(task.deadline).toLocaleDateString("en-GB")}
                <br />
                {getTaskStatus(task)}
              </TableCell>

              <TableCell>
                <Button
                  variant="text"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: `${
                      task.status === "TODO" ? "orange" : "green"
                    }`,
                    color: "white",
                    padding: "5px",
                  }}
                  onClick={() => {
                    handleTaskStatusChange(
                      task,
                      task.status === "TODO" ? "DONE" : "TODO"
                    );
                  }}
                >
                  {task.status}
                </Button>
              </TableCell>
              <TableCell>
                <Stack spacing={2} direction="row">
                  <IconButton
                    size="small"
                    aria-label="download"
                    onClick={() => handleDownload(task._id)}
                  >
                    <DownloadIcon sx={{ color: "rgba(25,118,210,1)" }} />
                  </IconButton>

                  <IconButton
                    size="small"
                    aria-label="edit"
                    color="rgba(25,118,210,1)"
                    onClick={() => handleEdit(task._id)}
                  >
                    <EditIcon sx={{ color: "#963cbb" }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => handleDelete(task._id)}
                  >
                    <DeleteIcon sx={{ color: "red" }} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </TableContainer>
  );
}
