import axios from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';

import { toast } from 'react-toastify';
import { headers } from '../Api/auth';

const ResetPassword = () => {
    const [newPassword,setNewPassword] = useState("")
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    console.log(tokenParam);
    const {isLoading,mutateAsync : handleSubmit} = useMutation(async () => {
        try {
            const data ={
                newPassword,
                token: tokenParam
            }
            return await axios.post("http://localhost:8888/api/v1/identity/auth/reset-password",JSON.stringify(data),{headers: headers})
        } catch (error) {
            console.log(error);
            
        }
    }, {onSuccess: (data) => {
        if(data?.status == 200){
            toast.success("Đặt lại mật khẩu thành công");
            window.location.href = "/"
        }
        
    }})
  
    return (
        <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center' >
            <div className='rounded-md bg-white p-4 flex flex-col gap-4'>
                <h1 className=''>Đặt lại mật khẩu</h1>
                <input type='password' onChange={(e) => setNewPassword(e.target.value)} className='' placeholder='New password'/>
                <button
          type="button"
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-primary rounded-md hover:bg-buttondark focus:outline-none"
          onClick={() => handleSubmit()}
        >
            Đặt lại
          
        </button>
            </div>
        </div>
    );
};

export default ResetPassword;