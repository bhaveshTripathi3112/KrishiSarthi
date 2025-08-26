import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.contact.trim()) {
      newErrors.contact = "Phone or Email is required";
    } else if (
      !/^[\w.-]+@([\w.-]+\.[A-Za-z]{2,})$/.test(form.contact) && // ✅ improved regex
      !/^\d{10}$/.test(form.contact)
    ) {
      newErrors.contact = "Enter a valid email or 10-digit phone number";
    }

    if (!form.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    alert("✅ Thanks for your query! We'll get back to you soon.");
    setForm({ name: "", contact: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-4">📞 Contact Us</h1>
      <p className="mb-8 leading-relaxed">
        At <strong>कृषिSarthi (KrishiSarthi)</strong>, our goal is to empower
        farmers with digital solutions for crop protection, weather insights,
        and farming guidance.
      </p>

      {/* Developer Info */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">👨‍💻 Contact the Developers</h2>
        <p><strong>Team Name:</strong> Mythical Coders</p>
        <p>
          📧 Email:{" "}
          <a href="mailto:mythicalcoders.team@gmail.com" className="text-green-700 underline">
            mythicalcoders.team@gmail.com
          </a>
        </p>
        <p>📍 Location: Graphic Era Hill University, Bhimtal</p>
        <ul className="list-disc list-inside mt-2">
          <li>Gaurav Singh (Team Leader)</li>
          <li>Paras Mehta</li>
          <li>Yash Kirola</li>
          <li>Bhavesh Tripathi</li>
          <li>Himadri Mehra</li>
          <li>Kritika Tewari</li>
        </ul>
      </section>

      {/* Query Form */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">📝 Submit Your Query</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1">Phone or Email *</label>
            <input
              type="text"
              name="contact"
              placeholder="Enter phone or email"
              value={form.contact}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
            />
            {errors.contact && <p className="text-red-600 text-sm">{errors.contact}</p>}
          </div>

          <div>
            <label className="block mb-1">Your Message *</label>
            <textarea
              name="message"
              rows={5}
              placeholder="Write your message..."
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 border rounded-md resize-y"
            />
            {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition"
          >
            Submit
          </button>
        </form>
      </section>

      {/* Government Portals */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🌐 Government Support Portals</h2>
        <ul className="space-y-3">
          <li>📞 <strong>Kisan Call Centre:</strong> 1800-180-1551 (6 AM – 10 PM)</li>
          <li>🌐 <a href="https://pmkisan.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">PM-Kisan Portal</a></li>
          <li>🌐 <a href="https://farmer.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">Farmer Portal</a></li>
          <li>🌐 <a href="https://pgportal.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">CPGRAMS Grievance</a></li>
          <li>🌐 <a href="https://enam.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">e-NAM Market</a></li>
          <li>🌐 <a href="https://soilhealth.dac.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">Soil Health Card</a></li>
        </ul>
      </section>

      <p className="text-center mt-12 text-sm text-gray-600">
        ✨ Made with ❤ by Team Mythical Coders for India’s Farmers
      </p>
    </div>
  );
};

export default ContactPage;
