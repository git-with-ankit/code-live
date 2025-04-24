import React, { useState } from "react";
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

const Home = ()=>{
    const navigate = useNavigate();
    const [roomId,setRoomId] = useState("");
    const [username,setUsername] = useState("");

    const createNewRoom=(e)=>{
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room')
    }
    const joinRoom=(e)=>{
        if(!roomId || !username){
            toast.error('Room Id and Username is required.');
            return ;
        
        }
        navigate(`/editor/${roomId}`,{
            state:{
                username, //oassing username to the new page
            }
        })
    }
    const handleInputEnter=(e)=>{
        if(e.code === 'Enter'){
            joinRoom();
        }
    }
    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img className="homePageLogo" src="code-live.jpg" alt="code-live-logo" />
                <h4>Enter into your collaborative space</h4>
                <div className="inputGroup">
                    <input type="text" className="inputBox" placeholder="ROOM ID" onChange={(e)=>setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter}/>
                    <input type="text" className="inputBox" placeholder="USERNAME" onChange={(e)=>setUsername(e.target.value)} value={username}/>
                    <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a onClick={createNewRoom} href=" " className="createNewBtn">new room</a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Home