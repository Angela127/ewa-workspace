import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, getDoc, writeBatch, where } from "firebase/firestore";
import HandleDelete from '../context/HandleDelete'; // Import HandleDelete modal component
import { useLocation } from 'react-router-dom';
import "../moments.scss";

const Moments = () => {
    const auth = getAuth();
    const db = getFirestore();
    const location = useLocation();
    const currentPage = location.pathname.includes('moments') ? 'moments' : '';

    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState("Anonymous");
    const [postText, setPostText] = useState(""); // To store new post text
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [comments, setComments] = useState({}); // To store comments per post
    const [commentText, setCommentText] = useState(""); // To manage the comment input value
    
    // Fetch user data and authentication status
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;
                const userRef = doc(db, "users", userId);

                getDoc(userRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        setUsername(docSnap.data().displayName || "Anonymous");
                    }
                }).catch((error) => {
                    console.error("Error fetching user data:", error);
                });
            } else {
                alert("You need to be logged in to access the profile.");
                window.location.href = "index.html";
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    // Handle new post creation
    const  handleAddPost = async (e) => {
        e.preventDefault();

        if (postText.trim()) {
            try {
                await addDoc(collection(db, "posts"), {
                    text: postText,
                    userId: auth.currentUser.uid,
                    displayName: username,
                    photoURL: auth.currentUser.photoURL || "",
                    timestamp: Date.now(),
                    likes: {},
                    likeCount: 0,
                });

                setPostText(""); // Reset post text after successful submission
            } catch (error) {
                console.error("Error adding post:", error);
            }
        }
    };

    // Fetch posts from Firestore
    useEffect(() => {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData =snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData); // Update the posts state with fetched data
            // Fetch comments for each post
            postsData.forEach((post) => {
                fetchComments(post.id); // Fetch comments for each post
            })
        });

        return () => unsubscribe();
    }, [db]);

    // Handle adding a comment to a specific post
    const handleAddComment = async (postId, commentText) => {
        if (commentText.trim()) {
            try {
                const commentRef = collection(db, "posts", postId, "comments");
                await addDoc(commentRef, {
                    text: commentText,
                    timestamp: Date.now(),
                    displayName: username || "Anonymous",
                    photoURL: auth.currentUser.photoURL || "", // Include avatar URL
                });
                // Clear the comment input field after sending the comment
            setCommentText(""); // Reset comment input
                
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        } else {
            alert("Comment cannot be empty!");
        }
    };

    // Fetch comments from Firestore for a specific post
    const fetchComments = (postId) => {
        const commentsRef = collection(db, "posts", postId, "comments");
        onSnapshot(commentsRef, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => doc.data());
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: commentsData,
            }));
        });
    };

    const updateUserPostsPhotoURL = async (newPhotoURL) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
    
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("userId", "==", userId)); // Query posts created by the user
    
        try {
            const snapshot = await getDoc(q);
            const batch = writeBatch(db);
    
            snapshot.forEach((doc) => {
                batch.update(doc.ref, { photoURL: newPhotoURL }); // Update `photoURL` field
            });
    
            await batch.commit();
            console.log("Posts updated successfully.");
        } catch (error) {
            console.error("Error updating posts:", error);
        }
    };

    // Handle liking a post
    const handleLikePost = async (postId) => {
        const postRef = doc(db, "posts", postId);
        const userId = auth.currentUser.uid;

        try {
            const postDoc = await getDoc(postRef);
            if (postDoc.exists()) {
                const post = postDoc.data();
                const updatedLikes = post.likes || {};

                if (updatedLikes[userId]) {
                    delete updatedLikes[userId];  // Remove like
                    post.likeCount = (post.likeCount || 0) - 1;
                } else {
                    updatedLikes[userId] = true;  // Add like
                    post.likeCount = (post.likeCount || 0) + 1;
                }

                await updateDoc(postRef, {
                    likes: updatedLikes,
                    likeCount: post.likeCount,
                });
            }
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    // Handle post deletion
    const handleDeletePost = async () => {
        const auth = getAuth();
        const userId = auth.currentUser?.uid; // Get the current authenticated user's ID
    
        if (postIdToDelete && userId) {
            const postRef = doc(db, "posts", postIdToDelete);
    
            try {
                // Fetch the post from Firestore to check if the current user is the owner
                const postDoc = await getDoc(postRef);
                const post = postDoc.data();
    
                if (post && post.userId === userId) {
                    // If the current user is the post owner, proceed with deletion
                    await deleteDoc(postRef);  // Delete post from Firestore
                    setPosts(posts.filter(post => post.id !== postIdToDelete)); // Remove post from UI
                    setShowModal(false);  // Close modal after deletion
                } else {
                    // If the current user is not the post owner
                    alert("You can only delete your own posts!");
                    
                }
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    // Show the delete confirmation modal
    const showDeleteModal = (postId) => {
        setPostIdToDelete(postId);
        setShowModal(true);
    };

    // Cancel delete action
    const cancelDelete = () => {
        setShowModal(false);
        setPostIdToDelete(null);
    };

    return (
        <div className="moments-page">
            {showModal && (
                <HandleDelete
                    message="Are you sure you want to delete this post?"
                    onConfirm={handleDeletePost}
                    onCancel={cancelDelete}
                />
            )}

            <h1 className="posts">Posts</h1>

            <form onSubmit={handleAddPost}>
                <textarea
                    className='textarea-1'
                    placeholder="What's on your mind?"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    required
                />
                <button type="submit" className="post-button">Add Post</button>
            </form>

            <div>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="post">
                            <img
                                src={post.photoURL || "/default-avatar.png"}
                                alt="Avatar"
                                className="avatar"
                            />
                            <p><strong>{post.displayName}</strong>: {post.text}</p>
                            <small>{new Date(post.timestamp).toLocaleString()}</small>
                            <div className="post-footer">
                                <button
                                    className="all-button"
                                    onClick={() => handleLikePost(post.id)}
                                >
                                    {post.likes?.[auth.currentUser?.uid] ? 'Unlike' : 'Like'} ({post.likeCount})
                                </button>
                                <button className="all-button" onClick={() => showDeleteModal(post.id)}>Delete</button>
                            </div>

                            <div id={`comments-${post.id}`}>
                                <input
                                    type="text"
                                    className="comment-input"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button
                                    className="all-button" 
                                  onClick={() => handleAddComment(post.id, commentText)}
                                >
                                    Add Comment
                                </button>

                                {comments[post.id] && comments[post.id].map((comment, index) => (
                                    <div key={index} className="comment">
                                        <img
                                            src={comment.photoURL || "/default-avatar.png"}
                                            alt="Avatar"
                                            className="avatar"
                                        />
                                        <div className="comment-text">
                                        <p><strong>{comment.displayName}</strong>: {comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='notice'>No posts yet!</p>
                )}
            </div>
        </div>
    );
};
export default Moments;


