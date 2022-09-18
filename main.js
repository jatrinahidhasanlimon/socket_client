// console.clear();
const chatMainContainer= document.getElementById("chatMainContainer");
const loginMainContainer = document.getElementById("loginMainContainer");
const validationMessageElem = document.getElementById("validationMessage");

const navBarElem = document.getElementById("nav_bar");

const userNameElem = document.getElementById("username");
const bookingIDElem = document.getElementById("booking_id");
const userIDElem = document.getElementById("userid");
const avatarUrlElem = document.getElementById("avata_url");
const loggedUserNamelElem = document.getElementById("logged_user_name");
const loggedBookingIDlElem = document.getElementById("logged_booking_id");


const text = document.querySelectorAll(".text");
const message = document.querySelector(".message");
const chatContainer = document.querySelector(".chat-texts");
const sendMessage = document.querySelector(".send-message-button");

let storageUserObject = JSON.parse(window.localStorage.getItem('user'))







function clearLocalStorage(){
  localStorage.clear();
  loginMainContainer.classList.remove('d-none')
  chatMainContainer.classList.add('d-none')
  navBarElem.classList.add('d-none')
}
function setIntoLocalStorage(){
  window.localStorage.setItem('user', JSON.stringify({
    userID: userIDElem.value,
    bookingID: bookingIDElem.value,
    userName: userNameElem.value,
    avatarUrl: avatarUrlElem.value,
  }));
  navBarElem.classList.remove('d-none')
  storageUserObject = JSON.parse(window.localStorage.getItem('user'))

}

if(storageUserObject){
  if(storageUserObject  && Object.keys(storageUserObject).length >  0){
      console.log( 'Storage user exist')
      loginMainContainer.classList.add('d-none')
      chatMainContainer.classList.remove('d-none')
      navBarElem.classList.remove('d-none')
      startChat()
      console.log('Storage object in if', storageUserObject)
      loggedUserNamelElem.innerText = storageUserObject.userName;
      loggedBookingIDlElem.textContent += storageUserObject.bookingID;


      /// 
      const socket = io("http://192.168.10.209:3000",{
        auth: {
          token: "abcdefghij",
          data: {
            userID: storageUserObject.userID,
            bookingID: storageUserObject.bookingID,
            userName: storageUserObject.userName,
          
          }
        }
      });
  socket.on("connect", () => {
    console.log(socket.connected); // true
    socket.emit('adduser', {
      user: {
        userID: storageUserObject.userID,
        userName: storageUserObject.userName,
        avatarUrl: avatarUrlElem.value,
      },
      bookingID: storageUserObject.bookingID
    });
  });
  socket.on("newMessage", (response) => {
    console.log('response is', response); 
  });
  
  
  socket.on("aNewChatMessageReceived", (data) => {
    console.log('Called aNewChatMessageReceived')
    console.log('chat text is', data); 
    appendChatText(data)
  });
  socket.on("connect_error", (err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
    console.log(err.data); // { content: "Please retry later" }
  });
  socket.on("private", (data) => {
    console.log('private event')
    console.log('room text is', data); 
    window.localStorage.setItem('room', data.roomID);
    if(data.messageHistory.length > 0){
      console.log('Message History Exist. ')
      data.messageHistory.forEach((element, index, array) => {
        console.log(element); 
        appendChatText(element)
    });
    }
  });



  startChat()
  }
  //
  
  
}







console.log('Storage data are: ', storageUserObject.userName)
function startChat(){
  validationMessageElem.innerHTML = "";
  if(userIDElem.value && bookingIDElem.value){
    setIntoLocalStorage()
    validationMessageElem.innerHTML = "";
    loginMainContainer.classList.add("d-none");
    chatMainContainer.classList.remove("d-none");
    console.log('Start chat From Console log: ', storageUserObject.userName)
    loggedUserNamelElem.textContent = storageUserObject.userName;
    loggedBookingIDlElem.textContent = storageUserObject.bookingID;
    //
    socket.emit('adduser', {
      user: {
        userID: storageUserObject.userID,
        userName: storageUserObject.userName,
        avatarUrl: avatarUrlElem.value,
      },
      bookingID: storageUserObject.bookingID
    });
  }

} // end of start chat




  






sendMessage.addEventListener("click", (e)=> {
  console.log('Cliecked value')
  if(message.value){
    let text = document.createElement("div");
    let profilePicContainer = document.createElement("div");
    let pic = document.createElement("img");
    let textContent = document.createElement("div");
    let timeStamp = document.createElement("span");
    let name = document.createElement("h5");
    
    // okay 
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes() + "";
    let time = `${hours}:${minutes.padStart(2, "0")}`;

    name.innerText = storageUserObject.userName;
    timeStamp.classList.add("timestamp");
    timeStamp.innerText = time;
    textContent.classList.add("text-content");
    textContent.appendChild(name);
    textContent.append(message.value);
    textContent.appendChild(timeStamp);
    // pic.setAttribute("src", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80");
    pic.setAttribute("src", avatarUrlElem.value);
    text.classList.add("text");
    text.classList.add("sent");
    profilePicContainer.classList.add("profile-pic");
    profilePicContainer.appendChild(pic);
    text.appendChild(profilePicContainer);
    text.appendChild(textContent);
    chatContainer.appendChild(text);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    // for socket 
    console.log('local storage room details: ', window.localStorage.getItem('room'))
    socket.emit('createMessageOnRoom', {
      message: message.value,
      roomID: window.localStorage.getItem('room')
    });
    // for socket 
    message.value = "";
  }
  
  
});





function appendChatText (data){
  let text = document.createElement("div");
  let profilePicContainer = document.createElement("div");
  let pic = document.createElement("img");
  let textContent = document.createElement("div");
  let timeStamp = document.createElement("span");
  let name = document.createElement("h5");
  // okay 
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes() + "";
  let time = `${hours}:${minutes.padStart(2, "0")}`;

  name.innerText = data.sender ? data.sender.userName : ''
  timeStamp.classList.add("timestamp");
  timeStamp.innerText = time;
  textContent.classList.add("text-content");
  textContent.appendChild(name);
  textContent.append(data.message);
  textContent.appendChild(timeStamp);
  // pic.setAttribute("src", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80");
  pic.setAttribute("src", data.sender ? data.sender.avatarUrl : '');
  text.classList.add("text");
  if( data.sender.userID == storageUserObject.userID){
      text.classList.add("sent");
  }
  profilePicContainer.classList.add("profile-pic");
  profilePicContainer.appendChild(pic);
  text.appendChild(profilePicContainer);
  text.appendChild(textContent);
  chatContainer.appendChild(text);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}













/*
let delay = 0;
text.forEach(el=>{
  el.style.animation = "fade-in 1s ease forwards";
  el.style.animationDelay= delay +"s";
  delay += 0.33;
});
*/









