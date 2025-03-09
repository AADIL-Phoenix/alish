import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useGlobalContext } from './context.js';
import Layout from './comp/layout/layout';
import './index.css';
import MainHome from './MainHomeComp/frontend/MainHome';
import BookList from "./Components/BookList/BookList";
import BookDetails from "./Components/BookDetails/BookDetails";
import Community from "./Community/components/Community.js";
import CreateProfile from "./Community/components/CreateProfile.js";
import ProfileCard from "./Community/components/UserProfile.jsx";
import "./Community/components/styles/Community.css";
import AuthPage from './Login/auth.js';
// import SearchEngine from './pages/SearchEngine/SearchEngine';
// import PrivateMessages from './pages/PrivateMessages/PrivateMessages';
// import BookChannels from './pages/BookChannels/BookChannels';
// import Polls from './pages/Polls/Polls';

// Custom protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <BrowserRouter>
      <Routes>
        {/* MainHome will have its own navbar */}
        <Route path="/" element={<MainHome />} />
        
        {/* All other routes will use the Layout with navbar */}
        <Route element={<Layout />}>
          <Route path="/login" element={<AuthPage initialView="login" />} />
          <Route path="/register" element={<AuthPage initialView="register" />} />
          <Route path="/book" element={<BookList />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/Community/Create-Profile" element={<CreateProfile />} />
          <Route path="/Community/profile" element={<ProfileCard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AppProvider>
);