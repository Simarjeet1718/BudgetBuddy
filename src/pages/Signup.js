import React from 'react'
import Header from '../components/Header/Header'
import Background from '../components/Background'
import SignupSignin from '../components/SignupSignin/SignupSignin'


function Signup() {
  
  return (
    <div>
      <Header/>
      <Background />
      <div className='wrapper'>
        <SignupSignin/>

      </div>
    </div>
  )
}

export default Signup


