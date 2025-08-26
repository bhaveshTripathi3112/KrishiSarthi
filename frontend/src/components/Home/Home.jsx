import React, { useContext, useEffect } from 'react';
import homeImage from '/src/assets/hero-image.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { dataContext } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

const DetectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DecideIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7m0 10l-6-3" />
  </svg>
);

const DefendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.5-5.5a12.025 12.025 0 013.132-1.255 12.022 12.022 0 013.132 1.255l5.5 5.5A12.023 12.023 0 0021 8.984a11.955 11.955 0 01-2.382-3.001z" />
  </svg>
);

export function Home() {
  const { serverUrl, userData, setUserData } = useContext(dataContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/me`, { withCredentials: true });
        setUserData(res.data.user);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };
    if (!userData) fetchUser();
  }, [serverUrl, userData, setUserData, navigate]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Toggle */}
      <div className="flex justify-end p-4">
        <button onClick={() => i18n.changeLanguage('en')} className="px-4 py-2 mr-2 border rounded hover:bg-gray-100">English</button>
        <button onClick={() => i18n.changeLanguage('hi')} className="px-4 py-2 border rounded hover:bg-gray-100">हिंदी</button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">{t('homeTitle')}</h1>
              <p className="text-xl text-gray-600">{t('homeDesc')}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/scanner" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">{t('scanButton')}</Link>
                <Link to="/crop-recommendation" className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-300">{t('cropButton')}</Link>
              </div>
            </div>
            <div className="relative">
              <img src={homeImage} alt="Farmer using KrishiSarthi app" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('featuresTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard title={t('Detect & Diagnose')} description={t('featureDetect')} icon={<DetectIcon />} />
            <FeatureCard title={t('Decide & Plan')} description={t('featureDecide')} icon={<DecideIcon />} />
            <FeatureCard title={t('Defend & Prosper')} description={t('featureDefend')} icon={<DefendIcon />} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('ctaHeading')}</h2>
          <p className="text-xl text-gray-600 mb-8">{t('ctaDesc')}</p>
          <Link to="/signup" className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">{t('ctaButton')}</Link>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, description, icon }) {
  return (
    <div className="p-6 text-center border border-gray-200 rounded-lg hover:shadow-lg transition duration-300 flex flex-col items-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
