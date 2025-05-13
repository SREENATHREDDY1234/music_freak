import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Search = lazy(() => import('../pages/Search'));
const Artist = lazy(() => import('../pages/Artist.jsx'));
const Concert = lazy(() => import('../pages/Concert.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Bookings = lazy(() => import('../pages/Bookings.jsx'));
const Favorites = lazy(() => import('../pages/Favorites.jsx'));
const Settings = lazy(() => import('../pages/Settings.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

const AppRoutes = () => {

  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />
          } />
          <Route path="search" element={<Search />} />
          <Route path="artist/:id" element={<Artist />} />
          <Route path="concert/:id" element={<Concert />} />
          
          {/* Protected Routes */}
          
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="settings" element={<Settings />} />

          {/* Error Route */}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;