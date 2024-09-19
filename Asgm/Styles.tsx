import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    /**
     * For App Styles
     */
    container: {
      flex: 1,
      backgroundColor: '#252525',
      paddingHorizontal: 20
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      paddingHorizontal: 20,
      backgroundColor: '#333333',
      height: 55
    },
    homeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      paddingHorizontal: 20,
      backgroundColor: '#333333',
      height: 60
    },
    headerTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      alignItems: 'center',
    },
    logo: {
      width: 60, 
      height: 60, 
      resizeMode: 'contain', 
      marginTop: 5
    },



    /**
     * For CourseScreen Styles
     */
    courseBanner: {
      alignItems: 'center',
      // backgroundColor: '#124E78',
      backgroundColor: '#98C1D9',
      paddingVertical: 20,
    },
    courseImage: {
      width: '100%',
      height: 100,
      resizeMode: 'contain',
    },
    courseTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#293241',
      marginTop: 10,
    },
    courseTerm: {
      fontSize: 14,
      color: 'white',
    },
    menuList: {
      padding: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#474747',
    },
    menuItemText: {
      flex: 1,
      marginLeft: 10,
      color: 'white',
      fontSize: 16,
    },
    moduleList: {
      padding: 10,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#474747',
    },
    sectionTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    sectionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingLeft: 20,
    },
    sectionText: {
      color: 'white',
      marginLeft: 10,
      fontSize: 14,
    },
    image: {
      width: '100%',
      height: 200,
      marginBottom: 20,
    },



    /**
     * For CourseDescriptionScreen Styles
     */
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF', 
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginTop: 20,
    },
    description: {
      fontSize: 16,
      color: '#FFF', 
      marginBottom: 10,
      marginTop: 10,
      lineHeight: 24,
      textAlign: "justify"
    },
    ul: {
      color: "white"
    },
    li:{
      fontSize: 15,
      color: '#FFFFFF', 
      textAlign: "justify",
      lineHeight: 24,
    },

    /**
     * For AnnouncementDetailScreen Styles
     */
    courseOutlineCon: {
      marginBottom: 30
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingTop: 10,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF', 
    },
    role: {
      fontSize: 14,
      color: '#FFFFFF', 
    },
    date: {
      fontSize: 12,
      color: '#FFFFFF', 
    },
    // addButton: {
    //   marginRight: 15,
    //   backgroundColor: '#FFFFFF',
    //   borderRadius: 50,
    //   padding: 5,
    // },



    /**
     * For DiscussionScreen Styles
     */
    discussionItem: {
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#333', // Dark background for discussion item
      borderRadius: 10,
    },
    details: {
      fontSize: 14,
      color: '#aaa',
      marginTop: 5,
    },
    content: {
      marginTop: 10,
      padding: 10,
    },
    discussionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 15,
    },
    discussionDetail: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 20,
      lineHeight: 24,
      textAlign: 'justify',
    },
    // replyButton: {
    //   backgroundColor: '#98C1D9',
    //   padding: 15,
    //   borderRadius: 10,
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    // replyButtonText: {
    //   color: '#293241',
    //   fontSize: 18,
    //   fontWeight: 'bold',
    // },

    

    /**
     * For AddDiscussionScreen Styles
     */
    cancelButton: {
      color: '#98C1D9',
      fontSize: 16,
    },
    doneButton: {
      color: '#98C1D9',
      fontSize: 16,
    },
    inputContainer: {
      marginBottom: 20,
      marginTop: 20
    },
    label: {
      color: '#FFFFFF',
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      backgroundColor: '#333',
      color: '#FFFFFF',
      fontSize: 16,
      padding: 10,
      borderRadius: 5,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#474747',
    },
    optionLabel: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    switch:{
      color: "#98C1D9"
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

    
    
    /**
     * For DiscussionDetailScreen Styles
     */
    replyContainer: {
      borderTopWidth: 1,
      borderTopColor: '#474747',
      paddingVertical: 15,
      marginVertical: 10,
    },
    replyName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF', 
    },
    replyDate: {
      fontSize: 12,
      color: '#FFFFFF',
    },
    replyContent: {
      fontSize: 16,
      color: '#FFFFFF',
      marginTop: 5,
    },
    replySection: {
      backgroundColor: '#333', // Background for reply section
      padding: 10,
      borderRadius: 5,
      height: 410
    },
    replyButton: {
      backgroundColor: '#98C1D9',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 10,
    },
    replyButtonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    replycancelButton: {
      backgroundColor: '#98C1D9',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 20,
    },
    cancelButtonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    richEditor: {
      minHeight: 200,
      borderWidth: 1,
      borderColor: '#98C1D9',
      borderRadius: 5,
      marginBottom: 20,
    },
    richToolbar: {
      backgroundColor: '#fff',
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
    },



    /**
     * For Drawer Styles
     */
    drawerHeader: {
      backgroundColor: '#252525',
      paddingVertical: 20,
      paddingHorizontal: 15,
      alignItems: 'center',
      flex: 0.2,
      borderBottomWidth: 1,
      borderBlockColor: "#474747"
  },
  HomeProfileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
  },
  userName: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
  },
  userEmail: {
      color: '#ffffff',
      fontSize: 14,
  },
  drawerItems: {
      flex: 0.7,
      backgroundColor: '#252525',
      paddingTop: 10,
  },
  footer: {
      padding: 20,
      backgroundColor: '#252525',
      flex: 0.1,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
  },
  footerText: {
      color: '#999999',
      fontSize: 12,
  },
  logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10, // Ensure some spacing between the logout button and footer text
  },
  logoutIcon: {
      marginRight: 10, // Add some spacing between the icon and the text
  },
  logoutButtonText: {
    color: '#999999',
    fontSize: 16,
  },



  
    /**
     * For Profile Styles
     */
  imageContainer: {
      alignItems: "center",
      marginVertical: 22,
  },
  imageStyle: {
      width: 150,
      height: 150,
      borderRadius: 100,
      borderWidth: 3,
      borderColor: "#98C1D9",
  },
  imageIconContainer: {
      position: "absolute",
      bottom: 0,
      right: 10,
      zIndex: 999,
  },

  buttonStyle: {
      backgroundColor: '#98C1D9',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 10,
  },
  buttonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
  },
  longButtonStyle: {
      backgroundColor: '#98C1D9',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      width: '100%',  // Make the button span the full width
  },
  datePickerModal: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
  },
  datePickerContainer: {
      margin: 20,
      backgroundColor: "#333", // Dark background to match modal style
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      padding: 15,
      width: "90%",
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
  },
  overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },


  /**
   * For TaskScreenDetails Styles
   */
  backButton: {
      paddingLeft: 5,
  },
  textField: {
      height: 48,
      borderRadius: 5,
      backgroundColor: "white",
      paddingLeft: 16,
      marginBottom: 16,
  },
  buttonUpdate: {
      height: 48,
      borderRadius: 5,
      backgroundColor: "#788eec",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20
  },


  /**
   * For TaskScreen Styles
   */
