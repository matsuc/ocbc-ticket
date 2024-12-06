import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // 忽略憑證檢查
});

export default async function handler(req, res) {
  // 添加 CORS 頭部
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // 指定允許的來源
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // 指定允許的方法
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, cp-book-facility-session-id',
  ); // 指定允許的請求頭部
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允許憑證（cookies）

  if (req.method === 'OPTIONS') {
    res.status(204).end(); // 結束預檢請求
    return;
  }

  try {
    const targetUrl = `https://sportshub.perfectgym.com${req.url.replace('/api/proxy', '')}`;

    const axiosConfig = {
      method: req.method,
      url: targetUrl,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        Origin: 'https://sportshub.perfectgym.com',
        Referer: 'https://sportshub.perfectgym.com/clientportal2/',
        Cookie: req.headers.cookie || '',
        'Cp-Book-Facility-Session-Id':
          req.headers['cp-book-facility-session-id'] || '',
      },
      httpsAgent,
    };

    // 處理查詢參數（GET）或請求體（POST/PUT）
    if (req.method === 'GET') {
      axiosConfig.params = req.query; // 傳遞 GET 請求的查詢參數
    } else if (req.method === 'POST' || req.method === 'PUT') {
      axiosConfig.data = req.body; // 傳遞 POST/PUT 的請求體
    }

    // 發送請求到目標伺服器
    const response = await axios(axiosConfig);

    // 返回第三方伺服器的Header給客戶端
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.setHeader(
      'Access-Control-Expose-Headers',
      Object.keys(response.headers).join(', '),
    );

    // 返回第三方伺服器的響應給客戶端
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message || error);

    // 錯誤處理：返回第三方伺服器的錯誤或通用錯誤
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Proxy error',
        message: error.response.data,
      });
    } else {
      res.status(500).json({
        error: 'Proxy error',
        message: error.message,
      });
    }
  }
}
