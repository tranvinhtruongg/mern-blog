import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { AiOutlineAudio } from "react-icons/ai";  // Import microphone icon

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("vi-VN");  // Default to Vietnamese

  const navigate = useNavigate();

  const handleUpLoadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Vui lòng chọn ảnh');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError('Upload ảnh thất bại');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Upload ảnh thất bại');
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  // Speech-to-text functionality
  const handleStartListening = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language; // Set language based on the selected option
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onspeechend = () => {
        setIsListening(false);
        recognition.stop();
      };

      recognition.onresult = (event) => {
        const speechResult = event.results[event.resultIndex][0].transcript;
        setFormData({ ...formData, content: speechResult }); // Update formData with speech input
      };

      recognition.onerror = (event) => {
        console.error(event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech Recognition API is not supported in this browser.');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        toast.success('Đăng bài thành công, đợi Admin duyệt bài');
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      toast.error('Đăng bài thất bại');
      setPublishError('Đăng bài thất bại');
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl m-7 font-semibold">Tạo bài viết mới</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="uncategorized">Chọn danh mục</option>
            <option value="maytinh">Máy tính</option>
            <option value="phanmem">Phần mềm & Games</option>
            <option value="vuichoigiaitri">Khu vui chơi giải trí</option>
            <option value="thuongmai">Khu thương mại</option>
            <option value="congnghe">Sản phẩm công nghệ</option>
          </Select>
        </div>

        {/* Image Upload Section */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpLoadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
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

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        {/* Language Selection */}
        <div className="mt-4">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="vi-VN">Tiếng Việt</option>
            <option value="zh-CN">Tiếng Trung (Giản thể)</option>
            <option value="zh-TW">Tiếng Trung (Phồn thể)</option>
            <option value="en-US">Tiếng Anh </option>
          </Select>
        </div>

        {/* Voice Input Section */}
        <div className="flex gap-4 items-center mt-4">
          <Button
            type="button"
            onClick={handleStartListening}
            disabled={isListening}
            gradientDuoTone="tealToBlue"
            className="flex items-center gap-2"
          >
            <AiOutlineAudio size={24} />
            {isListening ? 'Đang ghi âm...' : 'Ghi âm giọng nói'}
          </Button>
        </div>

        {/* ReactQuill Editor */}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          value={formData.content || ""}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button type="submit" gradientDuoTone="greenToBlue">
          Đăng bài
        </Button>

        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
