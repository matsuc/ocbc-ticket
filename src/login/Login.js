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
    setErrorMessage("");

    const payload = {
      Login: username,
      Password: password,
      RememberMe: true,
    };

    try {
      // 使用 axios 發送 POST 請求
      const response = await axios.post("https://sportshub.perfectgym.com/clientportal2/Auth/Login", payload, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*",
          "Origin": "https://sportshub.perfectgym.com",
          "Referer": "https://sportshub.perfectgym.com/clientportal2/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
        },
      });

      // Axios 會自動處理 JSON 回應
      const cookies = response.headers["set-cookie"].split(";")[0];
      const token = response.headers["jwt-token"];
      const userId = response.data.User.Member.Id;

      // 登入成功後，執行相應的操作
      console.log("Login successful", { cookies, userId, token });

      // TODO: 跳轉到登入後頁面
      onSubmit();

    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : "Login failed.");
      console.error("Login error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
