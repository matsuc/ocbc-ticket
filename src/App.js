import React from 'react';
import './App.css';
import Login from './login/Login'; 


const onSubmitLogin = () => {
  alert("Login successful");
}

function App() {
  return (
    <>
      <div className="Login">
        <Login onSubmit={onSubmitLogin}/> {/* 顯示登入頁面 */}
      </div>
      
      <div className="Select">
      </div>
    </>
  );
}

export default App;
