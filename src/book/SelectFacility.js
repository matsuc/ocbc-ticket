import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SelectFacility.css";

const SelectFacility = ({userId, onSubmit}) => {
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
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      // data format: "YYYY-MM-DDThh:mm:ss"
      const selectedDateTime = `${selectedDate}T${selectedTime}:00`;

      const params = {
        "clubId": 1,
        "startDate": selectedDateTime,
        "zoneTypeId": 31
      };

      const response = await axios.get("/api/clientportal2/FacilityBookings/BookFacility/Start", {
        params: params,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      alert(JSON.stringify(response.headers));

      // const sessionId = response.headers["Cp-Book-Facility-Session-Id"];
      // alert("Session ID: " + sessionId);
      const possibleDurations = response.data.Data.UsersBookingPossibilities[userId].PossibleDurations;
      alert("可用時長: " + JSON.stringify(possibleDurations));
      const availableCourts = Object.keys(possibleDurations).filter(court => {
        const info = possibleDurations[court];
        return info[selectedDate]?.includes(String(selectedLength));
      });
  
      console.log("可用場地:", availableCourts);

    } catch (error) {
      alert("Error: " + JSON.stringify(error));
    }
  };

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
          <button type="button" className="facility-button" onClick={handleSearchSubmit}>
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
