import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link ,useLocation,useNavigate} from "react-router-dom";
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon,FaSun} from 'react-icons/fa'
import {useSelector,useDispatch} from 'react-redux'
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";

export default function Header() {
    const path =useLocation().pathname
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {currentUser} = useSelector((state) => state.user)
    const {theme} = useSelector((state) => state.theme)
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    }, [location.search]);
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

      const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };
  return (
    <Navbar className="border-b-2">
        <Link to="/" className="relative inline-block group">
        <div className="absolute inset-0">
            {/* Hiệu ứng sao */}
            <div className="w-full h-full pointer-events-none">
            <div className="star star-1"></div>
            <div className="star star-2"></div>
            <div className="star star-3"></div>
            </div>
        </div>
        {/* Logo */}
        <img 
            src="/TVT.png" 
            alt="logo" 
            className="h-10 relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-125"
        />
        </Link>




        <form onSubmit={handleSubmit}>
            <TextInput
                type="text"
                placeholder="Tìm kiếm..."
                rightIcon={AiOutlineSearch}
                className="hidden lg:inline "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
        <Button className="w-12 h-10 lg:hidden" color='gray' pill>
            <AiOutlineSearch/>
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button className="w-12 h-10 hidden sm:inline" color='gray' pill onClick={()=>dispatch
                (toggleTheme())
            }>
                {theme === 'light' ? <FaSun/> : <FaMoon/>}
            </Button>
            {currentUser ? (
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar
                            alt="user"
                            img={currentUser.profilePicture}
                            rounded
                        />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">@{currentUser.username}</span>
                        <span className="block text-sm font-medium truncate">@{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to="/dashboard?tab=profile">
                        <Dropdown.Item>
                            Profile
                        </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={handleSignout}>
                        Đăng xuất
                    </Dropdown.Item>
                </Dropdown>
            ): 
            (
                <Link to="/sign-in">
                    <Button gradientDuoTone='purpleToBlue' outline>
                        Đăng nhập
                    </Button>
                </Link>
            )
        }
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === '/'} as={'div'}>
                <Link to='/'>
                    Trang chủ
                </Link>
            </Navbar.Link >
            <Navbar.Link active={path === '/about'} as={'div'}>
                <Link to='/about'>
                    Về chúng tôi
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/projects'} as={'div'}>
                <Link to='/projects'>
                    Dự án
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/chatai'} as={'div'}>
                <Link to='/chatai'>
                    ChatTVT
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}//
