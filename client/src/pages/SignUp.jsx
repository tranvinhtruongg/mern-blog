import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function SignUp() {
  const [formData,setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  const handleSubmit =async (e)=>{
    e.preventDefault()
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Vui lòng điền hết tất cả mục.')
    }
    try{
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup',{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false)
      if(res.ok){
        navigate('/sign-in')
      }
    }
    catch(err){
      setErrorMessage(err.message);
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
        <Link to="/" className=" font-bold dark:text-white text-4xl">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 
              via-purple-500 to-pink-500 rounded-lg text-white">TVT</span>
            Blog
        </Link>
        <p className="text-sm mt-5">
          Bạn cần phải đăng ký với email và mật khẩu hoặc tài khoản Google
        </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Tên đăng nhập"></Label>
              <TextInput
                type="text"
                placeholder="Tên đăng nhập"
                id='username'
                onChange={handleChange}
              ></TextInput>
            </div>
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
                placeholder="Mật khẩu"
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
                'Sign Up'
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Đã có tài khoản?</span>
            <Link to='/sign-in' className="text-blue-500">Đăng nhập</Link>
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
