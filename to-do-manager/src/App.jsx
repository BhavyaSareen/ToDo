import { Routes, Route } from 'react-router-dom';
import Login from '../../to-do-manager/src/pages/auth/Login';
import Signup from '../../to-do-manager/src/pages/auth/Signup';
import Home from '../../to-do-manager/src/pages/Home';
import SingleTask from '../../to-do-manager/src/pages/SingleTask';
import Auth from '../../to-do-manager/src/pages/auth/auth';
import Navbar from './component/NavBar';
import FooterSection from './component/FooterSection';
import 'primereact/resources/themes/saga-blue/theme.css';  // Import theme
import 'primereact/resources/primereact.min.css';          // Import core styles
import 'primeicons/primeicons.css';
import Toast from './component/Toast';
import { useState } from 'react';

function App() {

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (type, message) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000); // Hide toast after 3 seconds
  };

  return (
    <>
      <Navbar />
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      <Routes>
        <Route path="/auth" element={<Auth />}>
          <Route path="login" element={<Login showToast={showToast} />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/singletask/:taskId" element={<SingleTask />} />
      </Routes>
      <FooterSection />

    </>
  );
}

export default App;
