import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function About() {
  const team = [
    {
      name: "Gaurav Singh",
      role: "Frontend Developer",
      img: "https://media.licdn.com/dms/image/v2/D5603AQHYvgUXI8C2vA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707729548174?e=1759363200&v=beta&t=hdqMIkQnKxoV5jKINsDJuVCnembRVl6nRrJdE7yivR0",
      github: "https://github.com/gauravsinghshah",
      linkedin: "http://linkedin.com/in/gauravsinghshah/",
    },
    {
      name: "Paras Mehta",
      role: "Backend Developer",
      img: "https://media.licdn.com/dms/image/v2/D5603AQFhYgnAEH164Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704211979683?e=1759363200&v=beta&t=wfMP-T4qHmuiWl8FrfASrkvDFUmvFYq6iORrllq-wn8",
      github: "https://github.com/Paras-Mehta007",
      linkedin: "https://www.linkedin.com/in/paras-mehta-69268a298/",
    },
    {
      name: "Yash Kirola",
      role: "UI/UX Designer",
      img: "https://media.licdn.com/dms/image/v2/D4D03AQF9qCML4F0tew/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1693825462834?e=1759363200&v=beta&t=Qf66N26UmO9KCm9g8p2C4EkndLncRhoU-3dJFsCwBgQ",
      github: "https://github.com/Y45hK1r0l4",
      linkedin: "https://www.linkedin.com/in/yash-kirola-06344127a/",
    },
    {
      name: "Bhavesh Tripathi",
      role: "Full Stack Developer",
      img: "https://media.licdn.com/dms/image/v2/D4D03AQFUhZLL09BnTw/profile-displayphoto-scale_100_100/B4DZgOBvLYGsAc-/0/1752581995423?e=1759363200&v=beta&t=Crot8QveQC1sgsfyVAfZTsu0uHM856BAlbFyPmqOW5Y",
      github: "https://github.com/bhaveshtripathi3112",
      linkedin: "https://www.linkedin.com/in/bhavesh-tripathi-a69483309/",
    },
    {
      name: "Himadri Mehra",
      role: "Developer",
      img: "https://media.licdn.com/dms/image/v2/D5603AQH6RYrp3DGzLA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709962072202?e=1759363200&v=beta&t=5zd8cAeYalNWmnAVdVfCBXvev31TLCDNpFHYXN-muVI",
      github: "https://github.com/Himadrimehra",
      linkedin: "https://www.linkedin.com/in/himadri-mehra-b164822a0/",
    },
    {
      name: "Kritika Tewari",
      role: "Developer",
      img: "https://media.licdn.com/dms/image/v2/D4D03AQEjVoucC9GW2w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721202760749?e=1759363200&v=beta&t=TPnukNE6yWn8RWVhfMGVxL4TFZe5HhLt3oXKbxigwdY",
      github: "https://github.com/kritikatewari981",
      linkedin: "https://www.linkedin.com/in/kritika-tewari-5b8819319/",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 font-sans">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
          <span className="text-gray-900">🌱</span> About KrishiSarthi
        </h1>
        <p className="mt-2 text-xl font-medium text-gray-800">
          🌾 Predict. Protect. Prosper.
        </p>
        <p className="mt-1 text-lg text-gray-600 max-w-2xl mx-auto">
          Smart farming solutions for a sustainable future.
        </p>
      </header>

      {/* Introduction Section */}
      <section className="bg-gray-50 p-6 md:p-10 rounded-xl shadow-lg mb-12">
        <p className="text-gray-800 leading-relaxed text-lg">
          Agriculture is the backbone of India, yet millions of farmers face
          daily struggles — from unpredictable weather and crop diseases to
          limited access to expert guidance. Every year, up to 25% of crop yield
          is lost to pests, diseases, and climate challenges. For a farmer, even
          a single unidentified leaf blight can mean a season’s income lost.
          <br />
          <br />
          KrishiSarthi was born to solve this problem. It is an AI-powered
          digital assistant that brings technology directly to the hands of
          farmers, helping them make smarter, faster, and more informed
          decisions. Our mission is to make farming secure, sustainable, and
          profitable by combining Artificial Intelligence, Machine Learning, and
          community-driven insights.
        </p>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b-2 border-green-500 pb-2">
          🚜 What KrishiSarthi Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1: Crop Recommendation */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              🌱 AI-Based Crop Recommendation
            </h3>
            <p className="text-gray-600 text-sm">
              KrishiSarthi suggests the most suitable crops based on soil data,
              weather patterns, and past history to help farmers maximize yield
              and increase profitability.
            </p>
          </div>

          {/* Feature Card 2: Disease Detection */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              🌿 AI-Powered Crop Disease Detection
            </h3>
            <p className="text-gray-600 text-sm">
              Farmers can upload a picture of a leaf, and within seconds,
              KrishiSarthi identifies the disease and provides treatment
              suggestions.
            </p>
          </div>

          {/* Feature Card 3: Weather Forecasts */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              ☁ Hyper-local Weather Forecasts
            </h3>
            <p className="text-gray-600 text-sm">
              With location-based forecasts, farmers can plan sowing, irrigation,
              pesticide use, and harvesting with confidence.
            </p>
          </div>

          {/* Feature Card 4: AI Chatbot */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              🤖 24/7 AI Chatbot Assistance
            </h3>
            <p className="text-gray-600 text-sm">
              Our multilingual chatbot (English & Hindi) is available
              round-the-clock to answer queries and provide instant support.
            </p>
          </div>

          {/* Feature Card 5: Community Heatmap */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              🗺 Community-Driven Heatmap
            </h3>
            <p className="text-gray-600 text-sm">
              By anonymously sharing disease reports, farmers contribute to a
              live disease outbreak map, enabling communities to prepare and
              protect their crops.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gray-50 p-6 md:p-10 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🌾 Why Choose KrishiSarthi?
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Farmer-Centric Design:</strong> Simple, clean, and
            multilingual interface built for accessibility.
          </li>
          <li>
            <strong>Bridging the Knowledge Gap:</strong> Delivers expert
            insights instantly, reducing guesswork.
          </li>
          <li>
            <strong>Community Protection:</strong> Collective data builds a
            stronger shield against crop diseases.
          </li>
          <li>
            <strong>Smarter Farming Decisions:</strong> AI-driven
            recommendations guide farmers toward better crop choices.
          </li>
          <li>
            <strong>Accessible for All:</strong> Works directly on browsers, no
            costly devices or complex apps required.
          </li>
        </ul>
      </section>

      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b-2 border-green-500 pb-2">
          Meet the Team – Mythical Coders
        </h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          KrishiSarthi is developed by Team Mythical Coders, a passionate group
          of innovators committed to creating meaningful technology for
          real-world problems.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-green-700">
                {member.name}
              </h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
              <div className="flex justify-center gap-4 mt-3">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-2xl hover:text-green-600" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="text-2xl text-blue-600 hover:text-green-600" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}