import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import moment from 'moment';

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
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socketConnection) {
      // Fetch user data and previous messages when connected
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);

      const handleUserDetails = (data) => {
        setDataUser(data);
      };

      const handleMessage = (newMessages) => {
        // Add new messages to existing messages, avoiding duplicates
        setAllMessage((prevMessages) => {
          const messageIds = new Set(prevMessages.map(msg => msg._id));
          const filteredMessages = newMessages.filter(msg => !messageIds.has(msg._id));
          return [...prevMessages, ...filteredMessages];
        });
      };

      socketConnection.on('message-user', handleUserDetails);
      socketConnection.on('message', handleMessage);

      // Cleanup socket event listeners on unmount
      return () => {
        socketConnection.off('message-user', handleUserDetails);
        socketConnection.off('message', handleMessage);
      };
    }
  }, [socketConnection, params?.userId]);

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const newMessage = {
      sender: user?._id,
      receiver: params.userId,
      text: message,
      msgByUserId: user?._id,
      createdAt: new Date().toISOString(),
    };

    // Immediately add the new message to the state
    setAllMessage((prevMessages) => [...prevMessages, newMessage]);

    if (socketConnection) {
      socketConnection.emit('new message', newMessage);
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <div className='bg-[#0e1223]'>
      <header className='sticky top-0 h-16 bg-[#1a1f38] flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
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
            <p className='-my-2 text-sm text-gray-400'>
              {dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>}
            </p>
          </div>
        </div>
        <div>
          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative'>
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div key={index} className={`flex ${user._id === msg?.msgByUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 py-1 rounded max-w-[280px] ${user._id === msg?.msgByUserId ? 'bg-teal-100' : 'bg-[#1a1f38] text-white'}`}>
                <p>{msg.text}</p>
                <small className='block text-[10px] text-gray-400'>{moment(msg.createdAt).fromNow()}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className='sticky bottom-0 h-16 bg-[#1a1f38]'>
        <form className='flex h-full items-center' onSubmit={handleSendMessage}>
          <input 
            type="text" 
            className='w-full h-full outline-none px-4 text-sm bg-[#2d344b] text-white placeholder-gray-400'
            placeholder='Type your message...'
            value={message}
            onChange={handleOnChange}
          />
          <button type="submit" className='p-4 bg-[#48ff48] hover:bg-[#3ae43a]'>
            <IoMdSend size={28} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default MessagePage;
