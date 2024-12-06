import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    if (storedUserId && storedToken) {
      setUserId(storedUserId);
      setToken(storedToken);
      setCurrentPage('selectFacility'); // 如果已有登入資訊，直接跳轉到選擇場地頁面
    }
  }, []);

  const onSubmitLogin = (userId, token) => {
    // 登入後，將用戶信息存入 localStorage
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
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

  const onLogout = () => {
    // 登出時清除 localStorage 中的用戶資訊
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUserId('');
    setToken('');
    setCurrentPage('login'); // 切換到登入頁面
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
