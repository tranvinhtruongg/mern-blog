import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
                Bạn muốn trở nên thông thái
            </h2>
            <p className='text-gray-500 my-2'>
                hãy đăng ký ngay để nhận thông báo mới
            </p>
            <Button gradientDuoTone='greenToBlue' className='rounded-tl-xl rounded-bl-none'>
                <a href="https://www.fb.com/truongdzzz" target='_blank' rel='noopener noreferrer'>
                    Đừng bỏ lỡ những điều hay bổ ích ở đây nhé!
                </a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://tenten.vn/tin-tuc/wp-content/uploads/2021/09/blog-la-gi-4.jpg" />
        </div>
    </div>
  )
}
