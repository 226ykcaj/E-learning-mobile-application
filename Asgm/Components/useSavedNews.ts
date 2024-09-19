import { useState, useEffect } from 'react';
import { getSavedNews, deleteNews, updateNewsDescription } from '../Database/savedNewsDB'; // Import your database operations

const useSavedNews = () => {
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletedModalVisible, setDeletedModalVisible] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<any | null>(null);
  const [newDescription, setNewDescription] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Fetch saved news from the database
  const fetchSavedNews = () => {
    getSavedNews(setSavedArticles);
  };

  // Refresh saved news
  const handleRefresh = () => {
    setRefreshing(true);
    fetchSavedNews();
    setRefreshing(false);
  };

  // Open the delete modal
  const openDeleteModal = (id: number) => {
    setArticleToDelete(id);
    setDeleteModalVisible(true);
  };

  // Handle delete action
  const handleDelete = () => {
    if (articleToDelete !== null) {
      deleteNews(articleToDelete);
      fetchSavedNews();
      setDeleteModalVisible(false);
      setDeletedModalVisible(true);
    }
  };

  // Open the edit modal with prepopulated data
  const openEditModal = (item: any) => {
    setArticleToEdit(item);
    setNewDescription(item.description); // Prepopulate the description
    setEditModalVisible(true);
  };

  // Handle update of the article description
  const handleUpdateDescription = () => {
    if (articleToEdit) {
      updateNewsDescription(articleToEdit.id, newDescription);
      fetchSavedNews(); // Refresh the saved news list after update
      setEditModalVisible(false); // Close the modal
    }
  };

  // Fetch saved news on mount
  useEffect(() => {
    fetchSavedNews();
  }, []);

  return {
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
    setEditModalVisible
  };
};

export default useSavedNews;
