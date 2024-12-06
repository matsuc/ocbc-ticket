import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Book.css';

const Book = ({
  selectedDate,
  selectedTime,
  selectedLength,
  selectedCourt,
  userId,
  sessionId,
  onReSelectCourt,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false); // 用於記錄是否正在加載
  const [logs, setLogs] = useState([]); // 用於記錄 log

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

  const getDayOfWeek = (date) => {
    const daysOfWeek = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];
    const dayIndex = new Date(date).getDay(); // 0-6, 代表星期天到星期六
    return daysOfWeek[dayIndex];
  };

  const beforeBook = async (e) => {
    e.preventDefault();

    try {
      // data format: "YYYY-MM-DDThh:mm:ss"
      const selectedDateTime = `${selectedDate}T${selectedTime}:00`;

      const payload = {
        Duration: selectedLength,
        RequiredNumberOfSlots: null,
        StartTime: selectedDateTime,
        UserId: userId,
        ZoneId: selectedCourt,
      };

      const response = await axios.post(
        '/api/clientportal2/FacilityBookings/WizardSteps/SetFacilityBookingDetailsWizardStep/Next',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cp-Book-Facility-Session-Id': sessionId,
          },
          withCredentials: true,
        },
      );

      console.log('成功鎖定預約');
      return response.data['Data']['RuleId'];
    } catch (error) {
      setLogs((prevLogs) => [
        ...prevLogs,
        `無法鎖定預約: ${JSON.stringify(error.message)}`,
      ]);
    }
  };

  const booking = async (e, ruleId) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ruleId: ruleId,
        OtherCalendarEventBookedAtRequestedTime: false,
        HasUserRequiredProducts: false,
      };

      const response = await axios.post(
        '/api/clientportal2/FacilityBookings/WizardSteps/ChooseBookingRuleStep/Next',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cp-Book-Facility-Session-Id': sessionId,
          },
          withCredentials: true,
        },
      );

      // alert(JSON.stringify(response.headers));

      // const sessionId = response.headers["Cp-Book-Facility-Session-Id"];
      // alert("Session ID: " + sessionId);
      setLogs((prevLogs) => [...prevLogs, JSON.stringify(response.data)]);
    } catch (error) {
      setLogs((prevLogs) => [
        ...prevLogs,
        `預約失敗: ${JSON.stringify(error.message)}`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 添加 log 的功能
  const handleBookClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    const timestamp = new Date().toLocaleString();
    setLogs((prevLogs) => [...prevLogs, `預約開始於 ${timestamp}`]);

    const ruleId = await beforeBook(e);
    if (ruleId !== undefined) {
      await booking(e, ruleId);
    }

    setLoading(false);
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
          <strong>日期:</strong> {selectedDate} ({getDayOfWeek(selectedDate)})
        </p>
        <p>
          <strong>時間:</strong> {selectedTime}
        </p>
        <p>
          <strong>長度:</strong> {selectedLength} 分鐘
        </p>
        <p>
          <strong>場地:</strong> 場地 {selectedCourt - 70}
        </p>
      </div>

      {/* 開始預約按鈕 */}
      <button className="reselect-button" onClick={handleCourtClick}>
        重新選擇場地
      </button>

      {/* 開始預約按鈕 */}
      <button
        className={`start-button ${loading ? 'cancel' : ''}`}
        onClick={handleBookClick}
      >
        {loading ? '取消' : '開始預約...'}
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
