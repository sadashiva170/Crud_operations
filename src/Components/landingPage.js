import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'

function  LandingPage() {
  return (
    <div >
      <header className='landing-page'>
      <div className='btn-box'>
      <Link to="/table">
       <button className="viewtable-btn" >ViewTable</button>
      </Link>
      </div>
      </header>
    </div>
  );
};

export default LandingPage;
