// app.js - 企业微信 Poe AI 机器人的最小核心代码
const express = require('express');
const axios = require('axios');
const { createHash } = require('crypto');

const app = express();
app.use(express.json()); // 用于解析企业微信发送的JSON数据
app.use(express.urlencoded({ extended: true })); // 用于解析URL编码数据

// 1. 处理企业微信的URL验证
app.get('/wechat/callback', (req, res) => {
  const { msg_signature, timestamp, nonce, echostr } = req.query;
  // 这里是验证逻辑的伪代码，您需要根据企业微信官方文档实现签名验证
  console.log('Received verification request. Please check signature.');
  // 如果验证成功，最终需要返回解密后的echostr明文
  // res.send(decryptedEchostr);
});

// 2. 接收企业微信用户消息的主入口
app.post('/wechat/callback', async (req, res) => {
  try {
    // 伪代码：解密或解析出用户发送的真实消息内容
    // const userMessage = decryptMessage(req.body);
    const userMessage = "你好啊"; // 假设这是解析出来的用户消息

    console.log('User said:', userMessage);

    // 3. 调用Poe官方API获取回复
    const poeResponse = await axios.post(
      `https://api.poe.com/bot/你的Poe机器人名/chat`,
      {
        query: userMessage,
        mode: 'serve'
      },
      {
        headers: {
          'X-API-Key': process.env.POE_API_KEY, // 您的Poe API Key通过环境变量传入
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = poeResponse.data.response; // 提取Poe的回复文本

    console.log('Poe AI replied:', aiReply);

    // 4. 将回复封装成企业微信要求的格式并返回
    // 这里先返回一个最简单的文本消息格式以确保流程跑通
    res.json({
      msgtype: 'text',
      text: {
        content: aiReply
      }
    });

  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Server Error');
  }
});

// 启动服务器，监听3000端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
