import React, { useState, useEffect } from "react";
import "./SelectFacility.css";

const SelectFacility = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLength, setSelectedLength] = useState("60");

  // 更新當前時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化時間
  const formatDateTime = (date) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString("en-GB")}`;

  // 表單提交處理
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `您已選擇：\n日期：${selectedDate}\n時間：${selectedTime}\n長度：${selectedLength} 分鐘`
    );
  };

  return (
    <div className="select-facility-container">
      <h1>選擇場地</h1>
      <p className="current-time">當前時間：{formatDateTime(currentTime)}</p>
      <form className="facility-form" onSubmit={handleSubmit}>
        {/* 日期選擇 */}
        <div className="form-group">
          <label htmlFor="date">日期：</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            className="facility-input"
          />
        </div>
        {/* 時間選擇 */}
        <div className="form-group">
          <label htmlFor="time">時間：</label>
          <input
            id="time"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            className="facility-input"
          />
        </div>
        {/* 長度選擇 */}
        <div className="form-group">
          <label htmlFor="length">長度：</label>
          <select
            id="length"
            value={selectedLength}
            onChange={(e) => setSelectedLength(e.target.value)}
            className="facility-select"
          >
            <option value="60">60 分鐘</option>
            <option value="120">120 分鐘</option>
          </select>
        </div>
        {/* 提交按鈕 */}
        <button type="submit" className="facility-button">
          確定
        </button>
      </form>
    </div>
  );
};

export default SelectFacility;
