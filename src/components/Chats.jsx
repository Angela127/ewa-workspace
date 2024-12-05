import React, {useEffect, useState, useContext} from 'react'
import {AuthContext} from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import {db} from "../firebase"
import {ChatContext} from "../context/ChatContext";

const Chats = () =>{

    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);

    const [chats, setChats] = useState([])   
    useEffect(()=>{
        const getChats = () =>{
            const unsub = onSnapshot(doc(db, "userChats", currentUser?.uid), (doc) => {
                setChats(doc.exists() ? doc.data() : {});
            });
            return() =>{
                unsub();
            }
        }
        if (currentUser?.uid) {
            getChats();
    }
}  
    ,[currentUser.uid])
    
    const handleSelect = (u)=>{
        dispatch({type:"CHANGE_USER", payload:u})
    }
        
    
    return (
        <div className="chats">
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map(([key, chat]) => {
              // Ensure user exists and has the necessary properties
              const user = chat.userInfo;
    
              if (!user || !user.photoURL) {
                return null; // Skip if there's no user or no photoURL
              }
    
              return (
                <div className="userChat" key={key} onClick={() => handleSelect(user)}>
                  <img src={user.photoURL||"/images/ewa.png"} alt={user.displayName || "User"} />
                  <div className="userChatInfo">
                    <span>{user.displayName}</span>
                    <p>{chat.lastMessage?.text || "No message"}</p>
                  </div>
                </div>
              );
            })}
        </div>
      );
    };

export default Chats;