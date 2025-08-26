import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Basic validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.contact.trim()) {
      newErrors.contact = "Phone or Email is required";
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.contact) &&
      !/^\d{10}$/.test(form.contact)
    ) {
      newErrors.contact = "Enter a valid email or 10-digit phone number";
    }
    if (!form.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 🔗 API call or backend integration can go here
    alert("✅ Thanks for your query! We'll get back to you soon.");
    setForm({ name: "", contact: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">📞 Contact Us</h1>
      <p className="mb-8 leading-relaxed">
        At <strong>कृषिSarthi (KrishiSarthi)</strong>, our goal is to empower
        farmers with digital solutions for crop protection, weather insights,
        and farming guidance. If you have any questions, suggestions, or
        feedback, please get in touch with us.
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

        <p className="mt-2 font-medium">Team Members:</p>
        <ul className="list-disc list-inside">
          <li>Gaurav Singh (Team Leader)</li>
          <li>Paras Mehta</li>
          <li>Yash Kirola</li>
          <li>Bhavesh Tripathi</li>
          <li>Himadri Mehra</li>
          <li>Kritika Tewari</li>
        </ul>
      </section>

      {/* Contact Form */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">📝 Submit Your Query</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name *"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              name="contact"
              placeholder="Phone / Email *"
              value={form.contact}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            />
            {errors.contact && <p className="text-red-600 text-sm">{errors.contact}</p>}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message *"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 border rounded-md resize-y"
              required
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
        <p className="mb-4">
          If you face serious issues like exploitation, unfair pricing, or fraud,
          you can directly contact these official government platforms:
        </p>
        <ul className="space-y-4">
          <li>
            📞 <strong>Kisan Call Centre:</strong> 1800-180-1551 <br />
            🕘 Available: 6 AM – 10 PM, all 7 days <br />
            💡 Talk to agriculture experts in your local language.
          </li>
          <li>
            <strong>PM-Kisan Helpline:</strong> 155261 or 1800-180-1551 <br />
            🌐{" "}
            <a href="https://pmkisan.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">
              https://pmkisan.gov.in/
            </a>
          </li>
          <li>
            <strong>Farmer Portal:</strong>{" "}
            <a href="https://farmer.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">
              https://farmer.gov.in/
            </a>
          </li>
          <li>
            <strong>CPGRAMS (Grievance Redressal):</strong>{" "}
            <a href="https://pgportal.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">
              https://pgportal.gov.in/
            </a>
          </li>
          <li>
            <strong>e-NAM (National Agriculture Market):</strong>{" "}
            <a href="https://enam.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">
              https://enam.gov.in/
            </a>
          </li>
          <li>
            <strong>Soil Health Card Portal:</strong>{" "}
            <a href="https://soilhealth.dac.gov.in/" target="_blank" rel="noreferrer" className="text-green-700 underline">
              https://soilhealth.dac.gov.in/
            </a>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <p className="text-center mt-12 text-sm text-gray-600">
        ✨ Made with ❤ by Team Mythical Coders for India’s Farmers
      </p>
    </div>
  );
};

export default ContactPage;