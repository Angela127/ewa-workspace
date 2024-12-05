import React, { useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username.trim()));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          console.log("User found:", doc.data());
          setUser(doc.data());
        });
        setErr(false);
      } else {
        console.log("No user found for:", username);
        setErr(true);
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!currentUser || !user) return;

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const chatDocRef = doc(db, "chats", combinedId);
      const userChatCurrentRef = doc(db, "userChats", currentUser.uid);
      const userChatOtherRef = doc(db, "userChats", user.uid);

      // Check if the chat document exists
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        // Create the chat document if it doesn't exist
        await setDoc(chatDocRef, { messages: [] });
      }

      // Prepare data for currentUser's userChats
      const currentUserUpdate = {
        [`${combinedId}.userInfo`]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        [`${combinedId}.date`]: serverTimestamp(),
      };

      // Prepare data for the other user's userChats
      const otherUserUpdate = {
        [`${combinedId}.userInfo`]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [`${combinedId}.date`]: serverTimestamp(),
      };

      // Update or create userChats for current user
      const currentUserDoc = await getDoc(userChatCurrentRef);
      if (currentUserDoc.exists()) {
        await updateDoc(userChatCurrentRef, currentUserUpdate);
      } else {
        await setDoc(userChatCurrentRef, currentUserUpdate, { merge: true });
      }

      // Update or create userChats for other user
      const otherUserDoc = await getDoc(userChatOtherRef);
      if (otherUserDoc.exists()) {
        await updateDoc(userChatOtherRef, otherUserUpdate);
      } else {
        await setDoc(userChatOtherRef, otherUserUpdate, { merge: true });
      }
    } catch (err) {
      console.error("Error handling chat selection:", err);
    }

    // Dispatch a CHANGE_USER action to update ChatContext
    dispatch({ type: "CHANGE_USER", payload: user });

    setUser(null);
    setUsername("");
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
