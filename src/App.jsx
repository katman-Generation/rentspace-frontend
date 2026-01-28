import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SpaceDetail from './pages/SpaceDetail';
import PostSpace from './pages/PostSpace';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/space/:id" element={<SpaceDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/post-space"
          element={
            <PrivateRoute>
              <PostSpace />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}