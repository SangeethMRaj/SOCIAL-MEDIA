import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import SignUp from './Pages/SignUp';
import LoginPage from './Pages/Login';
import AdminLogin from './Pages/AdminLogin';
import Posts from './Pages/sidebar/Posts';
import UserList from './Pages/sidebar/UserList'
import Dashboard from './Pages/sidebar/Dashboard';
import AdminLayout from './Pages/sidebar/AdminLayout';
import UserHome from './Pages/UserHome';
import UserLayout from './Pages/UserPages/UserLayout';
import Userhome from './Components/User/Userhome';
import UserProfile from './Pages/UserPages/UserProfile';
import UserNotification from './Pages/UserPages/UserNotification';
import UserMessages from './Pages/UserPages/UserMessages';
import UserPosts from './Components/UserProfileTabs/UserPosts';
import UserSaved from './Components/UserProfileTabs/UserSaved';
import ForgotPassword from './Components/Login/ForgotPassword';
import PrivateRoutes from './Components/UserPrivateRoutes/PrivateRoutes';
import { User, UserContext } from './Pages/Context/Context';
import Editprofile from './Pages/UserPages/Editprofile';
import Friendprofile from './Pages/UserPages/Friendprofile';
import { useContext, useEffect } from 'react';
import jwtdecode from 'jwt-decode'
import ForgotPasswordOtp from './Components/Login/ForgotpasswordOtp';
import ErrorPages from './Components/ErrorPages/ErrorPages';
import ErrorInternalServer from './Components/ErrorPages/ErrorInternalServer';


const socketio = require('socket.io-client')("https://xplre.online",{path:'/socket/socket.io'})

function App() {
  const user = localStorage.getItem('token') ? jwtdecode(localStorage.getItem('token'))  : ''
  console.log(user, 'userrrr');

  useEffect(() => {
    socketio?.emit("addUser", user?.id,user?.name)
}, [user.id])
  return (
    <div className="App">
      <Router>
        <User>
        <Routes>
          <Route element={<SignUp/>} path="/signup"/>
          <Route element={<LoginPage/>} path="/"/>
          <Route element={<ForgotPassword/>} path="/forgotpassword"/>
          <Route element={<ForgotPasswordOtp/>} path="/otp"/>
          <Route element={<ErrorPages/>} path='*' exact />
          <Route element={<ErrorInternalServer/>} path='/error' />
       

       
          <Route element={<AdminLogin/>} path="/admin/login"/>
       

      
          <Route element={<AdminLayout></AdminLayout>} path='/admin/'>
          <Route element={<Dashboard/>}  path='/admin/dashboard'/>
          <Route element={<UserList/>}  path='/admin/users'/>
          <Route element={<Posts/>}  path='/admin/posts'/>
          
          </Route>
      
       
       
        <Route element={<PrivateRoutes/>}>
          <Route element={<UserLayout></UserLayout>} path="/user/">
              <Route element={<Userhome />} path="/user/home"/>
              <Route element={<UserProfile/>} path="/user/profile/">
                <Route element={<UserPosts/>} path="/user/profile/posts"/>
                <Route element={<UserSaved/>} path="/user/profile/saved"/>
              </Route>
              <Route element={<Editprofile/>} path="/user/editprofile"/>
              <Route element={<UserNotification/>} path="/user/notification"/>
              <Route element={<UserMessages socketio={socketio}/>} path='/user/message'/>
              <Route element={<Friendprofile/>} path='/user/friendprofile'/>
            
          </Route>
          
        </Route>  
       </Routes>
       </User>
       
      </Router>

      
    </div>
  );
}

export default App;
