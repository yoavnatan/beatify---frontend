import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux';
import { SET_IS_PLAYING, SET_IS_SEEKING, SET_PLAYED, SET_SRC } from '../store/reducers/player.reducer.js';
import Play from "../assets/svg/play.svg?react"
import Pause from "../assets/svg/pause.svg?react"
import PlayNext from "../assets/svg/play-next.svg?react"
import PlayPrev from "../assets/svg/play-prev.svg?react"
import Shuffle from "../assets/svg/shuffle.svg?react"
import Repeat from "../assets/svg/repeat.svg?react"

export function Player() {
    const playerRef = useRef(null);
    const { playing, src, seeking, played } = useSelector(storeState => storeState.playerModule)
    const dispatch = useDispatch()

    function handleSeekMouseDown() {
        dispatch({ type: SET_IS_SEEKING, seeking: true })
    }

    const handleSeekChange = (event) => {
        const inputTarget = event.target
        dispatch({ type: SET_PLAYED, played: Number.parseFloat(inputTarget.value) })
    };

    const handleSeekMouseUp = (event) => {
        const inputTarget = event.target
        dispatch({ type: SET_IS_SEEKING, seeking: false })
        if (playerRef.current) {
            playerRef.current.currentTime = Number.parseFloat(inputTarget.value) * playerRef.current.duration;
        }
    };



    return (
        <section className="player container">

            <div className="controls flex justify-between">
                <Shuffle className="icon small" />
                <PlayPrev className="icon small" />
                <div className="btn-play" onMouseDown={() => {
                    dispatch({ type: SET_SRC, src: "https://www.youtube.com/watch?v=1e8mzCW0nlU&list=RD85qgguw11P4&index=2" })
                }}
                    onMouseUp={() => dispatch({ type: SET_IS_PLAYING })
                    }>{(playing)
                        ?
                        <Pause className="icon small black" />
                        :
                        <Play className="icon small black" />}
                </div>
                <PlayNext className="icon small" />
                <Repeat className="icon small" />
            </div>
            <div className="seek">
                <input
                    id="seek"
                    type="range"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={played}
                    onMouseDown={handleSeekMouseDown}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}

                />
            </div>


            <div style={{
                visibility: 'hidden',
                position: 'absolute',
                bottom: '100%'
            }}>
                <ReactPlayer
                    ref={playerRef}
                    src={src}
                    controls={true}
                    width="100%"
                    height="100%"
                    playing={playing}
                    muted={false}
                    // onProgress={handleProgress}
                    config={{
                        youtube: {
                            color: 'white'
                        },
                    }}
                />
            </div>
        </section>
    )
}

<div className="btn-play">

</div>

