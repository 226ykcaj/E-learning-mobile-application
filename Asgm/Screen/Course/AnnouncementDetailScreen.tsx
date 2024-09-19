import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import ReactionButton from '../../ReactionButton/index';
import { ReactionItem } from '../../ReactionButton/types'; 

import { styles } from '../../Styles';

const AnnouncementDetailsScreen = ({ navigation }: any) => {
  // Define your reactions
  const reactions: ReactionItem[] = [
    { title: 'Like', source: require('../../assets/reactions/like.png') },
    { title: 'Love', source: require('../../assets/reactions/love.png') },
    { title: 'Haha', source: require('../../assets/reactions/haha.png') },
    { title: 'Sad', source: require('../../assets/reactions/sad.png') },
    { title: 'Wow', source: require('../../assets/reactions/wow.png') },
    { title: 'Angry', source: require('../../assets/reactions/angry.png') },
  ];

  const [selectedReaction, setSelectedReaction] = useState<number>(-1); // To keep track of selected reaction

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>First Announcement</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.container}>
      {/* Profile Information */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'http://www2.utar.edu.my/getPicV2.jsp?fkey=22078' }}
        />
        <View>
          <Text style={styles.name}>Lee Ming Jie</Text>
          <Text style={styles.role}>AUTHOR | Lecturer</Text>
          <Text style={styles.date}>29 AUG 2024 12:00pm</Text>
        </View>
      </View>

      {/* Announcement Content */}
      <Text style={styles.title}>Welcome to the Wireless Application Development</Text>
      <Text style={styles.description}>
        Hello and welcome to your learning journey at UTAR...
      </Text>
      <Text style={styles.description}>
        Very hard subject. Jiayou
      </Text>

      {/* Reaction Button */}
      <ReactionButton
      prefixComponent={<Text style={{ color: '#FFFFFF', marginRight: 5 }}>React: </Text>} // Add text before reaction
        reactions={reactions}
        value={selectedReaction}
        onChange={(index) => setSelectedReaction(index)}
        defaultIndex={-1}
        
        debug={true}
        reactionSize={40}
        textProps={{
          style: {
            fontSize: 13
            ,
            color: '#FFFFFF',
            // borderWidth: 1, // Add border width
            // borderColor: '#474747', // Add border color
            // borderRadius: 5, // Optional: Add border radius
          }
        }}
        
      />
    </ScrollView>
  </SafeAreaView>
  );
};

export default AnnouncementDetailsScreen;
