import React, { useState } from "react";
import Login from './login/Login'; 
import SelectFacility from './book/SelectFacility';

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // 管理當前頁面

  const onSubmitLogin = () => {
    setCurrentPage("selectFacility"); // 切換到選擇場地頁面
  };

  return (
    <>
      {currentPage === "login" && <Login onSubmit={onSubmitLogin} />}
      {currentPage === "selectFacility" && <SelectFacility />}
    </>
  );
}

export default App;
