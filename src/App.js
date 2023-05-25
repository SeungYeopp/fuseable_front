// import logo from './logo.svg';
import React from 'react';
// import './css/Login.css';
import './App.scss'
import { BrowserRouter, Route, Link, Routes} from 'react-router-dom';
import Login from './Pages/Login';
import Redirect from './Pages/Redirect';
import GoogleRedirect from './Pages/GoogleRedirect';
import Logout from './Pages/Logout';
import Start from './Pages/Start';
import Main from './Pages/Main';
import AddListPage from './Kanban/AddListPage'
import EditListPage from './Kanban/EditListPage'
import Schedule from './Pages/schedule';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Login />}></Route>
        <Route path='/redirect' element={<Redirect />}></Route>
        <Route path='/googleredirect' element={<GoogleRedirect />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
        <Route path='/start' element={<Start />}></Route>
        <Route path='/start/schedule' element={<Schedule />}></Route>
        <Route path='/main' element={<Main />}></Route>
        <Route path='/main/addlistpage' element={<AddListPage />}></Route>
        <Route path='/main/editlistpage' element={<EditListPage />}></Route>
       </Routes>
    </BrowserRouter>
  )
}

export default App;
