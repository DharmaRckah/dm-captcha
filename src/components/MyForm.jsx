import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

const MyForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captchaValue) {
      try {
      
        const response = await axios.post("http://localhost:5000/api/v1/submit", {
          ...formData,
          captchaValue,
        });

        if (response.data.success) {
          setSubmissionStatus('Form submitted successfully!');
          // Optionally reset the form
          setFormData({ name: '', email: '' });
          setCaptchaValue(null);
        } else {
          setSubmissionStatus('CAPTCHA verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Error ', error);
        setSubmissionStatus('An error occurred. Please try again later.');
      }
    } else {
      alert('Please complete the CAPTCHA');
    }
  };

  return (
    <div>
      <h2> DM Captcha</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <ReCAPTCHA
          sitekey={apiKey} // Replace with your site key
          onChange={setCaptchaValue}
        />
        <button type="submit">Submit</button>
      </form>
      {submissionStatus && <p>{submissionStatus}</p>}
    </div>
  );
};

export default MyForm;