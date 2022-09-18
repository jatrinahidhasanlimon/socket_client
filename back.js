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