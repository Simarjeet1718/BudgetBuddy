import React from 'react'
import './Card.css'
import { Card, Col, Row } from 'antd';
import Button from '../Button/Button'

function Cards({showExpenseModal,showIncomeModal,income,expense,balance}) {
    
  return (
    <div >
      <Row  className='my-row' >
    
      <Card  bordered={true} className='cardtitle'>
        <h2>Current Balance</h2>
        <p>₹{balance}</p>
        <Button text="Reset Balance" flag={true}/>
      </Card>
      <Card bordered={true} className='cardtitle'>
        <h2>Total Balance</h2>
        <p>₹{income}</p>
        <Button text="Add Income" flag={true} onClick={showIncomeModal}/>
      </Card>
      <Card bordered={true} className='cardtitle'>
        <h2>Total Expenses</h2>
        <p>₹{expense}</p>
        <Button text="Add Expense" flag={true} onClick={showExpenseModal}/>
      </Card>
   
    
  </Row>
    </div>
  )
}

export default Cards

