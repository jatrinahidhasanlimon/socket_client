// console.clear();
const chatMainContainer= document.getElementById("chatMainContainer");
const loginMainContainer = document.getElementById("loginMainContainer");

const validationMessageElem = document.getElementById("validationMessage");


const userNameElem = document.getElementById("username");
const bookingIDElem = document.getElementById("booking_id");
const userIDElem = document.getElementById("userid");
const avatarUrlElem = document.getElementById("avata_url");
const loggedUserNamelElem = document.getElementById("logged_user_name");
const loggedBookingIDlElem = document.getElementById("logged_booking_id");


function checkAuth(){
  var url = 'http://localhost:7000/rental/start-chat';
  
  // Making our request 
  fetch(url, {
     method: 'POST' ,
     body: JSON.stringify({
      userName: 'userbane',
      bookingID: 'booking9000'
    }),
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
})
      .then(Result => Result.json())
      .then(string => {
          // Printing our response 
          console.log(string);
      })
      .catch(errorMsg => { console.log(errorMsg); });
}

function showLoginToggle(){
  if(loginMainContainer.classList.contains('d-none')){
      loginMainContainer.classList.remove('d-none')
    }
    else{
    loginMainContainer.classList.add('d-none')
    }
}

function startChat(){
  // checkAuth()
  validationMessageElem.innerHTML = "";
  console.log('username is: ', userNameElem.value)
  console.log('bookingID is: ', bookingIDElem.value)
  if(userNameElem.value && bookingIDElem.value){
  // if(userNameElem){
    validationMessageElem.innerHTML = "";
    loginMainContainer.classList.add("d-none");
    chatMainContainer.classList.remove("d-none");
    loggedUserNamelElem.textContent += userNameElem.value;
    loggedBookingIDlElem.textContent += bookingIDElem.value;
    //
    const userDetails = {
      userID: userIDElem.value,
      bookingID: bookingIDElem.value,
      userName: userNameElem.value,
      avatarUrl: avatarUrlElem.value,
    }
    
    const socket = io("http://localhost:3000",{
      auth: {
        token: "abcdefghij",
        data: userDetails
      }
    });
    
    socket.on("connect", () => {
      console.log(socket.connected); // true
    });
    socket.emit('adduser', {
      user: {
        userID: userIDElem.value,
        userName: userNameElem.value,
        avatarUrl: avatarUrlElem.value,
      },
      bookingID: bookingIDElem.value
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
      }
      
    });

    sendMessage.addEventListener("click", (e)=> {
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
    
        name.innerText = userNameElem.value;
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

  }else{
    validationMessageElem.innerHTML += 
    "<h6 class='text-danger'>Please Enter Username, Userid, avatar url and Booking ID</h6>";
  }
  

}






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

  name.innerText = data.sender.userName;
  timeStamp.classList.add("timestamp");
  timeStamp.innerText = time;
  textContent.classList.add("text-content");
  textContent.appendChild(name);
  textContent.append(data.message);
  textContent.appendChild(timeStamp);
  // pic.setAttribute("src", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80");
  pic.setAttribute("src", data.sender.avatarUrl);
  text.classList.add("text");
  profilePicContainer.classList.add("profile-pic");
  profilePicContainer.appendChild(pic);
  text.appendChild(profilePicContainer);
  text.appendChild(textContent);
  chatContainer.appendChild(text);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}










const text = document.querySelectorAll(".text");
const message = document.querySelector(".message");
const chatContainer = document.querySelector(".chat-texts");
const sendMessage = document.querySelector(".send-message-button");


/*
let delay = 0;
text.forEach(el=>{
  el.style.animation = "fade-in 1s ease forwards";
  el.style.animationDelay= delay +"s";
  delay += 0.33;
});
*/









