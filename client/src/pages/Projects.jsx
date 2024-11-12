import CallToAction from '../conponents/CallToAction';
export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Dự án</h1>
      <p className='text-md text-gray-500'>Nơi chia sẻ kinh nghiệm và học tập những điều mới mẻ</p>
      <CallToAction />
    </div>
  )
}