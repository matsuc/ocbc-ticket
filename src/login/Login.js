import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // 可以根據需要自定義 CSS

const Login = ({onSubmit}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 處理提交表單
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      Login: username,
      Password: password,
      RememberMe: true,
    };

    try {
      // 使用 axios 發送 POST 請求
      const response = await axios.post("/api/clientportal2/Auth/Login", payload, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      // Axios 會自動處理 JSON 回應
      const token = response.headers["jwt-token"];
      const userId = response.data.User.Member.Id;

      // 登入成功後，執行相應的操作
      console.info("Login successful", { userId, token });

      // TODO: 跳轉到登入後頁面
      onSubmit();

    } catch (error) {
      setErrorMessage("Login failed.");
      console.error("Login error: " + JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>登入頁面</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {/* 用戶名輸入框 */}
        <div className="form-group">
          <label htmlFor="username">帳號：</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="請輸入帳號"
            required
            className="login-input"
          />
        </div>
        {/* 密碼輸入框 */}
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
            required
            className="login-input"
          />
        </div>
        {/* 錯誤訊息 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {/* 提交按鈕 */}
        <button type="submit" disabled={loading} className="login-button">
          {loading ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
};

export default Login;
