import React from 'react';
import logo from '../assets/logo.png';

const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className='flex justify-center items-center py-3 h-20 shadow-md bg-[#1a1f38]'>
        <img 
          src={logo}
          alt='logo'
          width={100}
          height={30}
        />
      </header>

      <div className="min-h-screen flex items-center justify-center bg-[#0e1223] text-white">
        {children}
      </div>
    </>
  );
};

export default AuthLayouts;
