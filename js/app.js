// npm install firebase

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { where } from "firebase/firestore"; 

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOV9acDEI5woJd6j76VXDuU6Fk7bayklk",
  authDomain: "thingsicantsay-b5d80.firebaseapp.com",
  projectId: "thingsicantsay-b5d80",
  storageBucket: "thingsicantsay-b5d80.appspot.com",
  messagingSenderId: "491563539499",
  appId: "1:491563539499:web:89a196a3b84fdf9be91e6e",
  measurementId: "G-7QW9CJPPN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// DOM Elements
const messageContainer = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
const sentContainer = document.getElementById("sent-container");
const searchButton = document.querySelector('#search-bar button');
const searchInput = document.querySelector('#name-search');

// Add event listener for send button
sendButton.addEventListener('click', sendMessage);
// Add event listener for search button
searchButton.addEventListener('click', searchMessages);

// The sendMessage function
async function sendMessage() {
  let inputField = document.getElementById("message-input");
  let nameField = document.getElementById("chat-name");
  let messageContainer = document.getElementById("messages");

  let messageText = inputField.value.trim();
  let chatName = nameField.value.trim();

  // Validation: Check if fields are empty
  if (chatName === "") {
    alert("Please enter a name.");
    nameField.focus();
    return;
  }
  
  if (messageText === "") {
    alert("Please enter a message.");
    inputField.focus();
    return;
  }

  // Create a new message bubble
  let newMessage = document.createElement("div");
  newMessage.classList.add("message", "sent");
  newMessage.textContent = messageText;

  // Append the new message
  messageContainer.appendChild(newMessage);
  messageContainer.scrollTop = messageContainer.scrollHeight;

  // Save message to Firebase Firestore
  try {
    await addDoc(collection(db, 'messages'), {
      to: chatName, // Name it was sent to
      text: messageText, // The message text
      timestamp: serverTimestamp(), // Timestamp
    });

    console.log("Message saved to Firestore");

  } catch (error) {
    console.error("Error saving message", error);
  }

  // Wait 1 second before resetting only the input fields and user messages
  setTimeout(() => {
    inputField.value = "";  // Clear message input
    nameField.value = "";   // Clear name input

    // Remove only dynamically added messages, keeping hardcoded ones
    let messages = document.querySelectorAll(".message.sent");
    messages.forEach((msg, index) => {
      if (index >= 2) msg.remove(); // Keep first two sent messages, remove new ones
    });

  }, 1000); // Delay before resetting
}

// Search messages function
function searchMessages() {
  const searchText = searchInput.value.trim();

  // If no text entered in the search bar, reset and display all messages
  if (searchText === "") {
    displayMessages(); // Call the function to display all messages
    return;
  }

  // Order by timestamp in descending order (newest first)
  const q = query(
    collection(db, "messages"),
    orderBy("timestamp", "desc"),
    where("to", "==", searchText) // Filter messages by the name entered in search bar
  );

// Clear previous unsent messages
const unsentContainer = document.getElementById("unsent-container");
unsentContainer.innerHTML = ""; 

// Fetch the filtered messages
onSnapshot(q, (snapshot) => {
  snapshot.forEach((doc) => {
    const data = doc.data();
    const recipient = data.to;
    const messageText = data.text;

    // Create chat screen
    let chatDiv = document.createElement("div");
    chatDiv.classList.add("iphone-chat");

    // Create header for recipient name
    let headerDiv = document.createElement("div");
    headerDiv.classList.add("chat-header");
    headerDiv.textContent = recipient;

    // Create message container
    let chatBody = document.createElement("div");
    chatBody.classList.add("chat-body");

    // Create message bubble with corrected spacing
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message-box", "sent-message");
    messageDiv.textContent = messageText;

    // Create typing animation on the left
    let typingDiv = document.createElement("div");
    typingDiv.classList.add("typing-animation");

    // Append everything
    chatBody.appendChild(typingDiv);
    chatBody.appendChild(messageDiv);
    chatDiv.appendChild(headerDiv);
    chatDiv.appendChild(chatBody);
    unsentContainer.appendChild(chatDiv);
  });
});
}

// Retrieving sent messages
function displayMessages() {
  const unsentContainer = document.getElementById("unsent-container");
  unsentContainer.innerHTML = ""; // Clear previous messages

  // Order by timestamp in descending order (newest first)
  const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    unsentContainer.innerHTML = ""; // Clear before re-rendering

    snapshot.forEach((doc) => {
      const data = doc.data();
      const recipient = data.to;
      const messageText = data.text;

      // Create chat screen
      let chatDiv = document.createElement("div");
      chatDiv.classList.add("iphone-chat");

      // Create header for recipient name 
      let headerDiv = document.createElement("div");
      headerDiv.classList.add("chat-header");
      headerDiv.textContent = recipient;

      // Create message container
      let chatBody = document.createElement("div");
      chatBody.classList.add("chat-body");

      // Create message bubble with corrected spacing
      let messageDiv = document.createElement("div");
      messageDiv.classList.add("message-box", "sent-message");
      messageDiv.textContent = messageText;

      // Create typing animation on the left
      let typingDiv = document.createElement("div");
      typingDiv.classList.add("typing-animation");

      // Append everything
      chatBody.appendChild(typingDiv);
      chatBody.appendChild(messageDiv);
      chatDiv.appendChild(headerDiv);
      chatDiv.appendChild(chatBody);
      unsentContainer.appendChild(chatDiv);
    });
  });
}

// Call function to start displaying messages
displayMessages();


// npm run start