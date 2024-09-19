import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Modal from 'react-native-modal'; 
import Ionicons from "react-native-vector-icons/Ionicons";
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import RenderHtml from 'react-native-render-html'; 
import { firebase_auth, db } from '../..//config';
import { doc, getDoc, collection, addDoc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { styles } from '../../Styles';

const DiscussionDetailScreen = ({ navigation, route }: any) => {
  const { discussionId } = route.params; // Get discussionId from the route params
  const [discussion, setDiscussion] = useState(null); // Store discussion details
  const [author, setAuthor] = useState({ name: '', img: '' }); // Store discussion author details
  const [replies, setReplies] = useState([]); // Store replies for the discussion
  const [isReplying, setIsReplying] = useState(false); // Manage reply editor visibility
  const [content, setContent] = useState(''); // Manage the reply editor content
  const [SuccessModalVisible, setSuccessModalVisible] = useState(false); // Modal state
  const [FailModalVisible, setFailModalVisible] = useState(false); // Modal state
  const richText = useRef(null);
  const { width } = Dimensions.get("window");

  // Function to format the Firestore Timestamp
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    const fetchDiscussionDetails = async () => {
      try {
        const discussionDocRef = doc(db, 'discussions', discussionId);
        const discussionSnapshot = await getDoc(discussionDocRef);
        if (discussionSnapshot.exists()) {
          const discussionData = discussionSnapshot.data();
          setDiscussion(discussionData);
  
          // Fetch the author details based on the document ID (which is the `uid`)
          const authorDocRef = doc(db, 'users', discussionData.authorUid); // Use the `uid` as document ID
          const authorSnapshot = await getDoc(authorDocRef);
          if (authorSnapshot.exists()) {
            const authorData = authorSnapshot.data();
            setAuthor({ name: authorData.name, img: authorData.img });
          } else {
            console.error("Error: Author data not found.");
            // Set author to null if fetching failed, or handle it another way
            setAuthor(null);
          }
        }
      } catch (error) {
        console.error("Error fetching discussion details or author: ", error);
        setAuthor(null); // If there's an error, don't proceed with setting author
      }
    };
  
    const fetchReplies = () => {
      const repliesCollectionRef = collection(db, 'replies');
      const q = query(repliesCollectionRef, where('discussionId', '==', discussionId));
  
      // Real-time listener
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const repliesList = await Promise.allSettled(snapshot.docs.map(async (docSnap) => {
          const replyData = docSnap.data();
          try {
            const authorRef = doc(db, 'users', replyData.authorUid);
            const authorSnapshot = await getDoc(authorRef);
            const authorData = authorSnapshot.exists()
              ? authorSnapshot.data()
              : null; // No fallback, return null if fetching fails
  
            return {
              id: docSnap.id,
              ...replyData,
              author: authorData || { name: null, img: null }, // Set as null if fetch fails
            };
          } catch (error) {
            console.error("Error fetching author details: ", error);
            return {
              id: docSnap.id,
              ...replyData,
              author: { name: null, img: null }, // Set as null if fetch fails
            };
          }
        }));
  
        // Filter only fulfilled promises
        const fulfilledReplies = repliesList
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);
  
        setReplies(fulfilledReplies);
      });
  
      return unsubscribe; // Return Firestore unsubscribe function
    };
  
    fetchDiscussionDetails();
    const unsubscribe = fetchReplies();
  
    return async () => unsubscribe(); // Cleanup listener on unmount
  }, [discussionId]);
  

  const handleSendReply = async () => {
    if (!content.trim()) {
      setFailModalVisible(true);
      return;
    }

    const uid = firebase_auth.currentUser?.uid; // Get current user ID

    const replyData = {
      discussionId: discussionId,
      content: content,
      authorUid: uid,
      createdAt: Timestamp.now(), // Firestore Timestamp
    };

    try {
      const repliesCollectionRef = collection(db, 'replies');
      await addDoc(repliesCollectionRef, replyData);
      setSuccessModalVisible(true);
      setIsReplying(false);
      setContent('');
    } catch (error) {
      setFailModalVisible(true);
    }
  };

  const closeSuccessModal = () => setSuccessModalVisible(false);
  const closeFailModal = () => setFailModalVisible(false);

  if (!discussion) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Loading discussion...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discussion Detail</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Discussion Details */}
          <View style={styles.profileContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: author.img }} // Ensure fallback
            />
            <View>
              <Text style={styles.name}>{author.name}</Text>
              <Text style={styles.date}>{formatDateTime(discussion.createdAt)}</Text>
            </View>
          </View>

          <Text style={styles.discussionTitle}>{discussion.title}</Text>
          <Text style={styles.discussionDetail}>{discussion.description}</Text>

          {/* Reply Section */}
          {!isReplying && (
            <TouchableOpacity style={styles.replyButton} onPress={() => setIsReplying(true)}>
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          )}

          {isReplying && (
            <View style={styles.replySection}>
              <RichEditor
                ref={richText} // Correctly pass the ref here
                onChange={setContent}
                placeholder="Start typing your reply..."
                editorStyle={{ backgroundColor: '#fff', color: '#000' }}
                style={styles.richEditor}
              />
              <RichToolbar
                editor={richText} // Use the same ref for the toolbar
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.heading1,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                ]}
                style={styles.richToolbar}
                iconTint="#000"
                selectedIconTint="#873c1e"
                disabledIconTint="#bfbfbf"
              />
              <TouchableOpacity style={styles.replyButton} onPress={handleSendReply}>
                <Text style={styles.replyButtonText}>Send Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.replycancelButton} onPress={() => setIsReplying(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Replies */}
          {replies.map(reply => (
            <View key={reply.id} style={styles.replyContainer}>
              <View style={styles.profileContainer}>
                <Image style={styles.profileImage} source={{ uri: reply.author.img || 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-flat-design-vector-illustration-of-a-user-with-question-icon-among-people-vector-png-image_42083172.jpg'}} />
                <View>
                  <Text style={styles.replyName}>{reply.author.name || "unknown" }</Text>
                  <Text style={styles.replyDate}>{formatDateTime(reply.createdAt) || "unknown"}</Text>
                </View>
              </View>
              <RenderHtml
                contentWidth={width}
                source={{ html: reply.content }}
                tagsStyles={{
                  p: { color: '#FFFFFF' },
                  div: { color: '#FFFFFF' },
                  span: { color: '#FFFFFF' },
                  h1: { color: '#FFFFFF' },
                  h2: { color: '#FFFFFF' },
                  h3: { color: '#FFFFFF' },
                  li: { color: '#FFFFFF' }
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modals */}
      <Modal isVisible={SuccessModalVisible} onBackdropPress={closeSuccessModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Success</Text>
          <Text style={styles.modalMessage}>Your reply has been posted successfully!</Text>
          <TouchableOpacity onPress={closeSuccessModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={FailModalVisible} onBackdropPress={closeFailModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Failed</Text>
          <Text style={styles.modalMessage}>Please write something to reply.</Text>
          <TouchableOpacity onPress={closeFailModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DiscussionDetailScreen;
