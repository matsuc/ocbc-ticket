import React, { useState, useEffect } from 'react';
import './ConfirmSelection.css';

function ConfirmSelection({
  selectedDate,
  selectedTime,
  selectedLength,
  availableCourts,
  onConfirm,
  onCancel,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState(null);

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

  const handleCourtClick = (court) => {
    setSelectedCourt(court === selectedCourt ? null : court); // 點擊已選場地會取消選擇
  };

  return (
    <div className="confirm-selection-container">
      <h2>確認選擇</h2>
      <p className="current-time">當前時間：{formatDateTime(currentTime)}</p>
      <div className="confirm-selection-details">
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
          <strong>選擇可用場地 (不選擇則隨機)</strong>
        </p>
        <div className="available-courts-list">
          {availableCourts.length > 0 ? (
            availableCourts.map((court) => (
              <div
                key={court}
                className={`available-courts-item ${court === selectedCourt ? 'selected' : ''}`}
                onClick={() => handleCourtClick(court)}
              >
                {court - 70}
              </div>
            ))
          ) : (
            <p>無可用場地</p>
          )}
        </div>
      </div>
      <div className="confirm-selection-actions">
        <button
          className="confirm-button"
          onClick={() => onConfirm(selectedCourt)}
        >
          確認
        </button>
        <button className="cancel-button" onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  );
}

export default ConfirmSelection;
