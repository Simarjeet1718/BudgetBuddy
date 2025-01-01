import React from 'react'
import bg from '../assets/backgroundimage.jpg'
import './Background.css'
import image from '../assets/background2.jpg'

function Background() {
  return (
    <div className='background-image'>
      <img src={image} alt='background' />
    </div>
  )
}

export default Background
