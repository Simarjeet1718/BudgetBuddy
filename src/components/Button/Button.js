import React from 'react'
import './Button.css'

function Button({text,onClick,flag,disabled}) {
  return (
    <div className= {flag?'btn btn-flag' :'btn'} onClick={onClick}
    disabled={disabled}>
      {text}
      
    </div>
  )
}

export default Button
