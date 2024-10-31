"use client"
import {useEffect, useRef, useState } from 'react';
import {socket} from "../socket"
import { ArrowBigLeft, ArrowDown, SendIcon } from 'lucide-react';

export default function Chat({}) {

type UserMessage = {
  client: string,
  username: string,
  message: string
}

type User = {
  client: string,
  username: string
}


  const [messages, setMessages] = useState<UserMessage[]>([])
  const [inputMessage, setInputMessage] = useState<string>("");

  const getUsername = (): string => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const username = params.get('username');
      return username ? String(username) : "unavailable";
    }
    return "unavailable";
  };
  
  const username: string = getUsername();
  
  const [users, setUsers] = useState<User[]>([])

  const messagesViewRef = useRef<HTMLInputElement>(null)

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");

  

  

  useEffect(() => {
    
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      console.log("Username: "+username)
      socket.emit("join", {
        username: username
      })
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on('incomingmessage', (data: UserMessage) => {
      // Handle incoming message data
      console.log('Received message:', data);
      setMessages((prevState) => [...prevState, data])
    });

    socket.on("usersUpdate", (data: User[]) =>{
      setUsers(data)
    })

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() =>{
      console.log(messages)
      if(messagesViewRef.current == null){
        return
      }
      messagesViewRef.current.scrollTop = messagesViewRef.current.scrollHeight
  }, [messages])

  function handleSendMessage() {
    console.log("trying to send message")

    if(inputMessage == "" || inputMessage == null){
      return
    }
    try{
      socket.send({
        username: username,
        message: inputMessage
      })
      setInputMessage("")
      console.log("message sent")
    }catch(err){
      console.error(err)
    }
  }
  

  
  /*
  return(
    <div className='w-full h-[100vh] flex flex-col '>
      <div className='p-1.5 bg-blue-500 text-white font-bold flex-col items-center justify-center w-full flex rounded-b-lg'>
       <p className='mb-3 text-3xl p-3'>Welcome to the chat {username}</p>
       
       
      
      </div>

      <div className='overflow-y-auto justify-end flex-grow border-2 m-2 rounded-lg border-gray-300' ref={messagesViewRef}>
       <ul>
      {
        messages.map((curr, index) =>{
          return <li key={index} className={(curr.username == username ? "bg-green-300" : "bg-red-300")+" p-1"}>
              <p>{curr.username}: {curr.message}</p>
          </li>
        })
      }
      </ul>
      </div>

      <div className='flex flex-row mx-2'>
      <input value={String(inputMessage)} onKeyDown={(e) => {
        if(e.keyCode == 13) {handleSendMessage()}
      }} onChange={e => setInputMessage(e.target.value)} className="border-2 border-gray-400 rounded-lg p-1 mr-auto w-full rounded-r-none border-r-0" type='text' placeholder='Type your message here...'></input>
      <button className='border-2 border-gray-300  rounded-lg rounded-l-none p-2 bg-blue-500 text-white text-xl ' onClick={handleSendMessage}><SendIcon/></button>
      </div>
      <div className='flex flex-col bg-blue items-center w-full p-3'>
        <p className='text-2xl font-bold pt-4'>Online users</p>
        <ul className='flex flex-row gap-4'>
          {users.map((curr, index) => <li key={index}>{curr.username}</li>)}
       </ul>
       <div className='flex flex-row w-full items-center justify-around'>
        <p>Status: <span className={isConnected ? "text-green-400" : "text-red-500"}>{ isConnected ? "connected" : "disconnected" }</span></p>
        <p>Transport: { transport }</p>
       </div>
      </div>
      
    </div>
  )
    */

  
  return (
    <div className="flex w-full max-w-4xl mx-auto border shadow-md rounded-lg max-h-lvh">
      {/* Online Users Sidebar */}
      <div className="w-1/3 bg-gray-200 border-r p-2 pt-4">
        <h2 className="font-bold mb-2">Online Users</h2>
        <ul className="gap-0.5 overflow-y-auto flex-1 h-lvh">
          {users.map((user, index) => (
            <li key={index} className="p-2 rounded hover:bg-gray-300 transition">
              {user.username}
            </li>
          ))}
        </ul>
      </div>
  
      {/* Chat Area */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <header className="bg-blue-500 text-white text-lg p-4">
          Welcome {username}
        </header>
  
        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-white h-full"> {/* Increased initial height */}
          <div className="space-y-2 h-100">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-start">
                <span className="font-semibold">{msg.username}:</span>
                <span className="ml-2">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
  
        {/* Input Area */}
        <div className="flex p-4 border-t bg-gray-50">
          <input
            type="text"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if(e.keyCode == 13) {handleSendMessage()}
            }}
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
  
  
}