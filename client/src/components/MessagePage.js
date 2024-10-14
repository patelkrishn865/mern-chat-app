import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import Loading from './Loading';
import moment from 'moment';
import { uploadFile } from '../service/api'; // Import the uploadFile function

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });
  const [message, setMessage] = useState({
    text: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const [file, setFile] = useState(''); // New state for handling file input
  const [result, setResult] = useState('');
  const currentMessage = useRef(null);
  const fileInputRef = useRef(); // Ref for file input

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const onUploadClick = () => {
    fileInputRef.current.click();
  }

  const handleOnChange = (e) => {
    const { value } = e.target;

    setMessage(prev => ({
      ...prev,
      text: value
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (file) {
      const data = new FormData();
      data.append("name", file.name);
      data.append("file", file);

      const response = await uploadFile(data); // Upload the file // Assuming response contains the file path
      setResult(response.path);
    }

    if (message.text || result) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text || "", 
          fileurl: result, // Send message text     // Send file URL if available
          msgByUserId: user?._id
        });
        setMessage({ text: "" });
        setFile(null); // Reset file after sending
      }
    }
  };

 
  return (
    <div className='bg-[#0c0e20] min-h-screen'>
      <header className='sticky top-0 h-16 bg-[#12172e] flex justify-between items-center px-4 text-white shadow-md'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden text-white'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-white'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {dataUser.online ? <span className='text-[#21e06d]'>online</span> : <span className='text-slate-400'>offline</span>}
            </p>
          </div>
        </div>
        <div>
          <button className='cursor-pointer text-white'>
            <HiDotsVertical size={25} />
          </button>
        </div>
      </header>

      {/*** Show all messages ***/}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-[#0c0e20]'>
        <div className='flex flex-col gap-2 py-2 px-4' ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div key={index} className={`p-2 rounded-lg w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-[#21e06d] text-[#0c0e20]" : "bg-[#12172e] text-white"}`}>
              <p className='px-2'>{msg.text}</p>
              {result && (
                <a href={result} target="_blank" rel="noopener noreferrer" className="text-[#21e06d] underline">
                  {result}
                </a>
              )}
              <p className={`text-xs ml-auto w-fit ${user._id === msg?.msgByUserId ? 'text-[#0a5225]' : 'text-slate-400'}`}>
                {moment(msg.createdAt).format('hh:mm')}
              </p>
            </div>
          ))}
        </div>
        {loading && (
          <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
            <Loading />
          </div>
        )}
      </section>

      {/*** Send message and upload file ***/}
      <section className='h-16 bg-[#12172e] flex items-center px-4'>
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type your message...'
            className='py-2 px-4 outline-none w-full h-full bg-[#1a1f35] text-white rounded-md'
            value={message.text}
            onChange={handleOnChange}
          />
          
          <input 
            type="file" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <button type="button" onClick={() => onUploadClick()} className='text-[#21e06d] hover:text-white'>
            Upload File
          </button>

          <button type="submit" className='text-[#21e06d] hover:text-white'>
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
