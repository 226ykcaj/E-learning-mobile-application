import { getFirestore, collection, doc, onSnapshot, query, where, getDoc, getDocs } from "firebase/firestore";
import { firebase_app, firebase_auth, db } from "../config";

export const fetchCourses = async () => {
  try {
    const user = firebase_auth.currentUser; // Get the current user from Firebase Auth

    if (!user) {
      console.error("No user is currently signed in.");
      return [];
    }

    // Fetch courses from the "courses" collection
    const coursesRef = collection(db, "course");
    const querySnapshot = await getDocs(coursesRef);

    const courses = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const { shortTitle, title, desc, img, synopsis, courseOutline = [], modules = [] } = data;

      return {
        id: doc.id,
        shortTitle,
        title,
        desc,
        synopsis,
        courseOutline,
        img,
        modules,
      };
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses: ", error.message);
    return [];
  }
};

export const listenToTask = (callback) => {
  const user = firebase_auth.currentUser;

  // Check if a user is signed in
  if (!user) {
    console.error("No user is currently signed in.");
    if (typeof callback === 'function') {
      callback([]); // Call callback with an empty array if no user is signed in
    }
    return () => {}; // Return a dummy function to prevent issues
  }

  const userId = user.uid; // Get the current user's UID

  // Reference to the "todos" collection, where each todo contains a `userID` field
  const todosRef = collection(db, "todos");

  // Create a query to listen for todos created by the current user (filter by `userID`)
  const todosQuery = query(todosRef, where("userID", "==", userId));

  // Set up real-time listener using Firestore's onSnapshot
  const unsubscribe = onSnapshot(
    todosQuery,
    (snapshot) => {
      const todoList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(), // All the task data (title, description, date, time, etc.)
      }));

      if (typeof callback === 'function') {
        callback(todoList); // Call the callback with the updated list of todos
      }
    },
    (error) => {
      console.error("Error fetching todos: ", error);
      if (typeof callback === 'function') {
        callback([]); // Call callback with an empty array in case of an error
      }
    }
  );

  // Return the unsubscribe function to clean up the listener when no longer needed
  return unsubscribe;
};

// Listen to changes in enrolled courses
export const listenToEnrolledCourses = (callback) => {
  const user = firebase_auth.currentUser;

  if (!user) {
    console.error("No user is currently signed in.");
    if (typeof callback === 'function') {
      callback([]);
    }
    return () => {}; // Return an empty function as no-op
  }

  // Reference to the enrolledCourses collection
  const enrolledCoursesRef = collection(db, "enrolledCourses");

  // Query to get documents where the userId matches the current user's UID
  const userEnrollmentsQuery = query(enrolledCoursesRef, where("userId", "==", user.uid));

  const unsubscribe = onSnapshot(userEnrollmentsQuery, async (snapshot) => {
    try {
      const coursePromises = snapshot.docs.map(async (enrollmentDoc) => {
        const { courseId } = enrollmentDoc.data(); // Get courseId from the document data
        const courseDoc = await getDoc(doc(db, "course", courseId)); // Fetch course using courseId
        return courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } : null;
      });

      const enrolledCourses = (await Promise.all(coursePromises)).filter(course => course !== null);
      if (typeof callback === 'function') {
        callback(enrolledCourses);
      }
    } catch (error) {
      console.error("Error processing enrolled courses: ", error);
      if (typeof callback === 'function') {
        callback([]);
      }
    }
  }, (error) => {
    console.error("Error listening to enrolled courses: ", error);
    if (typeof callback === 'function') {
      callback([]);
    }
  });

  return unsubscribe;
};

