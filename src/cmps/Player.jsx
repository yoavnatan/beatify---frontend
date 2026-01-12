import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import ReactPlayer from 'react-player'
export function Player() {
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false)
    const [src, setSrc] = useState(null)

    return (
        <div className="player container">
            <button onMouseDown={() => {
                setSrc("https://www.youtube.com/watch?v=3L357t3uitg&list=RD3L357t3uitg&start_radio=1")
                // setPlaying(false)
            }}
                onMouseUp={() => setPlaying(prevState => !prevState)}>לחץ כאן לשמיעה</button>
            <div style={{
                visibility: 'hidden',
                position: 'absolute',
                top: '-100%'
            }}>
                <ReactPlayer
                    ref={playerRef}
                    src={src}
                    controls={true}
                    width="100%"
                    height="100%"
                    playing={playing}
                    muted={false}
                    config={{
                        youtube: {
                            color: 'white'
                        },
                    }}
                />
            </div>
        </div>
    )
}
