import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createTable, insertNews } from '../../Database/savedNewsDB';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from 'react-native-modal';
import MessageModal from '../../Components/Messagemodal';
import { ModalContext } from '../../Components/ModalContext';

const API_KEY = '830d0f68b3144df482adca026500784d'; 

const fetchNewsByCategory = async (category) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${category}&apiKey=${API_KEY}`
    );
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching the news', error);
    return [];
  }
};

const NewsScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('education');
  const {showModal} = useContext(ModalContext);

  useEffect(() => {
    createTable();
    const loadNews = async () => {
      const fetchedArticles = await fetchNewsByCategory(category);
      setArticles(fetchedArticles);
    };
    loadNews();
  }, [category]);

  const saveArticle = (article) => {
    insertNews(article.title, article.description, article.urlToImage);
    showModal({title:"Success", body:"You have saved the news successfully!"});
  };

  const renderItem = ({ item }) => (
    <View style={styles.articleContainer}>
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity onPress={() => saveArticle(item)} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            category === 'education' && styles.selectedCategoryButton,
          ]}
          onPress={() => setCategory('education')}
        >
          <Text
            style={[
              styles.categoryText,
              category === 'education' && styles.selectedCategoryText,
            ]}
          >
            Education
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            category === 'technology' && styles.selectedCategoryButton,
          ]}
          onPress={() => setCategory('technology')}
        >
          <Text
            style={[
              styles.categoryText,
              category === 'technology' && styles.selectedCategoryText,
            ]}
          >
            Technology
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            category === 'science' && styles.selectedCategoryButton,
          ]}
          onPress={() => setCategory('science')}
        >
          <Text
            style={[
              styles.categoryText,
              category === 'science' && styles.selectedCategoryText,
            ]}
          >
            Science
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            category === 'health' && styles.selectedCategoryButton,
          ]}
          onPress={() => setCategory('health')}
        >
          <Text
            style={[
              styles.categoryText,
              category === 'health' && styles.selectedCategoryText,
            ]}
          >
            Health
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <FlatList
          data={articles}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          renderItem={renderItem}
        />
      </View>

      <MessageModal />
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
  saveButton: {
    backgroundColor: '#98C1D9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#293241',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
  },
  categoryButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#98C1D9',
  },
  categoryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedCategoryText: {
    color: '#000000',
  },
  // Modal styles
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
    color: '#FFFFFF',
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

export default NewsScreen;
