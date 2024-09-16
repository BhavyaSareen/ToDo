import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Home from './Pages/Home'
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {

  return (
    <>
    <NavBar/>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<SignUp/>}/>
        </Route>
      </Routes>
    </BrowserRouter>

    <Footer/>

    </>
  )
}

export default App
