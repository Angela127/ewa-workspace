import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    try {
      let messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      };

      if (img) {
        const storage = getStorage();
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed", 
          null, 
          (error) => {
            console.error("Upload failed:", error);
            setError(true);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Image uploaded successfully:", downloadURL);

            // Add image URL to messageData
            messageData = { ...messageData, img: downloadURL };

            // Update chat with image
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion(messageData),
            });

            // Update the lastMessage for both users in userChats collection
            await updateLastMessage(currentUser.uid, messageData.text);
            await updateLastMessage(data.user.uid, messageData.text);
          }
        );
      } else {
        // If there's no image, just update the chat with the text message
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion(messageData),
        });

        // Update the lastMessage for both users in userChats collection
        await updateLastMessage(currentUser.uid, messageData.text);
        await updateLastMessage(data.user.uid, messageData.text);
      }

      console.log('Message sent:', text);

      // Clear input states after sending
      setText("");
      setImg(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(true);
    }
  };

  const updateLastMessage = async (userId, messageText) => {
    try {
      await updateDoc(doc(db, "userChats", userId), {
        [`${data.chatId}.lastMessage`]: { text: messageText },
        [`${data.chatId}.date`]: serverTimestamp(),
      });
      console.log(`Updated lastMessage for ${userId}`);
    } catch (error) {
      console.error(`Error updating lastMessage for ${userId}:`, error);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send">
       
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <span className="material-symbols-outlined">add_photo_alternate</span>
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
