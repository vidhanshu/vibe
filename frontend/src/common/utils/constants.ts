// export const SOCKET_URL = "ws://localhost:4000";
// export const API_BASE_URL = "http://localhost:4000/api";
// export const SOCKET_URL = "https://vibe-api-tuam.onrender.com";
// export const API_BASE_URL = "https://vibe-api-tuam.onrender.com/api";
export const SOCKET_URL =
  "http://ec2-43-204-102-4.ap-south-1.compute.amazonaws.com:4000";
export const API_BASE_URL =
  "http://ec2-43-204-102-4.ap-south-1.compute.amazonaws.com:4000/api";

export const SOCKET_EVENTS = {
  JOIN_CHAT: "joinChat",
  LEAVE_CHAT: "leaveChat",
  SEND_MESSAGE: "sendMessage",
  RECEIVE_MESSAGE: "receiveMessage",
  UPDATE_MESSAGE: "updateMessage",
  RECEIVE_UPDATED_MESSAGE: "receiveUpdateMessage",
  UNSEND_MESSAGE: "unsendMessage",
  REMOVE_MESSAGE: "removeMessage",
  TYPING: "typing",
  STOP_TYPING: "stopTyping",
  UPDATE_CHAT_LIST: "updateChatList",
  RECEIVE_NOTIFICATION: "receiveNotification",
  NOTIFY: "notify",
};
