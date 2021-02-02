const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');


// Get username and room from the url
const {username,room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true
})

const socket = io();
// Join chat room
socket.emit('joinRoom',{username,room})

// Get room and users
socket.on('roomUsers',({room,users})=>{
      console.log('hie'+users);
      outputRoomName(room);
      outputUsers(users);
})

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text from the user
  const msg = document.getElementById("msg").value; //or we can do--> const msg = e.target.element.msg.value;
  // console.log(msg);

  // Emit message to server
  socket.emit("chatMessage", msg);

  //  clear input
  document.getElementById('msg').value = " ";
  document.getElementById('msg').focus();
});

//  Output Message
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;  
  document.querySelector(".chat-messages").appendChild(div);
}

// Get Room name to dom
function outputRoomName(room){
  roomName.innerText = room
}

// Get Users name to dom
function outputUsers(users){
  usersList.innerHTML = `${users.map(user =>`<li>${user.username}</li>`).join(' ')}`
}
