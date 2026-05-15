import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificheProvider } from './context/NotificheContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Raduni from './pages/Raduni';
import Galleria from './pages/Galleria';
import Notifiche from './pages/Notifiche';
import Profilo from './pages/Profilo';
import AdminPanel from './pages/AdminPanel';
import { Percorsi, ChiSiamo, Blog, FAQ } from './pages/OtherPages';
import { Login, Register } from './pages/Auth';

const App = () => (
  <AuthProvider>
    <NotificheProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/galleria" element={<Galleria />} />
          <Route path="/percorsi" element={<Percorsi />} />
          <Route path="/raduni" element={<Raduni />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/diventa-membro" element={<Register />} />
          <Route path="/profilo" element={<Profilo />} />
          <Route path="/notifiche" element={<Notifiche />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </NotificheProvider>
  </AuthProvider>
);

export default App;