button: {
    height: 48,
    borderRadius: 5,
    backgroundColor: "#98C1D9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
},

todoContainer: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center"
},
innerContainer: {
    flexDirection: "column",
    marginLeft: 15,
    flex: 1,
},
itemHeading: {
    fontWeight: "bold",
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
},
itemDescription: {
    fontSize: 14,
    color: '#FFFFFF',
},
todoIcon: {
    fontSize: 24,
    color: '#e63946',
    marginRight: 15
},
dateHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: '#FFFFFF',
    marginTop: 10,
    marginLeft: 10
},



/**
 * For CreateTask,  Styles
 */
datePickerWrapper: {
  borderRadius: 5,  
  overflow: 'hidden',
  marginVertical: 10,
},



/**
 * For NewsScreen Styles
 */
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






//when nothing to show
nothingContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
},
nothingText: {
  fontSize: 18,
  color: '#FFFFFF',
  marginBottom: 10,
},


/**
 * For Dashboard Style
 */
masonryListContainer: {
  marginTop: 10, // Ensure some spacing between the search bar and masonry list
},
masonryCardContainer: {
  margin: 5,
  flex: 1,
  backgroundColor: '#474747',
  borderRadius: 10,
  overflow: 'hidden', // Ensures the image and content fit within rounded borders
},
masonryCard: {
  backgroundColor: '#333',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: 10,
},
courseInfo: {
  flex: 1,
  justifyContent: 'center',
},
shortTitle: {
  color: '#98c1d9',
  fontWeight: 'bold',
  fontSize: 14,
  marginBottom: 5,
},
titleText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
  lineHeight: 20, // Ensure consistent spacing between lines
  flex: 1,
  flexWrap: 'wrap',
},
enrollButton: {
  position: 'absolute',
  bottom: 10,
  right: 10,
},
});