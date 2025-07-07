import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-deepBlue text-white pt-10 relative">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
        {/* Contact Links */}
        <div className="flex space-x-6 text-lg">
          <a
            href="mailto:frandelwanjawa19@gmail.com"
            className="hover:text-cyan-400 transition"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://github.com/K-HIF/HIMS/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/frandel-wanjawa/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/80 py-4">
          <p>&copy; {new Date().getFullYear()} Tethics Electrics Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
