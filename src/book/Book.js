import React, { useState, useEffect } from 'react';
import './Book.css';

const Book = ({ onReSelectCourt }) => {
  const [logs, setLogs] = useState([]); // 用於記錄 log
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('2024-12-09'); // 默認選擇的日期
  const [selectedTime, setSelectedTime] = useState('07:00'); // 默認選擇的時間
  const [selectedLength, setSelectedLength] = useState(60); // 默認選擇的長度
  const [selectedCourt, setSelectedCourt] = useState('1'); // 用於記錄選擇的場地

  // 更新當前時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化時間
  const formatDateTime = (date) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-GB')}`;

  // 添加 log 的功能
  const handleBookClick = () => {
    const timestamp = new Date().toLocaleString();
    setLogs((prevLogs) => [...prevLogs, `預約開始於 ${timestamp}`]);
  };

  const handleCourtClick = () => {
    onReSelectCourt();
  };

  return (
    <div className="start-booking-container">
      <h1>開始預約</h1>

      <p className="current-time">當前時間：{formatDateTime(currentTime)}</p>

      {/* 顯示選擇的日期、時間、長度和場地 */}
      <div className="selection-details">
        <p>
          <strong>日期:</strong> {selectedDate}
        </p>
        <p>
          <strong>時間:</strong> {selectedTime}
        </p>
        <p>
          <strong>長度:</strong> {selectedLength} 分鐘
        </p>
        <p>
          <strong>場地:</strong> 場地 {selectedCourt}
        </p>
      </div>

      {/* 開始預約按鈕 */}
      <button className="reselect-button" onClick={handleCourtClick}>
        重新選擇場地
      </button>

      {/* 開始預約按鈕 */}
      <button className="start-button" onClick={handleBookClick}>
        開始預約
      </button>

      {/* 顯示日誌記錄 */}
      <div className="log-container">
        <h2>日誌記錄</h2>
        <div className="log-box">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                {log}
              </div>
            ))
          ) : (
            <p>目前沒有日誌記錄。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
