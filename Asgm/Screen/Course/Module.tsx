import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, PermissionsAndroid } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RNFS from 'react-native-fs'; 
import { styles } from '../../Styles';

// Request permission to access external storage on Android
const requestExternalStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Permission',
          message: 'This app needs access to your external storage to save files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the external storage to download file now.');
      } else {
        console.log('External storage permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

const ModuleScreen = ({ route, navigation }: any) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { modules, title } = route.params;

  // Request permission when component mounts
  useEffect(() => {
    requestExternalStoragePermission();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prevState =>
      prevState.includes(section)
        ? prevState.filter(item => item !== section)
        : [...prevState, section]
    );
  };

  const downloadFile = async (url: string, lectureName: string) => {
    // Use ExternalStorageDirectoryPath
    const fileName = `${lectureName} ${title}.pdf`;
    const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Documents/${fileName}`;

    try {
      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
        progress: (res) => {
          const progress = Math.round((res.bytesWritten / res.contentLength) * 100);
          console.log(`Download Progress: ${progress}%`);
        },
      };

      await RNFS.downloadFile(options).promise;
      Alert.alert('Download Complete', `File downloaded to: ${downloadDest}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Download Error', 'An error occurred while downloading the file.');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modules</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <ScrollView style={styles.moduleList}>
          {modules.map((moduleUrl: string, index: number) => {
            const lectureName = `Lecture ${index + 1}`;
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => toggleSection(lectureName)}
                  style={styles.sectionHeader}
                >
                  <Text style={styles.sectionTitle}>{lectureName}</Text>
                  <Ionicons
                    name={expandedSections.includes(lectureName) ? "chevron-up-outline" : "chevron-down-outline"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
                {expandedSections.includes(lectureName) && (
                  <View style={styles.sectionContent}>
                    <TouchableOpacity
                      onPress={() => downloadFile(moduleUrl, lectureName)}
                      style={{flexDirection: 'row'}}
                    >
                      <MaterialCommunityIcons name="file-download" size={20} color="#98C1D9"/>
                      <Text style={styles.sectionText}>{lectureName}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default ModuleScreen;
  