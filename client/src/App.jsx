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
export default function App() {
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
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route path='/projects' element={<Projects/>}></Route>
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
