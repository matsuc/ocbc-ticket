import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SelectFacility.css';
import booking from './bookingService';

const SelectFacility = ({ userId, onSubmit }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLength, setSelectedLength] = useState('60');
  const [logs, setLogs] = useState([]); // 用於記錄 log
  const [loading, setLoading] = useState(false);
  const cancelSearchRef = useRef(false);

  // 更新當前時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 格式化時間
  const formatDateTime = (date) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-GB')}`;

  // 查詢可用場地
  const searchAvailableCourts = async () => {
    try {
      // data format: "YYYY-MM-DDThh:mm:ss"
      const selectedDateTime = `${selectedDate}T${selectedTime}:00`;

      const params = {
        clubId: 1,
        startDate: selectedDateTime,
        zoneTypeId: 31,
      };

      const response = await axios.get(
        '/api/clientportal2/FacilityBookings/BookFacility/Start',
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
      cancelSearchRef.current = true;
      setLoading(false);
      return {};
    }
  };

  // 表單提交處理
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLogs((prevLogs) => []);
    cancelSearchRef.current = false;

    let success = false; // 标记是否成功获取到可用场地
    let sessionId;
    let availableCourts;

    while (!success && !cancelSearchRef.current) {
      // 只有在没有成功或者没有取消时继续执行
      const result = await searchAvailableCourts(); // 等待 searchAvailableCourts 完成
      sessionId = result.sessionId;
      availableCourts = result.availableCourts;

      if (availableCourts !== undefined) {
        if (availableCourts.length === 0) {
          setLogs((prevLogs) => [...prevLogs, '沒有可用場地，等待下一次尝试...']);
          await sleep(3000);
        } else if (availableCourts.length > 0) {
          setLogs((prevLogs) => [...prevLogs, '找到可用場地，開始預約...']);
          const selectedDateTime = `${selectedDate}T${selectedTime}:00`;
          const selectedCourt =
            availableCourts[Math.floor(Math.random() * availableCourts.length)];

          const bookingResult = await booking({
            selectedLength,
            selectedDateTime,
            userId,
            selectedCourt,
            sessionId,
            maxRetries: 1,
          });

          success = bookingResult.success;
          if (!success) {
            setLogs((prevLogs) => [...prevLogs, `${bookingResult.message} 等待下一次尝试...`]);
            await sleep(3000);
          } else {
            setLogs((prevLogs) => [
              ...prevLogs,
              {
                message: bookingResult.message,
                link: bookingResult.redirectUrl,
              },
            ]);
          }
        }
      }
    }

    setLoading(false); // 完成搜索或取消后，停止 loading
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

  const handleCancelClick = () => {
    cancelSearchRef.current = true;
    setLoading(false);
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
          {loading && (
            <button
              type="button"
              className="facility-button cancel"
              onClick={handleCancelClick}
            >
              取消
            </button>
          )}
          {!loading && (
            <button
              type="button"
              disabled={loading}
              className={'facility-button'}
              onClick={handleSearchSubmit}
            >
              搶場地
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="facility-button"
            onClick={handleSubmit}
          >
            預約
          </button>
        </div>
      </form>
      <div className="log-container">
        <strong>日誌記錄:</strong>
        <div className="log-box">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                {typeof log === 'string' ? (
                  log
                ) : (
                  <>
                    {log.message}
                    {log.link && (
                      <a
                        href={log.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginLeft: '10px',
                          color: 'blue',
                          textDecoration: 'underline',
                        }}
                      >
                        {log.link}
                      </a>
                    )}
                  </>
                )}
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

export default SelectFacility;
