import React from 'react';
import Navbar from './components/Navbar';
import MainBody from './components/MainBody';
import About from './components/About';
import Metrics from './components/Metrics'; // ✅ NEW
import Services from './components/Services';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <MainBody />
      <About />
      <Metrics /> 
      <Services />
      <Footer />
    </div>
  );
};

export default App;
