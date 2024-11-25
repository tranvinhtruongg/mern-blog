import {BrowserRouter,Routes ,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Header from './conponents/Header'
import Footer from './conponents/Footer'
import PrivateRoute from './conponents/PrivateRoute'
import OnlyAdminPrivateRoute from './conponents/OnlyAdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './conponents/ScrollToTop'
import Search from './pages/Search'
// import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
// import { useEffect } from 'react'
import ChatAI from './pages/ChatAI'
import DashApprovePost from './conponents/DashApprovePost';
import DashReport from './conponents/DashReport'

export default function App() {
//   useEffect(() => {
//     const recordVisit = async () => {
//         try {
//             const response = await axios.post('/api/visitors/record'); // Đường dẫn này dựa vào proxy
//             console.log("Visitor recorded successfully:", response.data);
//         } catch (error) {
//             console.error('Lỗi khi ghi nhận lượt truy cập:', error.response ? error.response.data : error.message);
//         }
//     };

//     recordVisit();
// }, []);

  return (
    <BrowserRouter >
    <ScrollToTop />
    <Header>
    </Header>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/sign-in' element={<SignIn/>}></Route>
        <Route path='/sign-up' element={<SignUp/>}></Route>
        <Route path='/search' element={<Search/>}></Route>
        <Route path='/chatai' element={<ChatAI/>}></Route>
        {/* <Route path='/approve' element={<ApprovePost/>}></Route> */}
        <Route path='/create-post' element={<CreatePost />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/admin/approve-posts" element={<DashApprovePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
          <Route path="/admin/reports" element={<DashReport />} />
        </Route>
        <Route path='/projects' element={<Projects/>}></Route>
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footer/>
    <ToastContainer/>
    </BrowserRouter>
  )
}
