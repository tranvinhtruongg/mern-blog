import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import DashSidebar from '../conponents/DashSidebar';
import DashProfile from '../conponents/DashProfile';
import DashPosts from '../conponents/DashPosts';
import DashUsers from '../conponents/DashUsers';
import DashComments from '../conponents/DashComments';

export default function Dashboard() {
  const location = useLocation();
  const [tab,setTab] = useState('')
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* posts */}
      {tab=== 'posts' && <DashPosts/>}
      {/* users */}
      {tab === 'users' && <DashUsers/>}
      {/* comments */}
      {tab === 'comments' && <DashComments/>}
    </div>
  )
}
