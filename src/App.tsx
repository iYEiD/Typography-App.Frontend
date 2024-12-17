import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/Signup';
import LoginPage from './components/Login';
import HomePage from './components/Home';
import Callback from './components/Callback';
import Search from './components/Search';
import { Header } from 'antd/es/layout/layout';
import AppLayout from './components/AppLayout';

const App = () => {
  return (
    <Router>


      <div className="site-layout-content">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/search" element={<AppLayout><Search /></AppLayout>} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;
