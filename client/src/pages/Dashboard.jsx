// import { useEffect, useState } from 'react';
// import {useLocation} from 'react-router-dom';
import DashSidebar from '../conponents/DashSidebar';
import DashProfile from '../conponents/DashProfile';
import DashPosts from '../conponents/DashPosts';
import DashUsers from '../conponents/DashUsers';
import DashComments from '../conponents/DashComments';
import DashboardComp from '../conponents/DashboardComp';
import DashApprovePost from '../conponents/DashApprovePost';
import DashReport from '../conponents/DashReport';
import { toast } from 'react-toastify';
// export default function Dashboard() {
//   const location = useLocation();
//   const [tab,setTab] = useState('')
//   useEffect(()=>{
//     const urlParams = new URLSearchParams(location.search)
//     const tabFromUrl = urlParams.get('tab')
//     if(tabFromUrl){
//       setTab(tabFromUrl)
//     }
//   },[location.search])
//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       <div className='md:w-56'>
//         {/* Sidebar */}
//         <DashSidebar />
//       </div>
//       {/* profile... */}
//       {tab === 'profile' && <DashProfile />}
//       {/* posts */}
//       {tab=== 'posts' && <DashPosts/>}
//       {/* users */}
//       {tab === 'users' && <DashUsers/>}
//       {/* comments */}
//       {tab === 'comments' && <DashComments/>}
//       {/*dashboard */}
//       {tab === 'dash' && <DashboardComp/>}
//       {/* approve */}
//       {tab === 'approve' && <DashApprovePost />}
//       {/* report */}
//       {tab === 'reports' && <DashReport/>}
//     </div>
//   )
// }

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import DashSidebar from '../components/DashSidebar';
// import DashProfile from '../components/DashProfile';
// import DashPosts from '../components/DashPosts';
// import DashUsers from '../components/DashUsers';
// import DashComments from '../components/DashComments';
// import DashboardComp from '../components/DashboardComp';
// import DashApprovePost from '../components/DashApprovePost';
// import DashReport from '../components/DashReport';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl) {
      // Kiểm tra nếu người dùng không phải admin và cố gắng truy cập tab admin
      if (
        !currentUser?.isAdmin &&
        [ 'users', 'comments', 'approve', 'reports'].includes(tabFromUrl)
      ) {
        toast.error('Bạn không có quyền truy cập vào trang này.');
        navigate('/'); // Chuyển hướng về trang chủ
        return;
      }
      setTab(tabFromUrl);
    }
  }, [location.search, currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === 'profile' && <DashProfile />}
      {/* posts */}
      {tab === 'posts' && <DashPosts />}
      {/* users */}
      {tab === 'users' && <DashUsers />}
      {/* comments */}
      {tab === 'comments' && <DashComments />}
      {/* dashboard */}
      {tab === 'dash' && <DashboardComp />}
      {/* approve */}
      {tab === 'approve' && <DashApprovePost />}
      {/* report */}
      {tab === 'reports' && <DashReport />}
    </div>
  );
}
