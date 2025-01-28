import * as React from "react";

import Button from "@mui/material/Button";

import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";

import Paper from "@mui/material/Paper";
import TaskForm from "./TaskForm";
import { useModal } from "../context/ModalContext";

export default function TaskModal() {
  const { isModalOpen, setIsModalOpen, setTaskId } = useModal();

  return (
    <div>
      <Button
        component={Paper}
        elevation={3}
        sx={{
          color: "white",
          backgroundColor: "rgba(25,118,210,1)",
          borderRadius: "50%",
          height: "65px",
          width: "25px",
          position: "absolute",
          left: "85%",
          top: "85%",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <AddIcon style={{ fontSize: "35px", fontWeight: "bolder" }} />
      </Button>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskId(null);
        }}
      >
        <TaskForm />
      </Modal>
    </div>
  );
}
