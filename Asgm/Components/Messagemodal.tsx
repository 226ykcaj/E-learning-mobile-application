// MessageModal.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { ModalContext } from './ModalContext'; // Import the context

const MessageModal = () => {
  const { modalVisible, message, hideModal } = useContext(ModalContext); // Use context

  return (
    <Modal isVisible={modalVisible} onBackdropPress={hideModal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{message.title}</Text>
        <Text style={styles.modalMessage}>{message.body}</Text>
        <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#98C1D9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#293241',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageModal;
