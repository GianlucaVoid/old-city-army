import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <span className="footer__logo">OLD CITY ARMY</span>
        <p className="footer__tagline">Fratellanza su due ruote.<br/>Vivila, Guidala, Condividila.</p>
      </div>
      <div className="footer__links">
        <div>
          <h4>Esplora</h4>
          <ul>
            <li><Link to="/chi-siamo">Chi Siamo</Link></li>
            <li><Link to="/galleria">Galleria</Link></li>
            <li><Link to="/percorsi">Percorsi</Link></li>
            <li><Link to="/raduni">Raduni</Link></li>
          </ul>
        </div>
        <div>
          <h4>Community</h4>
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/diventa-membro">Diventa un Membro</Link></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer__bottom container">
      <p>© {new Date().getFullYear()} Old City Army. Tutti i diritti riservati.</p>
    </div>
  </footer>
);

export default Footer;
