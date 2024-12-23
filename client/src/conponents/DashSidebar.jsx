import {Sidebar} from 'flowbite-react';
import {HiAnnotation, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser,HiChartPie} from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const {currentUser} = useSelector(state => state.user)
    const [tab,setTab] = useState('')
  const navigate = useNavigate()
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
    },[location.search])
    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          toast.success('Đăng xuất thành công');
          dispatch(signoutSuccess());
          navigate('/');
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
            {currentUser && currentUser.isAdmin && (
              <Link to='/dashboard?tab=dash'>
                <Sidebar.Item
                  active={tab === 'dash' || !tab}
                  icon={HiChartPie}
                  as='div'
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            )}
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                {currentUser && (
                  <Link to='/dashboard?tab=posts'>
                    <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
                      Bài viết
                    </Sidebar.Item>
                  </Link>
                )}
                {currentUser.isAdmin && (
                  <>
                  <Link to='/dashboard?tab=users'>
                    <Sidebar.Item active={tab==='users'} icon={HiOutlineUserGroup} as='div'>
                      Người dùng
                    </Sidebar.Item>
                  </Link>
                  <Link to='/dashboard?tab=comments'>
                  <Sidebar.Item active={tab==='comments'} icon={HiAnnotation} as='div'>
                    Bình luận
                  </Sidebar.Item>
                  </Link>
                  </>
                )}
                {currentUser.isAdmin && (
                  <Link to="/dashboard?tab=approve">
                    <Sidebar.Item active={tab === 'approve'} icon={HiDocumentText} as="div">
                      Duyệt bài
                    </Sidebar.Item>
                  </Link>
                )}
                {currentUser.isAdmin && (
                  <Link to="/dashboard?tab=reports">
                    <Sidebar.Item active={tab === "reports"} icon={HiDocumentText} as="div">
                      Bài viết vi phạm
                    </Sidebar.Item>
                  </Link>
                )}

                <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                    Đăng xuất
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
