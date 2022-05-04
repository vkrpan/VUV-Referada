(function(){
  firebase.auth().onAuthStateChanged(user => {
      if(user)
      {
          
      }
      else
      {
         var newURL = window.location.origin + "/prijava.html" 
           window.location.replace(newURL);
      }
  });
  
})();