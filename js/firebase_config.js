  const firebaseConfig = {
    apiKey: "AIzaSyB9K5zI6stujyWc1ob89EwO6KCIQSbJNvY",
    authDomain: "referada-vuv.firebaseapp.com",
    databaseURL: "https://referada-vuv-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "referada-vuv",
    storageBucket: "referada-vuv.appspot.com",
    messagingSenderId: "376765175363",
    appId: "1:376765175363:web:a3c9c1a2fd6861694226f6",
    measurementId: "G-54T9H5M2DE"
  };

  firebase.initializeApp(firebaseConfig);

  var oDb = firebase.database();
  var oDbPredmeti = oDb.ref("Predmeti");
  var oDbStudenti = oDb.ref("Studenti");
  var oDbUpisaniPredmeti = oDb.ref("UpisPredmeta");
  var oDbUsers = oDb.ref("Users");
  var auth = firebase.auth();
  