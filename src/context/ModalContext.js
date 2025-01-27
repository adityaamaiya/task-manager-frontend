import React, { createContext, useContext, useState } from "react";
const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, setIsModalOpen, taskId, setTaskId }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
