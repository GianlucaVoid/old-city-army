import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isAdmin = user?.ruolo === 'admin' || user?.ruolo === 'presidente';

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="navbar__inner container">
        <ul className="navbar__links navbar__links--left">
          <li><NavLink to="/chi-siamo">Chi Siamo</NavLink></li>
          <li><NavLink to="/galleria">Galleria</NavLink></li>
          <li><NavLink to="/percorsi">Percorsi</NavLink></li>
          <li><NavLink to="/raduni">Raduni</NavLink></li>
        </ul>

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">OLD CITY ARMY</span>
        </Link>

        <ul className="navbar__links navbar__links--right">
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/faq">FAQ</NavLink></li>
          {user ? (
            <>
              <li><NotificationBell /></li>
              <li><NavLink to="/profilo">{user.nome}</NavLink></li>
              {isAdmin && (
                <li className="navbar__dropdown-wrap">
                  <span className="navbar__dropdown-trigger">Admin ▾</span>
                  <ul className="navbar__dropdown">
                    <li><NavLink to="/admin">👥 Gestione Membri</NavLink></li>
                    <li><NavLink to="/admin/cms">📋 Gestione Contenuti</NavLink></li>
                  </ul>
                </li>
              )}
              <li><button className="navbar__cta" onClick={handleLogout}>Esci</button></li>
            </>
          ) : (
            <li><NavLink to="/diventa-membro" className="navbar__cta">Diventa un Membro</NavLink></li>
          )}
        </ul>

        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {['/', '/chi-siamo', '/galleria', '/percorsi', '/raduni', '/blog', '/faq'].map(path => (
          <NavLink key={path} to={path} onClick={() => setMenuOpen(false)}>
            {path === '/' ? 'Home' : path.slice(1).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </NavLink>
        ))}
        {user ? (
          <>
            <NavLink to="/notifiche" onClick={() => setMenuOpen(false)}>🔔 Notifiche</NavLink>
            <NavLink to="/profilo" onClick={() => setMenuOpen(false)}>👤 Profilo</NavLink>
            {isAdmin && <>
              <NavLink to="/admin" onClick={() => setMenuOpen(false)}>👥 Gestione Membri</NavLink>
              <NavLink to="/admin/cms" onClick={() => setMenuOpen(false)}>📋 Gestione Contenuti</NavLink>
            </>}
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Esci</button>
          </>
        ) : (
          <NavLink to="/diventa-membro" onClick={() => setMenuOpen(false)} className="navbar__cta">
            Diventa un Membro
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
