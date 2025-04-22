import React, { useState } from "react";
import {v4 as uuidV4} from 'uuid';

const Home = ()=>{
    const [roomId,setRoomId] = useState("");

    const createNewRoom=(e)=>{
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
    }
    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img className="homePageLogo" src="code-live.jpg" alt="code-live-logo" />
                <h4>Enter into your collaborative space</h4>
                <div className="inputGroup">
                    <input type="text" className="inputBox" placeholder="ROOM ID" onChange={(e)=>setRoomId(e.target.value)} value={roomId}/>
                    <input type="text" className="inputBox" placeholder="USERNAME"/>
                    <button className="btn joinBtn">Join</button>
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