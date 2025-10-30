"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "./ChatHook";
import { RootState } from "@/src/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { addMessagesToChat, addNewChat, chatType } from "@/src/lib/features/chat/ChatSlice";
import axios from "axios";
import { Check, CheckCheck, Send } from "lucide-react";
import Image from "next/image";
import { addFriends, errorOnFriends } from "@/src/lib/features/tasks/groupTaskSlice";

export default function ChatPage() {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const socketRef = useSocket(userId ?? "");
  const { chats, initialchatsLoadingStatus } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedReciever, setSelectedReciever] = useState<string>('')
  const [message, setMessage] = useState("");
  const friends = useSelector((state: RootState) => state.groupTask.friends)
  const friendsStatus = useSelector((state: RootState) => state.groupTask.friendsStatus)
  
  const friendsWhoHaveChatRoomWithUs = chats
  .filter(chat => !chat.isGroupChat)
  .map(chat => chat.users.find(userDetail => userDetail.user._id !== userId)?.user._id);

  const currentChatMessages = chats.find(chat => chat._id === selectedChatId)?.messages

  const friendsWhoDoesNotHaveChatRoomWithUs = friends.filter(friend => !friendsWhoHaveChatRoomWithUs.includes(friend._id))
  const [isCurrentRecieverOnline, setIsCurrentRecieverOnline] = useState<boolean>(false);

  const selectedChat = chats.find((c) => c._id === selectedChatId);

  console.log("friends:", friends);
  console.log("friends with whom chat is not started:", friendsWhoDoesNotHaveChatRoomWithUs);

  const hasFetched = useRef({
    friends: false,
  })

  useEffect(() => {
    if(friendsStatus == 'Loading' && !hasFetched.current.friends){
      hasFetched.current.friends = true;
      async function getFriends(){
      try {
        const response = await axios.get('http://localhost:5000/api/user/getFriends', {withCredentials: true})
        dispatch(addFriends(response.data.data))
      } catch (error) {
        console.log('error: ', error)
        dispatch(errorOnFriends())
      }
    }
    getFriends();
    }
  }, [dispatch, friendsStatus])

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChatId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/getMessages/${selectedChatId}`,
          { withCredentials: true }
        );
        dispatch(addMessagesToChat({ chatId: selectedChatId, messages: res.data.data }));
      } catch (err) {
        console.error("Error fetching chat messages:", err);
      }
    };
    loadMessages();
  }, [selectedChatId, dispatch]);

  useEffect(() => {
    if(currentChatMessages && selectedChat){
      const unreadMessagesIds = currentChatMessages.filter(msg => msg.status === 'delivered').map(msg => msg.id)
      console.log('unreadMessageIds: ', unreadMessagesIds)
      const senderId = selectedChat.users.find(user => user.user._id !== userId)?.user._id
      socketRef.current?.emit('read_ack', {chatId: selectedChat._id, messageIds: unreadMessagesIds, userId: userId, senderId: senderId})
    }
  }, [currentChatMessages, selectedChat, socketRef, userId])


  const handleSendMessage = () => {
    if (!message.trim() || !selectedChatId || !socketRef.current) return;
    if (!isGroupChat && selectedReciever){
      const newMessage = {
        chatId: selectedChatId,
        senderId: userId!,
        content: message,
        recieverId: selectedReciever
      };
      socketRef.current.emit("send-message", newMessage);
      setMessage("");
    }
    else if(isGroupChat){
      const newMessage = {
        chatId: selectedChatId,
        senderId: userId!,
        content: message,
      };
      socketRef.current.emit("send-send_group_message", newMessage);
      setMessage("");
    }
  };

  socketRef.current?.on('isOnlineResponse', ({recieverId, isOnline}) => {
    console.log('response from online: ', recieverId, isOnline)
    if(selectedReciever == recieverId){
      setIsCurrentRecieverOnline(isOnline)
    }
  })

  const handleChatClick = (chat: chatType) => {
    setSelectedChatId(chat._id)
    if (chat.isGroupChat){
      setIsGroupChat(true)
    }else{
      setIsGroupChat(false)
      const recieverId = chat.users.find((userObj => userObj.user._id !== userId))?.user._id
      if(recieverId){
        setSelectedReciever(recieverId)
        socketRef.current?.emit('isOnline', {recieverId: recieverId})
      }
      
    }
  }

  if (initialchatsLoadingStatus === "Loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-400">
        Loading chats...
      </div>
    );
  }

  if (!socketRef.current) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-400">
        Couldn’t connect to server 😔
      </div>
    );
  }

  const initializeChatRoom = async(id: string) => {
    try {
      const response = await axios.get(
          `http://localhost:5000/api/chat/createOneToOneChat/${id}`,
          { withCredentials: true }
      );
      dispatch(addNewChat(response.data.data))
    } catch (error) {
      if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
          alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
      }else {
        alert("There was some Error while initializing your chat room !! - Need to refresh the whole page.. ")
      }
      window.location.reload()
    }
  }

  return (
    <div className="flex h-[85vh] max-w-6xl mx-auto mt-10 bg-gradient-to-br from-[#0f172a] via-[#0a1a1f] to-[#092025] rounded-3xl shadow-lg overflow-hidden backdrop-blur-lg border border-white/10">
      
      {/* LEFT SIDEBAR - Chats List */}
      <div className="w-1/3 border-r border-white/10 overflow-y-auto p-2 backdrop-blur-lg">
        <div className="p-4 text-xl font-semibold text-white/90">Chats</div>
        {chats.length === 0 ? (
          <div>
            <div className="text-gray-400 text-center mt-10">No chats yet.</div>
          </div>
        )
        :
        <>
        {chats.map((chat) => {
          const user = chat.users.find((u) => u.user._id !== userId)?.user;
          return (
            <div
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center gap-3 p-3 mx-3 my-2 rounded-2xl cursor-pointer transition-all ${
                selectedChatId === chat._id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Image
                width={50}
                height={50}
                src={user?.profilePicture || "/profile/default_profile_pic.png"}
                alt="profile"
                className="w-12 h-12 rounded-full border border-white/10"
              />
              <div className="flex-1">
                <div className="text-white font-medium">{user?.username || chat.groupName}</div>
                <div className="text-gray-400 text-sm truncate">
                  {chat.lastMessage?.text || "No messages yet"}
                </div>
              </div>
            </div>
          );
        })}
        </>
        }
        <h1 className="pt-4 border-t-[1px] mt-2 border-t-gray-400">Other friends: </h1>
        {friendsWhoDoesNotHaveChatRoomWithUs.length === 0 && <p className="w-full mt-3 text-center text-gray-400 p-2">You does not have more friends.</p>}
        {friendsWhoDoesNotHaveChatRoomWithUs.map((friend) => (
          <div
            key={friend._id}
            className="flex items-center gap-3 p-3 mx-3 my-2 rounded-2xl border-[1px] border-gray-500 transition-all hover:bg-white/5"
          >
            <Image
              width={50}
              height={50}
              src={friend?.profilePic || "/profile/default_profile_pic.png"}
              alt="profile"
              className="w-12 h-12 rounded-full border border-white/10"
            />
            <div className="flex-1 flex justify-between">
              <div className="flex flex-col gap-1 p-1">
                <div className="text-white font-medium">{friend.username}</div>
                <div className="text-gray-400 text-sm">{friend.name}</div>
              </div>
              <button onClick={() => initializeChatRoom(friend._id)} className="bg-gradient-to-b cursor-pointer p-2 rounded-xl from-[#3f3fb1] to-pink-400 text-white">
                Chat
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* RIGHT SIDE - Selected Chat */}
      <div className="w-2/3 flex flex-col">
        {!selectedChat ? (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a chat to start messaging 💬
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5">
              <Image
                width={50}
                height={50}
                src={
                  selectedChat.users.find((u) => u.user._id !== userId)?.user
                    .profilePicture || "/profile/default_profile_pic.png"
                }
                alt="profile"
                className="w-10 h-10 rounded-full border border-white/10"
              />
              <div>
                <div className="text-white font-semibold">
                  {selectedChat.users.find((u) => u.user._id !== userId)?.user.username ||
                    selectedChat.groupName}
                </div>
                {isCurrentRecieverOnline && <div className="text-xs text-gray-400">Online</div>}
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedChat.messages && selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 max-w-[70%] rounded-2xl text-sm ${
                        msg.senderId === userId
                          ? "bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white"
                          : "bg-white/10 text-gray-100"
                      }`}
                    >
                      {msg.content}
                      <div className="text-[10px] flex justify-end gap-1.5 text-gray-400 text-right mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                          {
                            msg.status === 'sent' && msg.senderId === userId && <span className="text-gray-500 text-sm"><Check/></span>
                          }
                          {
                            msg.status === 'delivered' && msg.senderId === userId && <span className="text-gray-500 text-sm"><CheckCheck/></span>
                          }
                          {
                            msg.status === 'seen' && msg.senderId === userId && <span className="text-blue-500 text-sm"><CheckCheck/></span>
                          }
                        
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center">No messages yet.</div>
              )}
            </div>

            {/* INPUT FIELD */}
            <div className="p-4 border-t border-white/10 flex items-center gap-3 bg-white/5">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border border-white/10 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full hover:scale-105 transition-transform"
              >
                <Send className="text-white w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
