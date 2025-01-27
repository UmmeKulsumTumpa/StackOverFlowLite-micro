import React from 'react';
import { FaGithub, FaEnvelope, FaCopyright } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 w-full shadow-inner">
            <div className="container mx-auto max-w-4xl text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 text-lg font-medium">
                        <FaCopyright className="text-gray-400" />
                        <span>2025 Stack Overflow Lite. All rights reserved.</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-300">
                        <FaEnvelope className="mr-2" />
                        <a 
                            href="mailto:bsse1307@iit.du.ac.bd" 
                            className="hover:underline"
                        >
                            bsse1307@iit.du.ac.bd
                        </a>
                    </div>
                    <div className="flex space-x-4 text-2xl">
                        <a 
                            href="https://github.com/UmmeKulsumTumpa/StackOverFlowLite-micro" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-400 hover:text-white transition duration-300 hover:scale-110"
                        >
                            <FaGithub />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;