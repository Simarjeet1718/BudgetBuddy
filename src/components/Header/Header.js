import React, { useEffect } from 'react'
import '../Header/Header.css'
import Background from '../Background';
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import app from '../../firebase'
import userSvg from '../../assets/user.svg'

const auth = getAuth();
   
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user){
      navigate('/dashboard')
    }
    else{
      navigate('/');
    }

  },[user,loading]);

  function logout() {
    auth.signOut();
    navigate("/");
  }
  return (
    <div className="navbar">
      <p className="navbar-heading">BudgetBuddy.</p>
      {user ? (
      <div className='left'>
        <p className="navbar-link" onClick={logout}>
          <span style={{ marginRight: "0.5rem" }}>
            <img
              src={user.photoURL ? user.photoURL : userSvg}
             width={user.photoURL ? "32" : "24"}
              style={{ borderRadius: "20%" ,height:"2rem", width:"2rem",paddingTop:"4px"}}
              alt='userimage'
            />
          </span>
        <span className='logout'>Logout</span> 
        </p>
        </div>) 
      : (
        <></>
      )}
    </div>
    
    
  )
}

export default Header
