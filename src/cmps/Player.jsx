import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux';
import { SET_IS_PLAYING, SET_SRC } from '../store/reducers/player.reducer';
import Play from "../assets/svg/play.svg?react"
import Pause from "../assets/svg/pause.svg?react"

export function Player() {
    const playerRef = useRef(null);
    const playing = useSelector(storeState => storeState.playerModule.playing)
    const src = useSelector(storeState => storeState.playerModule.src)
    const dispatch = useDispatch()

    return (
        <div className="player container">
            <div className="btn-play" onMouseDown={() => {
                dispatch({ type: SET_SRC, src: "https://www.youtube.com/watch?v=85qgguw11P4&list=RD85qgguw11P4&start_radio=1" })
            }}
                onMouseUp={() => dispatch({ type: SET_IS_PLAYING })
                }>{(playing)
                    ?
                    <Pause className="icon small black" />
                    :
                    <Play className="icon small black" />}</div>
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

<div className="btn-play">

</div>

