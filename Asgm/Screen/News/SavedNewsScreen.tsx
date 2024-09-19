import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import useSavedNews from '../../Components/useSavedNews';  // Importing the custom hook

const SavedNewsScreen = ({ navigation }: any) => {
  const {
    savedArticles,
    refreshing,
    deleteModalVisible,
    deletedModalVisible,
    editModalVisible,
    newDescription,
    setNewDescription,
    handleRefresh,
    openDeleteModal,
    handleDelete,
    openEditModal,
    handleUpdateDescription,
    setDeleteModalVisible,
    setDeletedModalVisible,
    setEditModalVisible,
  } = useSavedNews();  // Using the custom hook to manage state and logic

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.articleContainer}>
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.editButtonText}>Edit description</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => openDeleteModal(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved News</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={savedArticles}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>

      {/* Delete Confirmation Modal */}
      <Modal isVisible={deleteModalVisible} onBackdropPress={() => setDeleteModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete News</Text>
          <Text style={styles.modalMessage}>Are you sure you want to delete this news?</Text>
          <View style={styles.modalButtonRow}>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteModalButton}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Deleted Confirmation Modal */}
      <Modal isVisible={deletedModalVisible} onBackdropPress={() => setDeletedModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Deleted</Text>
          <Text style={styles.modalMessage}>The news has been deleted.</Text>
          <TouchableOpacity onPress={() => setDeletedModalVisible(false)} style={styles.modalButton2}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Edit Description Modal */}
      <Modal isVisible={editModalVisible} onBackdropPress={() => setEditModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Description</Text>

          {/* Input for new description */}
          <TextInput 
            style={styles.input}
            placeholder="Enter new description"
            value={newDescription}
            onChangeText={setNewDescription}
            placeholderTextColor="#888"
            multiline
          />

          <View style={styles.modalButtonRow}>
            <TouchableOpacity onPress={handleUpdateDescription} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333333',
    height: 55,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  articleContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#474747',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e63946',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#98C1D9', 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1, 
    alignItems: 'center',
  },
  deleteModalButton:{
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5, 
    flex: 1, 
    alignItems: 'center',
    borderColor: "#e63946",
    borderWidth: 1,
  },
  modalButton2: {
    backgroundColor: '#98C1D9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#444', 
    borderRadius: 5,
    color: '#FFF', 
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default SavedNewsScreen;
