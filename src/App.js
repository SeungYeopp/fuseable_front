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
        <Route path='/home/ubuntu/fuseable_front/build/' exact element={<Login />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/redirect' element={<Redirect />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/googleredirect' element={<GoogleRedirect />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/logout' element={<Logout />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/start' element={<Start />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/start/schedule' element={<Schedule />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/main' element={<Main />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/main/addlistpage' element={<AddListPage />}></Route>
        <Route path='/home/ubuntu/fuseable_front/build/main/editlistpage' element={<EditListPage />}></Route>
       </Routes>
    </BrowserRouter>
  )
}

export default App;
