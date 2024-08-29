import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";


export default function SignUp() {
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
          Bạn cần phải đăng nhập với email và mật khẩu hoặc tài khoản Google
        </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Tên đăng nhập"></Label>
              <TextInput
                type="text"
                placeholder="Tên đăng nhập"
                id='username'
              ></TextInput>
            </div>
            <div className="">
              <Label value="Email"></Label>
              <TextInput
                type="text"
                placeholder="name@example.com"
                id='email'
              ></TextInput>
            </div>
            <div className="">
              <Label value="Mật khẩu"></Label>
              <TextInput
                type="text"
                placeholder="Mật khẩu"
                id='password'
              ></TextInput>
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit">
              Đăng nhập
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Đã có tài khoản?</span>
            <Link to='/sign-in' className="text-blue-500">Đăng ký</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
