import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux';
import { SET_IS_PLAYING, SET_IS_SEEKING, SET_PLAYED, SET_PLAYED_SECONDS, SET_SRC, SET_VOLUME } from '../store/reducers/player.reducer.js';
import Play from "../assets/svg/play.svg?react"
import Pause from "../assets/svg/pause.svg?react"
import PlayNext from "../assets/svg/play-next.svg?react"
import PlayPrev from "../assets/svg/play-prev.svg?react"
import Shuffle from "../assets/svg/shuffle.svg?react"
import Repeat from "../assets/svg/repeat.svg?react"

export function Player() {

    // const [value, setValue] = useState(played);


    const playerRef = useRef(null);
    const { playing, src, seeking, played, volume } = useSelector(storeState => storeState.playerModule)
    const dispatch = useDispatch()

    const min = 0;
    const max = 1;
    function getDurationBackgroundSize() {
        return {
            backgroundSize: `${(played - min) * 100 / (max - min)}% 100%`,
        }
    }

    function getVolumeBackgroundSize() {
        return {
            backgroundSize: `${(volume - min) * 100 / (max - min)}% 100%`,
        }
    }

    function handleSeekMouseDown() {
        dispatch({ type: SET_IS_SEEKING, seeking: true })
    }

    const handleSeekChange = (event) => {
        const inputTarget = event.target
        dispatch({ type: SET_PLAYED, played: Number.parseFloat(inputTarget.value) })
        console.log('played:', played)
    };

    const handleSeekMouseUp = (event) => {
        const inputTarget = event.target
        dispatch({ type: SET_IS_SEEKING, seeking: false })
        if (playerRef.current) {
            playerRef.current.currentTime = Number.parseFloat(inputTarget.value) * playerRef.current.duration;
            console.log(playerRef.current.currentTime)
        }
    };

    function handleVolumeChange(event) {
        const inputTarget = event.target
        dispatch({ type: SET_VOLUME, volume: Number.parseFloat(inputTarget.value) })
    };


    function handleTimeUpdate() {
        const player = playerRef.current;
        // We only want to update time slider if we are not currently seeking
        if (!player || seeking) return;

        console.log('onTimeUpdate', player.currentTime);
        console.log('onTimeUpdate', player.duration);
        // dispatch({ type: SET_PLAYED_SECONDS, playedSeconds: player.currentTime })
        dispatch({ type: SET_PLAYED, played: player.currentTime / player.duration })
        console.log(played)
    }

    function Duration({ className, seconds }) {
        return (
            <time dateTime={`P${Math.round(seconds)}S`} className={className}>
                {format(seconds)}
            </time>
        );
    }

    function format(seconds) {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = pad(date.getUTCSeconds());

        if (hh) {
            return `${hh}:${pad(mm)}:${ss}`;
        }

        if (ss > 0) {
            return `${mm}:${ss}`;
        }

        return '0:00'

    }

    function pad(value) {
        return (`0${value}`).slice(-2);
    }



    return (
        <section className="player container flex ">
            <div className='now-playing'></div>
            <div className='main-container flex column'>
                <div className="controls flex">
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

                <div className='info flex'>
                    {playerRef.current && src && <Duration seconds={playerRef.current.duration * played} className={'timer'} />}
                    <div className="progress-bar flex ">
                        <input
                            style={getDurationBackgroundSize()}
                            id="seek"
                            type="range"
                            min={min}
                            max={max}
                            step="any"
                            value={played}
                            onMouseDown={handleSeekMouseDown}
                            onChange={handleSeekChange}
                            onMouseUp={handleSeekMouseUp}
                        />
                    </div>
                    {playerRef.current && src && <Duration seconds={playerRef.current.duration} className={'timer'} />}
                </div>
            </div>

            <div className="volume-controls">
                <input
                    style={getVolumeBackgroundSize()}
                    id="volume"
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
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
                    volume={volume}
                    muted={false}
                    onTimeUpdate={handleTimeUpdate}

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

