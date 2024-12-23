import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage,ref,uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateFailure,updateSuccess,deleteFailure,deleteStart,deleteSuccess,signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function DashProfile() {
    const { currentUser,error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImageFile(file);
          setImageFileUrl(URL.createObjectURL(file));
        }
      };
      useEffect(() => {
        if (imageFile) {
          uploadImage();
        }
      }, [imageFile]);
    
    const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
        'state_changed',
        (snapshot) => {
        const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
        setImageFileUploadError(
            'Không thể tải lên hình ảnh (Tệp phải nhỏ hơn 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        },
        () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formData, profilePicture: downloadURL });
            setImageFileUploading(false);
        });
        }
    );
    };
    

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
          setUpdateUserError('Không có thay đổi nào được thực hiện');
          return;
        }
        if (imageFileUploading) {
          setUpdateUserError('Vui lòng chờ tải lên hình ảnh');
          return;
        }
        try {
          dispatch(updateStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
          } else {
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("Cập nhật hồ sơ người dùng thành công");
          }
        } catch (error) {
          dispatch(updateFailure(error.message));
          setUpdateUserError(error.message);
        }
      };
      const handleDeleteUser = async ()=>{
        setShowModal(false);
        try{
          dispatch(deleteStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`,{
            method:'DELETE'
          })
          const data = await res.json();
          if(!res.ok){
            dispatch(deleteFailure(data.message))
          }else{
            dispatch(deleteSuccess(data));
          }
        }
        catch(error){
            dispatch(deleteFailure(error.message));
        }
      }
  
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
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>
            profile
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full " 
            onClick={()=>filePickerRef.current.click()}>
                {imageFileUploadProgress && (
                    <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
                    strokeWidth={5}
                    styles={{
                        root:{height:'100%',width:'100%',position:'absolute',top:0,left:0},
                        path:{
                            stroke:`rgba(62,152,199),${imageFileUploadProgress /100})`,

                        }
                    }}
                    />
                )}
                <img src={imageFileUrl || currentUser.profilePicture} alt='user' 
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] 
                ${imageFileUploadProgress && imageFileUploadProgress <100 && 'opacity-60'}`}/>
            </div>
            {imageFileUploadError &&
                <Alert color='failure'>
                    {imageFileUploadError}
                </Alert>
            }
            <TextInput type='text' id='username' placeholder='Tên người dùng' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' placeholder='Mật khẩu' onChange={handleChange} />
            <Button type='submit'  gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            {/* {currentUser.isAdmin && ( */}
              <Link to={'/create-post'}>
                <Button type='button' gradientDuoTone='greenToBlue' className='w-full'>
                  Tạo bài viết
                </Button>
              </Link>
            {/* )} */}
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Xóa tài khoản</span>
            <span onClick={handleSignout} className='cursor-pointer'>Đăng xuất</span>
        </div>
        {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
        )}
        {updateUserError && (
            <Alert color='failure' className='mt-5'>
            {updateUserError}
            </Alert>
        )}
        {error && (
            <Alert color='failure' className='mt-5'>
            {error}
            </Alert>
        )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Bạn có chắc chắn muốn xóa tài khoản?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Vâng, tôi muốn xóa.
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
        </Modal>
    </div>
  )
}
