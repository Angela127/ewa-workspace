import React, { useEffect, useState, useRef } from "react";
import {
  getAuth,
  updateProfile,
  deleteUser,
  signOut,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  getFirestore,doc,getDoc,updateDoc,deleteDoc,getDocs,writeBatch,query,where,collection,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "../profile.scss";

const Profile = () => {
  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    avatar: "",
    username: "",
    email: "",
  });
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const fileInputRef = useRef(null);  // Ref for file input

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(firestore, "users", user.uid);
        try {
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            if (userData.photoURL) {
              const avatarRef = storageRef(storage, userData.photoURL);
              const avatarURL = await getDownloadURL(avatarRef);
              setUserDetails({
                username: userData.displayName,
                email: userData.email,
                avatar: avatarURL,
              });
            } else {
              setUserDetails({
                username: userData.displayName,
                email: userData.email,
                avatar: "",
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [auth, firestore, storage]);

  const updateUserPostsPhotoURL = async (newPhotoURL) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, where("userId", "==", userId));

    try {
      const snapshot = await getDocs(q);
      const batch = writeBatch(firestore);

      snapshot.forEach((doc) => {
        batch.update(doc.ref, { photoURL: newPhotoURL });
      });

      await batch.commit();
    } catch (error) {
      console.error("Error updating user posts:", error);
    }
  };

  const checkIfEmailExists = async (email) => {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0; // If methods are found, email is already associated with an account
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleEdit = async () => {
    if (newUsername) {
      const user = auth.currentUser;
      if (user) {
        try {
          await updateProfile(user, { displayName: newUsername });
          const userDoc = doc(firestore, "users", user.uid);
          await updateDoc(userDoc, { displayName: newUsername });

          setUserDetails((prevState) => ({
            ...prevState,
            username: newUsername,
          }));
          alert("Username updated successfully!");
        } catch (error) {
          console.error("Error updating username:", error);
          alert("Failed to update username.");
        }
      }
    }

    if (newEmail) {
      const emailExists = await checkIfEmailExists(newEmail);
      if (emailExists) {
        alert("This email is already associated with another account.");
        return;
      }

      const user = auth.currentUser;
      if (user) {
        try {
          await user.updateEmail(newEmail);
          const userDoc = doc(firestore, "users", user.uid);
          await updateDoc(userDoc, { email: newEmail });

          setUserDetails((prevState) => ({
            ...prevState,
            email: newEmail,
          }));
          alert("Email updated successfully!");
        } catch (error) {
          console.error("Error updating email:", error);
          alert("Failed to update email.");
        }
      }
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const user = auth.currentUser;
      if (user) {
        const avatarPath = `avatars/${user.uid}`;
        const avatarRef = storageRef(storage, avatarPath);

        try {
          const uploadTask = await uploadBytesResumable(avatarRef, file);
          const avatarURL = await getDownloadURL(uploadTask.ref);

          const userDoc = doc(firestore, "users", user.uid);
          await updateDoc(userDoc, {
            photoURL: avatarPath,
          });

          await updateProfile(user, {
            photoURL: avatarURL,
          });

          setUserDetails((prevState) => ({
            ...prevState,
            avatar: avatarURL,
          }));

          await updateUserPostsPhotoURL(avatarURL);

          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("Failed to update profile. Please try again.");
        }
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(firestore, "users", user.uid);
        try {
          await deleteDoc(userDoc);
          await deleteUser(user);
          await signOut(auth);
          alert("User deleted successfully.");
          navigate("/");
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    }
  };

  return (
    <div className="profile-page">
      <h2>Edit Profile</h2>
      <div>
        <img
          src={userDetails.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          style={{ width: "150px", borderRadius: "50%" }}
        />
      </div>

      {/* Username Section */}
      <div className="edit-input">
        <h3>Username: {userDetails.username}</h3>
        <input
          type="text"
          value={newUsername}
          onChange={handleUsernameChange}
          placeholder="Enter new username"
        />
      </div>

      {/* Email Section */}
      <div className="edit-input">
        <h3>Email: {userDetails.email}</h3>
        <input
          type="email"
          value={newEmail}
          onChange={handleEmailChange}
          placeholder="Enter new email"
        />
      </div>

      {/* Avatar Section */}
      <div>
        <h3>Avatar</h3>
        <button className="change-button" onClick={() => fileInputRef.current.click()}>Change Avatar</button>
      </div>

      <div>
        <button className="update-button"
          onClick={handleEdit}
          style={{ margin: "10px", padding: "10px 20px" }}
        >
          Update Profile
        </button>
        <button className="del-button"
          onClick={handleDelete}>
          Delete Profile
        </button>
      </div>

      {/* Hidden file input for avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Profile;
