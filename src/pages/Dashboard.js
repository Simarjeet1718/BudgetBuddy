import React, { useEffect } from 'react'
import Header from '../components/Header/Header'
import Background from '../components/Background'
import Cards from '../components/Cards/Card'
import { useState } from 'react'
import Modal from 'antd/es/modal/Modal'
import AddExpenseModal from '../components/Modals/addExpense'
import AddIncomeModal from '../components/Modals/addIncome'
import { Transaction, collection, query } from 'firebase/firestore'
import { toast } from 'react-toastify'
import {app} from '../firebase'
import { getFirestore } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import moment from "moment"
import { getDocs } from 'firebase/firestore'
import TransactionsTable from '../components/TransactionsTable/TransactionsTable'
import NoTransactions from '../components/NoTransaction'
import { Line, Pie } from "@ant-design/charts";
import { Card, Row } from "antd";



const db = getFirestore(app);


function Dashboard() {
  const [user]=useAuthState(auth);
  const[loading,setLoading]=useState(false);
  const [transactions,setTransactions]=useState([]);//this transaction will contain all the docs of a paricular user
  const [isExpenseModalVisible,setIsExpenseModalVisible]=useState(false);
  const [isIncomeModalVisible,setIsIncomeModalVisible]=useState(false);
  const [income,setIncome]=useState(0);
  const [expense,setExpense]=useState(0);
  const [totalbalance,SetTotalBalance]=useState(0);

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance +=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();
 
  const showExpenseModal=()=>{
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal=()=>{
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel=()=>{
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel=()=>{
    setIsIncomeModalVisible(false);
  };


  const onFinish=(values,type)=>{
    
    
    const newTransaction={
      type:type,
      date: (values.date).format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    };
    setTransactions([...transactions, newTransaction]);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
    calculateBalance();

  }
  
  //console.log(user);
  // addtransaction function adds a transaction as a documnet depending on the id
  async function addTransaction(transaction,many){
    
    try{
      const docRef=await addDoc(
        collection(db,`users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID:",docRef.id);
      if(!many)toast.success("Transaction Added");
      //as sooon as transaction is added to the firebase 
      //then our settransaction should alos be updated so that it reflects
      // const newArr=transactions;
      // newArr.push(transaction);
      // setTransactions(newArr);
      // calculateBalance();
    }catch(e){
      console.log("Error adding document",e);
     
       if(!many) toast.error("Could not add transaction")
      
    }
  }

  useEffect(()=>{
      fetchTransactions();
  },[user])

  useEffect(()=>{
     calculateBalance();
  },[transactions]);//transaction is a dependency for this useEffect
  //as soon as the transaction is fetched at that time currenbalance has to be updated
  //therefore call calculatebalance inside this useEffect
function calculateBalance(){
  let incomeTotal=0;
  let expensesTotal=0;

  transactions.forEach((trans)=>{
    if(trans.type==="income"){
      incomeTotal+=trans.amount;
    }
    else{
      expensesTotal+=trans.amount
    }
  });
  setIncome(incomeTotal);
  setExpense(expensesTotal);
  SetTotalBalance(incomeTotal-expensesTotal)
};

async function fetchTransactions(){
  setLoading(true);
   if(user){
    const q=query(collection(db,`users/${user.uid}/transactions`));
    const querySnapshot=await getDocs(q);
    let transactionArray=[];
    querySnapshot.forEach((doc)=>{
      transactionArray.push(doc.data());

    });
    setTransactions(transactionArray);
    console.log(transactionArray)
    toast.success("Transactions Fetched");
   }
   setLoading(false);
}

const balanceConfig = {
  data: balanceData,
  xField: "month",
  yField: "balance",
};

const spendingConfig = {
  data: spendingDataArray,
  angleField: "value",
  colorField: "category",
};

function reset() {
  console.log("resetting");
}

const cardStyle = {
  // boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
  boxShadow:"0px 0px 15px 4px black",
  margin: "2rem",
  borderRadius: "0.5rem",
  minWidth: "400px",
  flex: 1,
};
  return (
    <div className='dashboard-container'>
      <Header />
      <Background/>

      {loading?(
        <p>Loading...</p>
      ):(
      <>
      <Cards showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
      income={income}
      expense={expense}
      balance={totalbalance}/>
      <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          {transactions.length === 0 ? (
            <NoTransactions />
          ) : (
            <>
              <Row gutter={16}>
                <Card bordered={true} style={cardStyle}>
                  <h2>Financial Statistics</h2>
                  <Line {...{ ...balanceConfig, data: balanceData }} />
                </Card>

                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                  <h2>Total Spending</h2>
                  {spendingDataArray.length === 0 ? (
                    <p>Seems like you haven't spent anything till now...</p>
                  ) : (
                    <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
                  )}
                </Card>
              </Row>
            </>
          )}
          
          <TransactionsTable transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}/>
          
          
          </>)}
    </div >
  )
}

export default Dashboard
