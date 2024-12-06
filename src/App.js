import React, { useState } from 'react';
import Login from './login/Login';
import SelectFacility from './book/SelectFacility';
import ConfirmSelection from './book/ConfirmSelection';
import Book from './book/Book';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 管理當前頁面
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState(''); // 用於記錄登入後的 token (未使用)
  const [sessionId, setSessionId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLength, setSelectedLength] = useState('60');
  const [availableCourts, setAvailableCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');

  const onSubmitLogin = (userId, token) => {
    setUserId(userId);
    setToken(token);
    setCurrentPage('selectFacility'); // 切換到選擇場地頁面
  };

  const onSubmitSelectFacility = (
    sessionId,
    selectedDate,
    selectedTime,
    selectedLength,
    availableCourts,
  ) => {
    setCurrentPage('confirmSelection'); // 切換到確認預約頁面
    setSelectedDate(selectedDate);
    setSelectedTime(selectedTime);
    setSelectedLength(selectedLength);
    setAvailableCourts(availableCourts);
    setSessionId(sessionId);
  };

  const onConfirmSelection = (selectedCourt) => {
    // 如果 selectedCourt 已經選擇，直接設置
    if (selectedCourt) {
      setSelectedCourt(selectedCourt);
    } else {
      // 如果沒有 selectedCourt，從 availableCourts 隨機選擇一個
      const randomCourt =
        availableCourts[Math.floor(Math.random() * availableCourts.length)];
      setSelectedCourt(randomCourt);
    }

    setCurrentPage('book'); // 切換到開始預約頁面
  };

  const onReSelectCourt = () => {
    setCurrentPage('selectFacility'); // 切換到選擇場地頁面
  };

  return (
    <>
      {currentPage === 'login' && <Login onSubmit={onSubmitLogin} />}
      {currentPage === 'selectFacility' && (
        <SelectFacility userId={userId} onSubmit={onSubmitSelectFacility} />
      )}
      {currentPage === 'confirmSelection' && (
        <ConfirmSelection
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedLength={selectedLength}
          availableCourts={availableCourts}
          sessionId={sessionId}
          onConfirm={onConfirmSelection}
          onCancel={() => setCurrentPage('selectFacility')}
        />
      )}
      {currentPage === 'book' && (
        <Book
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedLength={selectedLength}
          selectedCourt={selectedCourt}
          userId={userId}
          sessionId={sessionId}
          onReSelectCourt={onReSelectCourt}
        />
      )}
    </>
  );
}

export default App;
