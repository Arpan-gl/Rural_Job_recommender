import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import SkillInput from './pages/SkillInput';
import JobResults from './pages/JobResults';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useAuthStore } from './store/authStore';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/skills" element={<SkillInput />} />
            <Route path="/jobs" element={<JobResults />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<Assistant />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
