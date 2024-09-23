import React, { useEffect, useState } from 'react';
import { IoSearchOutline, IoClose } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';

const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearchUser = async () => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
        try {
            setLoading(true);
            const response = await axios.post(URL, { search });
            setLoading(false);
            setSearchUser(response.data.data);
        } catch (error) {
            toast.error(error?.response?.data?.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search) {
            handleSearchUser();
        } else {
            setSearchUser([]);
        }
    }, [search]);

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#0e1223] bg-opacity-90 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10'>
                {/** Input search user */}
                <div className='bg-[#1a1f38] rounded h-14 overflow-hidden flex'>
                    <input 
                        type='text'
                        placeholder='Search user by name, email....'
                        className='w-full outline-none py-1 h-full px-4 bg-[#f1f5f9] text-black'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <div className='h-14 w-14 flex justify-center items-center bg-[#1a1f38]'>
                        <IoSearchOutline size={25} className='text-white' />
                    </div>
                </div>

                {/** Display search user */}
                <div className='bg-[#1a1f38] mt-2 w-full p-4 rounded'>
                    {/** No user found */}
                    {
                        searchUser.length === 0 && !loading && (
                            <p className='text-center text-[#a8b2c1]'>No user found!</p>
                        )
                    } 

                    {loading && (
                        <p><Loading /></p>
                    )}

                    {searchUser.length !== 0 && !loading && (
                        searchUser.map((user) => (
                            <UserSearchCard key={user._id} user={user} onClose={onClose} />
                        ))
                    )}
                </div>
            </div>

            <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl text-white hover:text-[#48ff48]' onClick={onClose}>
                <button>
                    <IoClose />
                </button>
            </div>
        </div>
    );
}

export default SearchUser;
