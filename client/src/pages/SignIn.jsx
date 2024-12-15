import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import { SignInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import Oauth from "../conponents/Oauth";
import { toast } from "react-toastify";


export default function SignIn() {
  const [formData,setFormData] = useState({})
  const {loading,error:errorMessage}=useSelector(state =>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  const handleSubmit =async (e)=>{
    e.preventDefault()
    if( !formData.email || !formData.password){
      return dispatch(signInFailure('Vui lòng điền đầy đủ thông tin'))
    }
    try{
      dispatch(SignInStart())
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        toast.success('Đăng nhập thành công!');
        navigate('/')
      }
    }
    catch(err){
      dispatch(signInFailure(err.message))
    }
  }
  
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
        <Link to="/" className=" font-bold dark:text-white text-4xl">
        <img src="/TVT.png" alt="logo" className="h-16"/>
        </Link>
        <p className="text-sm mt-5">
          Bạn cần phải đăng nhập với email và mật khẩu hoặc tài khoản Google
        </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Email"></Label>
              <TextInput
                type="email"
                placeholder="name@example.com"
                id='email'
                onChange={handleChange}
              ></TextInput>
            </div>
            <div className="">
              <Label value="Mật khẩu"></Label>
              <TextInput
                type="password"
                placeholder="********"
                id='password'
                onChange={handleChange}
              ></TextInput>
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit" disabled={loading}>
            {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Chưa có tài khoản?</span>
            <Link to='/sign-up' className="text-blue-500">Đăng ký</Link>
            <Link to='/forgot-password' className="text-blue-500">Quên mật khẩu</Link>
          </div>
          {
            errorMessage &&(
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
