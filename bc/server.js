import express from 'express';
import morgan from 'morgan';
import axios from 'axios';
import cors from "cors"
import dotenv from 'dotenv'
dotenv.config()
const app = express();
const PORT = process.env.PORT ;

app.use(express.json())
app.use(cors())
app.use(morgan("combined"))
app.post('/api/v1/submit', async (req, res) => {
  const { captchaValue } = req.body;

  const secretKey = process.env.SECRET_KEY; 
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaValue}`;

  try {
    const response = await axios.post(verificationUrl);
    console.log("res",response)
    const { success } = response.data;

    if (success) {
    
      res.json({ success: true });
    } else {
      
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});