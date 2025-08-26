import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here, e.g., API call
    alert("Thanks for your query! We'll get back to you soon.");
    setForm({ name: "", contact: "", message: "" });
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1>📞 Contact Us</h1>
      <p>
        At <strong>कृषिSarthi (KrishiSarthi)</strong>, our goal is to empower farmers with digital solutions for crop protection, weather insights, and farming guidance.
        If you have any questions, suggestions, or feedback, please get in touch with us.
      </p>

      <h2>👨‍💻 Contact the Developers</h2>
      <p><strong>Team Name:</strong> Mythical Coders</p>
      <p>
        📧 Email (Team):{" "}
        <a href="mailto:mythicalcoders.team@gmail.com" style={{ color: "#2e7d32" }}>
          mythicalcoders.team@gmail.com
        </a>
      </p>
      <p>📍 Location: Graphic Era Hill University, Bhimtal</p>

      <p><strong>Team Members:</strong></p>
      <ul>
        <li>Gaurav Singh (Team Leader)</li>
        <li>Paras Mehta</li>
        <li>Yash Kirola</li>
        <li>Bhavesh Tripathi</li>
        <li>Himadri Mehra</li>
        <li>Kritika Tewari</li>
      </ul>

      <h2>📝 Submit Your Query to Us</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15, marginBottom: 40 }}>
        <input
          type="text"
          name="name"
          placeholder="Name *"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          type="text"
          name="contact"
          placeholder="Phone / Email *"
          value={form.contact}
          onChange={handleChange}
          required
          style={{ padding: 10, fontSize: 16 }}
        />
        <textarea
          name="message"
          placeholder="Your Message *"
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
          style={{ padding: 10, fontSize: 16, resize: "vertical" }}
        />
        <button type="submit" style={{ backgroundColor: "#2e7d32", color: "white", padding: 12, fontSize: 16, border: "none", cursor: "pointer" }}>
          Submit
        </button>
      </form>

      <h2>🌐 Government Support Portals</h2>
      <p>
        If you face serious issues like exploitation, unfair pricing, or fraud, you can directly contact these official government platforms for help and grievance redressal:
      </p>
      <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
        <li>
          <span role="img" aria-label="phone">📞</span> Kisan Call Centre (KCC) Toll-Free Helpline: 1800-180-1551<br />
          <span role="img" aria-label="clock">🕘</span> Available: 6 AM – 10 PM, all 7 days<br />
          💡 Talk to agriculture experts in your local language.
        </li>
        <li>
          <strong>PM-Kisan Helpline</strong><br/>
          📞 155261 or 1800-180-1551<br/>
          🌐 <a href="https://pmkisan.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#2e7d32" }}>https://pmkisan.gov.in/</a><br/>
          (For PM-Kisan scheme issues, fund transfers, registration help.)
        </li>
        <li>
          <strong>Farmer Portal (Government of India)</strong><br/>
          🌐 <a href="https://farmer.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#2e7d32" }}>https://farmer.gov.in/</a><br/>
          (Access schemes, subsidies, crop advisories, and official updates.)
        </li>
        <li>
          <strong>Central Public Grievance Redressal (CPGRAMS)</strong><br/>
          🌐 <a href="https://pgportal.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#2e7d32" }}>https://pgportal.gov.in/</a><br/>
          (Register complaints against unfair practices, middlemen exploitation, or delays in government services.)
        </li>
        <li>
          <strong>e-NAM (National Agriculture Market)</strong><br/>
          🌐 <a href="https://enam.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#2e7d32" }}>https://enam.gov.in/</a><br/>
          (Check transparent crop pricing, sell produce, and prevent exploitation in mandis.)
        </li>
        <li>
          <strong>Soil Health Card Portal</strong><br/>
          🌐 <a href="https://soilhealth.dac.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#2e7d32" }}>https://soilhealth.dac.gov.in/</a><br/>
          (Get soil reports and official recommendations for better crop productivity.)
        </li>
      </ul>

      <p style={{ textAlign: "center", marginTop: 40, fontSize: 14, color: "#666" }}>
        ✨ Made with ❤️ by Team Mythical Coders for India’s Farmers
      </p>
    </div>
  );
};

export default ContactPage;
