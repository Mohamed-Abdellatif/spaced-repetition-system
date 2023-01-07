import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLzv0JpUUtahk7z1hlu8gkwKMQzdETQKI",
  authDomain: "spaced-repetition-system-216c7.firebaseapp.com",
  projectId: "spaced-repetition-system-216c7",
  storageBucket: "spaced-repetition-system-216c7.appspot.com",
  messagingSenderId: "546063263217",
  appId: "1:546063263217:web:567019fce9de2248fb9050",
};

// eslint-disable-next-line
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth,googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async(userAuth,additionalInfo) => {
    if(!userAuth) return;
    const userDocRef= doc(db,'users', userAuth.uid);
    

    const userSnapshot = await getDoc(userDocRef);
    

    if (!userSnapshot.exists()){
        const {displayName, email} = userAuth;
        const createdAt = new Date();
        try{
            await setDoc(userDocRef,{
                displayName,
                email,
                createdAt,
                ...additionalInfo
            })
        }catch(err){
            console.log(err)
        }
    }
}

export const createAuthUserWithEmailAndPassword= async(email,password)=>{
    if(!email || !password)return;
    return await createUserWithEmailAndPassword(auth,email,password)
}

export const signInAuthUserWithEmailAndPassword= async(email,password)=>{
    if(!email || !password)return;
    return await signInWithEmailAndPassword(auth,email,password)
}


export const signOutUser = async() => await signOut(auth)




