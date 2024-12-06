import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SelectFacility.css';

const SelectFacility = ({ userId, onSubmit }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLength, setSelectedLength] = useState('60');
  const [loading, setLoading] = useState(false);

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

  // 查詢可用場地
  const searchAvailableCourts = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // data format: "YYYY-MM-DDThh:mm:ss"
      const selectedDateTime = `${selectedDate}T${selectedTime}:00`;

      const params = {
        clubId: 1,
        startDate: selectedDateTime,
        zoneTypeId: 31,
      };

      const response = await axios.get(
        'https://ocbc-ticket.vercel.app/api/proxy/clientportal2/FacilityBookings/BookFacility/Start',
        {
          params: params,
          withCredentials: true,
        },
      );

      const sessionId = response.headers['cp-book-facility-session-id'];
      const possibleDurations =
        response.data.Data.UsersBookingPossibilities[userId].PossibleDurations;

      const availableCourts = Object.keys(possibleDurations).filter((court) => {
        const info = possibleDurations[court];
        return info[selectedDateTime]?.[String(selectedLength)];
      });

      return { sessionId, availableCourts };
    } catch (error) {
      alert('Error: ' + JSON.stringify(error.message));
      return {}; // 如果有錯誤，返回一個空對象
    } finally {
      setLoading(false);
    }
  };

  // 表單提交處理
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const { availableCourts } = await searchAvailableCourts(e);
    if (availableCourts !== undefined) {
      alert(
        availableCourts.length === 0
          ? '沒有可用場地'
          : `可用場地: ${availableCourts.map((court) => court - 70)}`,
      );
    }
  };

  // 表單提交處理
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { sessionId, availableCourts } = await searchAvailableCourts(e);

    if (availableCourts === undefined) {
      return;
    } else if (availableCourts.length === 0) {
      alert('沒有可用場地');
    } else {
      onSubmit(
        sessionId,
        selectedDate,
        selectedTime,
        selectedLength,
        availableCourts,
      );
    }
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
              <option
                key={hour}
                value={`${hour.toString().padStart(2, '0')}:00`}
              >
                {hour.toString().padStart(2, '0')}:00
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
              className={`length-button ${selectedLength === '60' ? 'active' : ''}`}
              onClick={() => setSelectedLength('60')}
            >
              60 分鐘
            </button>
            <button
              type="button"
              className={`length-button ${selectedLength === '120' ? 'active' : ''}`}
              onClick={() => setSelectedLength('120')}
            >
              120 分鐘
            </button>
          </div>
        </div>
        {/* 提交按鈕 */}
        <div className="form-group buttons-group">
          <button
            type="button"
            disabled={loading}
            className="facility-button"
            onClick={handleSearchSubmit}
          >
            查詢
          </button>
          <button
            type="submit"
            disabled={loading}
            className="facility-button"
            onClick={handleSubmit}
          >
            確定
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelectFacility;
