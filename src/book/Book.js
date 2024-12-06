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
  const [timeoutId, setTimeoutId] = useState(null); // 用来存储 setTimeout 的返回值
  const [logs, setLogs] = useState([]); // 用於記錄 log

  const [targetMinute, setTargetMinute] = useState(59); // 目标分钟数
  const [targetSecond, setTargetSecond] = useState(55); // 目标秒数
  // data format: "YYYY-MM-DDThh:mm:ss"
  const selectedDateTime = `${selectedDate}T${selectedTime}:00`;
  const maxRetries = 20; // 最大重试次数

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

    let attempt = 0; // 当前尝试次数
    let success = false; // 标记是否成功

    while (attempt < maxRetries && !success) {
      try {
        attempt++;
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

        // 记录成功响应并退出重试
        setLogs((prevLogs) => [
          ...prevLogs,
          `${new Date().toLocaleString()} 預約成功: ${response.data['Redirect']}`,
        ]);
        success = true;
      } catch (error) {
        // 如果是最后一次失败，记录错误信息
        if (attempt === maxRetries) {
          setLogs((prevLogs) => [
            ...prevLogs,
            `${new Date().toLocaleString()} 預約失敗: ${JSON.stringify(error.message)}`,
          ]);
        } else {
          // 不是最后一次失败，记录重试日志
          const currentAttempt = attempt;
          setLogs((prevLogs) => [
            ...prevLogs,
            `${new Date().toLocaleString()} 預約失敗 (第${currentAttempt}次重試): ${JSON.stringify(error.message)}`,
          ]);
        }
      }
    }
  };

  const waitUntil = () => {
    // 获取当前时间
    const currentTime = new Date();

    const currentYear = currentTime.getFullYear();
    const currentMonth = (currentTime.getMonth() + 1)
      .toString()
      .padStart(2, '0'); // 确保月份是两位数
    const currentDate = currentTime.getDate().toString().padStart(2, '0'); // 确保日期是两位数

    // 将目标时间字符串与当前日期结合，创建目标时间的 Date 对象
    const targetTime = new Date(
      `${currentYear}-${currentMonth}-${currentDate}T${selectedTime}:00+08:00`,
    );
    targetTime.setHours(targetTime.getHours() - 1);
    targetTime.setMinutes(targetMinute, targetSecond, 0); // 设置目标分钟和秒钟，设置毫秒为0

    const timeToTarget = targetTime - currentTime;
    setLogs((prevLogs) => [...prevLogs, `等待時間: ${timeToTarget / 1000} 秒`]);

    return timeToTarget;
  };

  // 添加 log 的功能
  const handleQuickBookClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLogs((prevLogs) => []);

    const timestamp = new Date().toLocaleString();
    setLogs((prevLogs) => [...prevLogs, `預約開始於 ${timestamp}`]);

    const ruleId = await beforeBook(e);
    if (ruleId !== undefined) {
      await booking(e, ruleId);
    }

    setLoading(false);
  };

  // 添加 log 的功能
  const handleWaitBookClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLogs((prevLogs) => []);

    const timeToTarget = waitUntil();

    // 设置一个定时器
    const id = setTimeout(async () => {
      const timestamp = new Date().toLocaleString();
      setLogs((prevLogs) => [...prevLogs, `預約開始於 ${timestamp}`]);

      const ruleId = await beforeBook(e);
      if (ruleId !== undefined) {
        await booking(e, ruleId);
      }

      setLoading(false);
    }, timeToTarget);

    setTimeoutId(id); // 保存定时器 ID 以便在取消时清除
  };

  const handleCancelClick = () => {
    if (timeoutId) {
      clearTimeout(timeoutId); // 清除定时器
      setLoading(false); // 取消时设置 loading 为 false
      setLogs((prevLogs) => [...prevLogs, '預約取消']);
    }
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
        <p>
          <strong>開始時間 (分/秒):</strong>{' '}
          <input
            type="text"
            id="targetMinute"
            value={targetMinute}
            onChange={(e) => setTargetMinute(e.target.value)}
            required
            className="login-input"
          />
          :
          <input
            type="text"
            id="targetSecond"
            value={targetSecond}
            onChange={(e) => setTargetSecond(e.target.value)}
            required
            className="login-input"
          />
        </p>
      </div>

      {/* 重新選擇場地按鈕 */}
      <button className="reselect-button" onClick={handleCourtClick}>
        重新選擇場地
      </button>

      {/* 開始預約按鈕 */}
      {
        <button
          className={'start-button'}
          disabled={loading}
          onClick={handleQuickBookClick}
        >
          即刻預約...
        </button>
      }
      {
        <button
          className={'start-button'}
          disabled={loading}
          onClick={handleWaitBookClick}
        >
          等待預約...
        </button>
      }
      {loading && (
        <button className={'start-button cancel'} onClick={handleCancelClick}>
          取消
        </button>
      )}

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
