"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "./ChatHook";
import { RootState } from "@/src/lib/store";
import { useSelector, useDispatch } from "react-redux";
import {
  addMessagesToChat,
  addNewChat,
  chatType,
  updateCurrentChat,
} from "@/src/lib/features/chat/ChatSlice";
import axios from "axios";
import { Send, ArrowLeft } from "lucide-react";
import Image from "next/image";
import {
  addFriends,
  errorOnFriends,
} from "@/src/lib/features/tasks/groupTaskSlice";

export default function ChatPage() {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const socketRef = useSocket(userId ?? "");
  const { chats, initialchatsLoadingStatus } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch();
  const [isGroupChat, setIsGroupChat] = useState(false);
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.currentChatId
  );
  const [selectedReciever, setSelectedReciever] = useState<string>("");
  const [message, setMessage] = useState("");
  const friends = useSelector((state: RootState) => state.groupTask.friends);
  const friendsStatus = useSelector(
    (state: RootState) => state.groupTask.friendsStatus
  );
  const [initialMessagesLoadingStatus, setInitialMessagesLoadingStatus] =
    useState(false);
  const [isMobileChatView, setIsMobileChatView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const friendsWhoHaveChatRoomWithUs = chats
    .filter((chat) => !chat.isGroupChat)
    .map((chat) => {
      const foundUser = chat?.users?.find(
        (userDetail) => userDetail?.user?._id !== userId
      );
      return foundUser?.user?._id || null;
    })
    .filter((id): id is string => id !== null);


  const currentChatMessages = chats.find(
    (chat) => chat._id === selectedChatId
  )?.messages;

  const friendsWhoDoesNotHaveChatRoomWithUs = friends.filter(
    (friend) => !friendsWhoHaveChatRoomWithUs.includes(friend._id)
  );
  const [isCurrentRecieverOnline, setIsCurrentRecieverOnline] =
    useState<boolean>(false);

  const selectedChat = chats.find((c) => c._id === selectedChatId);
  const hasFetched = useRef({
    friends: false,
  });

  useEffect(() => {
    if (friendsStatus == "Loading" && !hasFetched.current.friends) {
      hasFetched.current.friends = true;
      async function getFriends() {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getFriends`,
            { withCredentials: true }
          );
          dispatch(addFriends(response.data.data));
        } catch (error) {
          console.log("error: ", error);
          dispatch(errorOnFriends());
        }
      }
      getFriends();
    }
  }, [dispatch, friendsStatus]);

  useEffect(() => {
    const loadMessages = async () => {
      setInitialMessagesLoadingStatus(true);
      if (!selectedChatId) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/getMessages/${selectedChatId}`,
          { withCredentials: true }
        );
        dispatch(
          addMessagesToChat({ chatId: selectedChatId, messages: res.data.data })
        );
      } catch (err) {
        console.error("Error fetching chat messages:", err);
      } finally {
        setInitialMessagesLoadingStatus(false);
      }
    };
    loadMessages();
  }, [selectedChatId, dispatch]);

  const currentChatLength = currentChatMessages?.length;

  useEffect(() => {
    if (currentChatMessages && selectedChat) {
      const unreadMessagesIds = currentChatMessages
        .filter(
          (msg) => msg.status !== "seen" && msg.recieverId === userId
        )
        .map((msg) => msg.id);
      const senderId = selectedChat.users.find(
        (user) => user.user._id !== userId
      )?.user._id;
      if (unreadMessagesIds.length > 0) {
        socketRef.current?.emit("read_ack", {
          chatId: selectedChat._id,
          messageIds: unreadMessagesIds,
          userId: userId,
          senderId: senderId,
        });
      }
    }
  }, [
    currentChatLength,
    currentChatMessages,
    initialMessagesLoadingStatus,
    selectedChat,
    socketRef,
    userId,
  ]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChatId || !socketRef.current) return;
    if (!isGroupChat && selectedReciever) {
      const newMessage = {
        chatId: selectedChatId,
        senderId: userId!,
        content: message,
        recieverId: selectedReciever,
      };
      socketRef.current.emit("send-message", newMessage);
      setMessage("");
    } else if (isGroupChat) {
      const newMessage = {
        chatId: selectedChatId,
        senderId: userId!,
        content: message,
      };
      socketRef.current.emit("send-send_group_message", newMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatMessages]);

  socketRef.current?.on("isOnlineResponse", ({ recieverId, isOnline }) => {
    if (selectedReciever == recieverId) {
      setIsCurrentRecieverOnline(isOnline);
    }
  });

  const handleChatClick = (chat: chatType) => {
    dispatch(updateCurrentChat({ chatId: chat._id }));
    if (chat.isGroupChat) {
      setIsGroupChat(true);
    } else {
      setIsGroupChat(false);
      const recieverId = chat.users.find(
        (userObj) => userObj.user._id !== userId
      )?.user._id;
      if (recieverId) {
        setSelectedReciever(recieverId);
        socketRef.current?.emit("isOnline", { recieverId: recieverId });
      }
    }
    setIsMobileChatView(true);
  };

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

  const initializeChatRoom = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/createOneToOneChat/${id}`,
        { withCredentials: true }
      );
      dispatch(addNewChat(response.data.data));
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(
          `${error.response.data.message}, Therefore need to refresh the whole page !!`
        );
      } else {
        alert(
          "There was some Error while initializing your chat room !! - Need to refresh the whole page.. "
        );
      }
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen w-full px-2 sm:px-4 md:px-7 bg-transparent backdrop-blur-md text-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div
        className={`w-full md:w-1/3 border-r border-white/10 overflow-y-auto p-2 bg-white/5/10 backdrop-blur-xl transition-all duration-300 ${
          isMobileChatView ? "hidden md:block" : "block"
        }`}
      >
        <div className="p-4 text-xl font-semibold text-white/90">Chats</div>
        {chats.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">No chats yet.</div>
        ) : (
          chats.map((chat) => {
            const user = chat.users.find((u) => u.user._id !== userId)?.user;
            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center gap-3 p-3 mx-3 my-2 rounded-2xl cursor-pointer transition-all ${
                  selectedChatId === chat._id
                    ? "bg-gradient-to-r from-[#008064a2] to-[#517fc56a] white/10 backdrop-blur-lg"
                    : "hover:bg-white/5 bg-gradient-to-b from-black/50 to-gray-500/50"
                }`}
              >
                <Image
                  width={50}
                  height={50}
                  src={
                    user?.profilePicture || "/profile/default_profile_pic.jpg"
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {user?.username || chat.groupName}
                  </div>
                  <div className="text-gray-400 text-sm truncate">
                    {chat.lastMessage?.text || "No messages yet"}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <h1 className="pt-4 border-t mt-2 border-t-gray-500 text-gray-300">
          Other friends:
        </h1>
        {friendsWhoDoesNotHaveChatRoomWithUs.length === 0 ? (
          <p className="w-full mt-3 text-center px-2 text-gray-400 p-2">
            You don’t have more friends.
          </p>
        ) : (
          friendsWhoDoesNotHaveChatRoomWithUs.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center gap-3 p-3 mx-3 my-2 rounded-2xl border border-gray-600 hover:bg-white/5 transition-all"
            >
              <Image
                width={50}
                height={50}
                src={
                  friend?.profilePic || "/profile/default_profile_pic.jpg"
                }
                alt="profile"
                className="w-12 h-12 rounded-full border border-white/10"
              />
              <div className="flex-1 flex justify-between">
                <div className="flex flex-col gap-1 p-1">
                  <div className="text-white font-medium">
                    {friend.username}
                  </div>
                  <div className="text-gray-400 text-sm">{friend.name}</div>
                </div>
                <button
                  onClick={() => initializeChatRoom(friend._id)}
                  className="bg-gradient-to-br from-cyan-400 to-blue-500 px-3 py-1.5 rounded-xl text-white hover:opacity-90"
                >
                  Chat
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT CHAT SIDE */}
      <div
        className={`flex flex-col w-full md:w-2/3 transition-all duration-300 ${
          isMobileChatView ? "block" : "hidden md:flex"
        }`}
      >
        {!selectedChat ? (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a chat to start messaging 💬
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center rounded-b-xl mt-0.5 gap-3 p-4 border-b border-white/10 bg-gradient-to-b from-transparent to-white/10 backdrop-blur-lg">
              <button
                onClick={() => setIsMobileChatView(false)}
                className="md:hidden text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Image
                width={50}
                height={50}
                src={
                  selectedChat.users.find(
                    (u) => u.user._id !== userId
                  )?.user.profilePicture ||
                  "/profile/default_profile_pic.jpg"
                }
                alt="profile"
                className="w-10 h-10 rounded-full border border-white/10"
              />
              <div>
                <div className="text-white font-semibold">
                  {selectedChat.users.find(
                    (u) => u.user._id !== userId
                  )?.user.username || selectedChat.groupName}
                </div>
                {isCurrentRecieverOnline && (
                  <div className="text-xs text-green-400">Online</div>
                )}
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 backdrop-blur-md">
              {initialMessagesLoadingStatus ? (
                <div className="w-full flex justify-center items-center text-gray-400 p-3">
                  Loading messages...
                </div>
              ) : selectedChat.messages &&
                selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 max-w-[75%] rounded-2xl text-sm shadow-lg backdrop-blur-xl border border-white/10 ${
                        msg.senderId === userId
                          ? "bg-gradient-to-br from-cyan-400/40 to-blue-500/40 text-white"
                          : "bg-gradient-to-br from-emerald-400/30 to-teal-500/30 text-gray-100"
                      }`}
                    >
                      {msg.content}
                      <div className="text-[10px] flex justify-end gap-1.5 text-gray-300 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center">No messages yet.</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 border-t rounded-xl my-1 border-white/10 flex items-center gap-3 bg-white/10 backdrop-blur-xl">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full hover:opacity-90 transition-all shadow-lg"
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
