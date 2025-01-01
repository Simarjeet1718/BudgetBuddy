import React, { useState } from 'react'
import './SignupSignin.css'
import {app} from '../../firebase'
import Input from '../Input/Input'
import Button from '../Button/Button';
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "firebase/auth";
import {  doc , setDoc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider ,signInWithPopup } from "firebase/auth";



const auth = getAuth();
const db = getFirestore(app);
const provider = new GoogleAuthProvider();


function SignupSignin() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmpassword,setConfirmPassword]=useState("");
  const [loading,setLoading]= useState(false);
  const [loginform,setLoginForm]=useState(false);
  const navigate=useNavigate();//present in react router dom
  

  //loading wala state to make sure that jab ek baar sign in ka option me cick ho vhuka hai tab wapas 
  //baar baar click na ho

  const createUserDocument = async (user) => {
    setLoading(true);
    
    if (!user) return;

    
        
        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists()) {
          const { displayName, email, photoURL } = user;
          const createdAt = new Date();
    
          try {
            await setDoc(userRef, {
              name: displayName ? displayName : name,
              email,
              photoURL: photoURL ? photoURL : "",
              createdAt,
            });
            toast.success("Account Created!");
            setLoading(false);
          } catch (error) {
            toast.error(error.message);
            console.error("Error creating user document: ", error);
            setLoading(false);
          }
        }
        else{
          // toast.error("Account Already Exists");
        }
      };
    

      const signUpWithEmail = async (e) => {
        e.preventDefault();
        if(name!=="" && password!=="" && confirmpassword!==""){
          setLoading(true);
          if(password===confirmpassword){
            try {
              const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
              );
              
              const user = result.user;
              await createUserDocument(user);
              toast.success("Successfully Signed Up!");
              setLoading(false);
              setName("");
              setPassword("");
              setConfirmPassword("");
              setEmail("");
              navigate("/dashboard");
            } catch (error) {
              toast.error(error.message);
              setLoading(false);
            }
          }
          else{
            toast.error("Password And Confirm Password Do Not Match")
          }
          }
          
        else{
          toast.error("All Fields Are Mandatory")
        }
        
      };
  
  function signUpWithGoogle() {
        setLoading(true);
        
        try{
          signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    
    toast.success("User Authenticated!")
    createUserDocument(user);
    setLoading(false);
    navigate('/dashboard');
  }).catch((error) => {
    // Handle Errors here
    
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
    setLoading(false);
    
    const email = error.customData.email;
    
    const credential = GoogleAuthProvider.credentialFromError(error);

    // ...
  });

  } catch(error){
    toast.error(error.message);
    setLoading(false);

  }
        
};
  function loginUsingEmail(){
    setLoading(true);
    if(email!=="" && password!=="" ){
      signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("Successful Login");
    setLoading(false);
    setEmail("");
    setPassword("");
    navigate('/dashboard')
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false);
  });
    }
    else{
      toast.error("All Fields Are Mandatory");
      setLoading(false);
    }
    


  };
  return (
    <>
    {loginform? (
    <div className='signup-wrapper'>
      <h2 className='title1'>Login On <span style={{color:"var(--xyz2)"}}>BudgetBuddy</span>
      </h2>
      <form>
        
        <Input label={"Email"}
        type={"email"} 
        state={email}
        setState={setEmail}
        placeholder={'Enter Your Email'}/>
        <Input label={"Password"}
        type={"password"} 
        state={password}
        setState={setPassword}
        placeholder={'Enter Password'}/>
        
         <Button 
         disabled={loading}
         text={loading?'Loading':"Login Using Email and Password"} onClick={loginUsingEmail} />
         <p className='p-login'>
          <span style={{color:"whitesmoke"}}>Or</span>
         </p>
        <Button text={loading?'Loading':'Login Using Google'} flag={true} onClick={signUpWithGoogle} />
        <p className='p-login' 
        style={{cursor:"pointer"}}
        onClick={()=>setLoginForm(!loginform)}>Don't Have An Account?
          Click Here
        </p>
      </form>
    </div> 
    ):(
    <div className='signup-wrapper'>
    <h2 className='title1'>Sign Up on <span style={{color:"var(--xyz2)"}}>BudgetBuddy</span>
    </h2>
    <form>
      <Input label={"Full Name"} state={name}
      setState={setName}
      placeholder={'Enter Name'}/>
      <Input label={"Email"}
      type={"email"} 
      state={email}
      setState={setEmail}
      placeholder={'Enter Email ID'}/>
      <Input label={"Password"}
      type={"password"} 
      state={password}
      setState={setPassword}
      placeholder={'Enter Password'}/>
      <Input label={"Confirm Password"}
      type={"password"} 
       state={confirmpassword}
      setState={setConfirmPassword}
      placeholder={'Enter Confirm Password'}/>

       <Button 
       disabled={loading}
       text={loading?'Loading':"Sign Up Using Email and Password"} onClick={signUpWithEmail} />
       <p className='p-login'>
        <span style={{color:"whitesmoke"}}>Or</span>
       </p>
      <Button text={loading?'Loading':'Sign Up Using Google'} flag={true} onClick={signUpWithGoogle} />

      <p className='p-login' 
      style={{cursor:"pointer"}} onClick={()=>setLoginForm(!loginform)}>Or Have An Account Already?
        Click Here
      </p>
    </form>
  </div>)}
    
</>
  )
}

export default SignupSignin;
