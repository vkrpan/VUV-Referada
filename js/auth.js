// input za prijavu
// email: ref1@vuv.hr
// password: 123456


$('#Prijava').click(function(event) {

  event.preventDefault();
  var email = $('#email').val();
  var password = $('#password').val();

  console.log(email);
  console.log(password);

  auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {

    window.open('../index.html', '_self');
    var user = userCredential.user;
    console.log(userCredential.user)
    // ...
  })
  .catch((error) => {
    alert(error.message);
    console.log(error.message);
    var errorCode = error.code;
    var errorMessage = error.message;
  });
})

$('#Odjava').click(function(){ 

  
  firebase.auth().signOut().then(() => {
    console.log("uspjesno odjavljen");
  }).catch((error) => {

  });
  
})