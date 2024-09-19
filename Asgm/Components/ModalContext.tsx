// ModalContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const ModalContext = createContext();

// ModalProvider component to wrap the app and provide context
export const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState({ title: '', body: '' });

  // Function to show the modal with a specific message
  const showModal = (msg) => {
    setMessage(msg);
    setModalVisible(true);
  };

  // Function to hide the modal
  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <ModalContext.Provider value={{ modalVisible, message, showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
};
