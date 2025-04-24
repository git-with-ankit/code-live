import React, { Component } from "react";
import toast from "react-hot-toast";
import { useState,useRef,useEffect } from "react";
import Client from "../components/Client"
import Editor from "../components/Editor"
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import { useLocation,useNavigate,Navigate,useParams } from "react-router-dom";


const EditorPage = ()=>{
    const [clients,setClients] = useState([]);
    const socketRef = useRef(null);
    const location = useLocation();
    const {roomId} = useParams();
    const reactNavigator = useNavigate();

    useEffect(()=>{
        const init = async()=>{
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err)=> handleErrors(err));
            socketRef.current.on('connect_failed', (err)=> handleErrors(err));

            function handleErrors(e){
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username: location.state?.username
            });

            socketRef.current.on(ACTIONS.JOINED , ({clients,username,sockedId})=>{
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined`)
                }
                setClients(clients);
            })

            socketRef.current.on(ACTIONS.DISCONNECTED,({socketId, username})=>{
                toast.success(`${username} left the room`);
                setClients((prev)=>{
                    return prev.filter(
                        (client) => client.socketId !== socketId
                    )
                })
            })
        }
        init();
        return ()=>{
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    },[])


    if(!location.state){
        return <Navigate to='/'/>
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src={process.env.PUBLIC_URL + '/code-live.jpg'} alt="code-live-logo" />
                       
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {
                            clients.map((client)=>(
                                <Client key={client.sockedId} username = {client.username}/>
                            ))
                        }
                    </div>
                </div>
                <button className="btn copyBtn">Copy Room Id</button>
                <button className="btn leaveBtn">Leave Room</button>
            </div>
            <div className="editorWrap">
                <Editor/>
            </div>
        </div>
    )
}

export default EditorPage