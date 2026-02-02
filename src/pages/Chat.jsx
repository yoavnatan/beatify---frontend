import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG } from '../services/socket.service'
import Arrow from "../assets/svg/nav-arrow.svg?react"
import { useLocation, useNavigate } from 'react-router'


export function Chat() {
    const [msg, setMsg] = useState({ txt: '' })
    const [msgs, setMsgs] = useState([])
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const location = useLocation()
    const navigate = useNavigate();

    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg)
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg)
        }
    }, [])

    function addMsg(newMsg) {
        setMsgs(prevMsgs => [...prevMsgs, newMsg])
    }
    function expandLibraryToNormal() {
        window.dispatchEvent(new CustomEvent("expand-library-to-normal"))
    }

    function sendMsg(ev) {
        ev.preventDefault()
        if (!msg.txt.trim()) return

        const from = loggedInUser?.fullname || 'Me'
        const newMsg = { from, txt: msg.txt }

        socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg)
        setMsg({ txt: '' })
    }


    function handleFormChange(ev) {
        const { value } = ev.target
        setMsg(prevMsg => ({ ...prevMsg, txt: value }))
    }

    return (
        <>
            <div className="chat-expand-btn" onClick={() => {
                expandLibraryToNormal()
            }}>
                💬
            </div>
            <section className="chat">
                <h2 className="chat-header">Chat Room</h2>
                <ul className="messages">
                {msgs.map((msg, idx) => {
                    const isOwn = msg.from === (loggedInUser?.fullname || 'Me')
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    return (
                        <li 
                            key={idx} 
                            className={`msg-bubble ${isOwn ? 'own' : ''}`}
                        >
                            <div className="msg-header">
                                <span className="msg-from">{msg.from}</span>
                            </div>
                            <div className="msg-text">{msg.txt}</div>
                            <div className="msg-time">{time}</div>
                        </li>
                    )
                })}
            </ul>


                <form onSubmit={sendMsg}>
                    <input
                        type="text" value={msg.txt} onChange={handleFormChange}
                        name="txt" autoComplete="off" />
                    <button disabled={!msg.txt.trim()}>Send</button>
                </form>

                {location.pathname === '/chatMobile' && <div className="back-icon"
                    onClick={() => navigate('/listeningRoom')}>
                    Back  <Arrow className='icon medium' />
                </div>}
            </section>
        </>

    )
}


