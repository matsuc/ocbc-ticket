import React, { useState } from "react";
import Login from './login/Login'; 
import SelectFacility from './book/SelectFacility';
import Book from "./book/Book";

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // 管理當前頁面

  const onSubmitLogin = () => {
    setCurrentPage("selectFacility"); // 切換到選擇場地頁面
  };

  const onSubmitSelectFacility = () => {
    setCurrentPage("book"); // 切換到開始預約頁面
  }

  return (
    <>
      {currentPage === "login" && <Login onSubmit={onSubmitLogin} />}
      {currentPage === "selectFacility" && <SelectFacility onSubmit={onSubmitSelectFacility} />}
      {currentPage === "book" && <Book />}
    </>
  );
}

export default App;
