import React, { useState } from "react";
import Login from './login/Login'; 
import SelectFacility from './book/SelectFacility';
import ConfirmSelection from "./book/ConfirmSelection";
import Book from "./book/Book";

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // 管理當前頁面
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLength, setSelectedLength] = useState("60");
  const [availableCourts, setAvailableCourts] = useState([]);

  const onSubmitLogin = (userId, token) => {
    setUserId(userId);
    setToken(token);
    setCurrentPage("selectFacility"); // 切換到選擇場地頁面
  };

  const onSubmitSelectFacility = (selectedDate, selectedTime, selectedLength, availableCourts) => {
    setCurrentPage("confirmSelection"); // 切換到確認預約頁面
    setSelectedDate(selectedDate);
    setSelectedTime(selectedTime);
    setSelectedLength(selectedLength);
    setAvailableCourts(availableCourts);
  }

  const onConfirmSelection = () => {
    setCurrentPage("book"); // 切換到開始預約頁面
  }

  const onReSelectCourt = () => {
    setCurrentPage("selectFacility"); // 切換到選擇場地頁面
  }

  return (
    <>
      {currentPage === "login" && <Login onSubmit={onSubmitLogin} />}
      {currentPage === "selectFacility" && <SelectFacility userId={userId} onSubmit={onSubmitSelectFacility} />}
      {currentPage === "confirmSelection" && <
        ConfirmSelection 
        selectedDate={selectedDate}
        selectedTime={selectedTime} 
        selectedLength={selectedLength} 
        availableCourts={availableCourts} 
        onConfirm={onConfirmSelection}
        onCancel={() => setCurrentPage("selectFacility")}
      />}
      {currentPage === "book" && <Book onReSelectCourt={onReSelectCourt}/>}
    </>
  );
}

export default App;
