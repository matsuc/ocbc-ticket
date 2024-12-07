import React, { useState, useEffect } from 'react';
import booking from './bookingService';
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

  const waitUntil = async () => {
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

    if (timeToTarget > 0) {
      const minutes = Math.floor(timeToTarget / 60000); // 1分钟 = 60000毫秒
      const seconds = Math.floor((timeToTarget % 60000) / 1000); // 剩余的秒数

      setLogs((prevLogs) => [
        ...prevLogs,
        `等待時間: ${minutes} 分 ${seconds} 秒`,
      ]);

      await sleep(timeToTarget);
    }
  };

  // 添加 log 的功能
  const handleWaitBookClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLogs((prevLogs) => []);

    await waitUntil();

    const timestamp = new Date().toLocaleString();
    setLogs((prevLogs) => [...prevLogs, `預約開始於 ${timestamp}`]);

    const selectedDateTime = `${selectedDate}T${selectedTime}:00`;
    const response = await booking({
      selectedLength,
      selectedDateTime,
      userId,
      selectedCourt,
      sessionId,
      maxRetries: 20,
    });

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        message: response.message,
        link: response.redirectUrl,
      },
    ]);

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
      {!loading && (
        <button
          className={'start-button'}
          disabled={loading}
          onClick={handleWaitBookClick}
        >
          預約
        </button>
      )}
      {loading && <button className={'start-button cancel'}>預約中</button>}

      {/* 顯示日誌記錄 */}
      <div className="log-container">
        <h2>日誌記錄</h2>
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

export default Book;
