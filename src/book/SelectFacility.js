import React, { useState, useEffect } from "react";
import "./SelectFacility.css";

const SelectFacility = ({onSubmit}) => {
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
    onSubmit();
  };

  return (
    <div className="select-facility-container">
      <h1>選擇場地</h1>
      <p className="current-time">當前時間：{formatDateTime(currentTime)}</p>
      <form className="facility-form">
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
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            className="facility-select"
          >
            {Array.from({ length: 24 }, (_, hour) => (
              <option key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                {hour.toString().padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
        {/* 長度選擇 */}
        <div className="form-group">
          <label htmlFor="length">長度：</label>
          <div className="length-buttons">
            <button
              type="button"
              className={`length-button ${selectedLength === "60" ? "active" : ""}`}
              onClick={() => setSelectedLength("60")}
            >
              60 分鐘
            </button>
            <button
              type="button"
              className={`length-button ${selectedLength === "120" ? "active" : ""}`}
              onClick={() => setSelectedLength("120")}
            >
              120 分鐘
            </button>
          </div>
        </div>
        {/* 提交按鈕 */}
        <div className="form-group buttons-group">
          <button type="button" className="facility-button" onClick={handleSubmit}>
            查詢
          </button>
          <button type="submit" className="facility-button" onClick={handleSubmit}>
            確定
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelectFacility;
