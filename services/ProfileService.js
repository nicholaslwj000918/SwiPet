import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {app, db, auth} from './firebaseConfig';

const registerUser = async (user)  => {
    let response = null;

   await createUserWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    const user = userCredential.user;
    
   response = {created: true, user: user, error: null};
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    response= {created: false, user: null, error: error};
  });

  return response;
}

const loginUser = async (userr) => {
    let response = null;
    console.log(userr);
    await signInWithEmailAndPassword(auth, userr.email, userr.password)
  .then((userCredential) => {
    // Signed in 
    let user = userCredential.user;
    response = {isLoggedIn: true, user: user, error: null};
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    response= {isLoggedIn: false, user: null, error: errorMessage};
  });

  return response;

}

export {registerUser, loginUser };