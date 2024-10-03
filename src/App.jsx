import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Home from './Pages/Home'
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './Pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoutes from './assets/ProtectedRoutes';
import TaskListTable from './Pages/MyTaskListTable';
function App() {
  const name = ()=>{
    localStorage.setItem("hi","hlo");
  };
  return (
    <>
      <NavBar />

      <Routes>
        <Route path='/' element={<Home />}>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
        </Route>
        <Route path='/dashboard' element={
          <ProtectedRoutes><Dashboard name = {name} /></ProtectedRoutes>
          }></Route>
             <Route path='/tasklist' element={<TaskListTable/>}></Route>
   </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <Footer />

    </>
  )
}

export default App
