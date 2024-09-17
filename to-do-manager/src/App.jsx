import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../../to-do-manager/src/pages/auth/Login';
import Signup from '../../to-do-manager/src/pages/auth/Signup';
import Home from '../../to-do-manager/src/pages/Home';
import SingleTask from '../../to-do-manager/src/pages/SingleTask';
import Auth from '../../to-do-manager/src/pages/auth/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/singletask/:taskId" element={<SingleTask />} />
      </Routes>
    </Router>
  );
}

export default App;
