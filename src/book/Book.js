import React, { useState } from "react";
import "./Book.css";

const Book = () => {
  const [logs, setLogs] = useState([]); // 狀態用於記錄 log

  // 模擬添加 log 的功能
  const addLog = () => {
    const timestamp = new Date().toLocaleString();
    setLogs((prevLogs) => [...prevLogs, `預約開始於 ${timestamp}`]);
  };

  return (
    <div className="start-booking-container">
      <h1>開始預約</h1>
      <button className="start-button" onClick={addLog}>
        開始預約
      </button>

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
