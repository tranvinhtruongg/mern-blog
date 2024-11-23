import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate,useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { toast } from "react-toastify";

export default function UpdatePost() {
  const [file,setFile] = useState(null);
  const [imageUploadProgress,setImageUploadProgress] = useState(null);
  const [imageUploadError,setImageUploadError] = useState(null);
  const [formData,setFormData] = useState({})
  const [publishError,setPublishError] = useState(null);
  const {postId} = useParams();
  
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
      const res = await fetch(`/api/post/getposts?postId=${postId}`);
      // Gửi yêu cầu tới API để lấy thông tin bài viết dựa trên `postId`.
  
      const data = await res.json();
      // Chuyển đổi phản hồi từ API thành định dạng JSON.
  
      if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
      }
      // Nếu yêu cầu thất bại (mã phản hồi không phải là 200), lưu thông báo lỗi vào `publishError`.
  
      if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
      }
      // Nếu yêu cầu thành công, xóa lỗi và lưu dữ liệu bài viết vào `formData`.
  
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);
  // Hook `useEffect` chạy khi `postId` thay đổi, dùng để lấy dữ liệu bài viết từ API.
  

  const handleUpLoadImage = async () => {
    try{
      if(!file){
        setImageUploadError('Vui lòng chọn ảnh');
        return
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
      },
      ()=>{
        setImageUploadError('Upload ảnh thất bại');
        setImageUploadProgress(null);
      },
      ()=>{
        // cai nay
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData({...formData,image:downloadURL})
        })
      }
    )
    }
    catch(error){
      setImageUploadError('Upload ảnh thất bại');
      setImageUploadProgress(null);
      console.error(error);
    }
  }
  // Submit form
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData)
      })
      const data= await res.json();
      if(!res.ok){
        setPublishError(data.message);
        return
      }
      if(res.ok){
        setPublishError(null);
        toast.success('Cập nhật bài viết thành công!');
        navigate(`/post/${data.slug}`);
      }
    }catch(error){
      toast.error('Đăng bài thất bại');
      setPublishError('Đăng bài thất bại');
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl m-7 font-semibold">Chỉnh sửa bài viết mới</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e)=>
              setFormData({...formData,title:e.target.value})
            }
            value={formData.title}
          />
          <Select onChange={(e)=>
            setFormData({...formData,category:e.target.value})
          }
          value={formData.category}
          >
            <option value='uncategorized'>Chọn danh mục</option>
            <option value='maytinh'>Máy tính</option>
            <option value='phanmem'>Phần mềm & Games</option>
            <option value='vuichoigiaitri'>Khu vui chơi giải trí</option>
            <option value='thuongmai'>Khu thương mại</option>
            <option value='congnghe'>Sản phẩm công nghệ</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/>
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpLoadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )
        }
        <ReactQuill
          theme='snow'
          value={formData.content}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={
            (value)=>{
              setFormData({...formData,content:value})
            }
          }
        />
        <Button type='submit' gradientDuoTone='greenToBlue'>
          Cập nhật
        </Button>
        {
          publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>
        }
      </form>
    </div>
  )
}
