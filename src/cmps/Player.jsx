import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux';
import { SET_IS_PLAYING, SET_IS_SEEKING, SET_LAST_VOLUME, SET_PLAYED, SET_PLAYED_SECONDS, SET_SRC, SET_VOLUME, TOGGLE_MUTE, TOGLLE_LOOP, TOGLLE_SHUFFLE } from '../store/reducers/player.reducer.js';
import Play from "../assets/svg/play.svg?react"
import Pause from "../assets/svg/pause.svg?react"
import PlayNext from "../assets/svg/play-next.svg?react"
import PlayPrev from "../assets/svg/play-prev.svg?react"
import Shuffle from "../assets/svg/shuffle.svg?react"
import Repeat from "../assets/svg/repeat.svg?react"
import VolumeMute from "../assets/svg/volume-mute.svg?react"
import VolumeLow from "../assets/svg/volume-low.svg?react"
import VolumeMid from "../assets/svg/volume-mid.svg?react"
import VolumeHigh from "../assets/svg/volume-high.svg?react"
import Queue from "../assets/svg/queue.svg?react"
import FullScreen from "../assets/svg/full-screen.svg?react"
import Tippy from '@tippyjs/react';

import 'tippy.js/dist/tippy.css';


export function Player() {

    const playerRef = useRef(null);
    let { playing, src, seeking, played, volume, muted, shuffle, lastVolume, loop } = useSelector(storeState => storeState.playerModule)
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

    function onToggleMute() {
        console.log(volume)
        if (volume === 0 && !muted) {
            dispatch({ type: SET_VOLUME, volume: 0.1 })
        }
        dispatch({ type: TOGGLE_MUTE, muted: volume !== 0 ? !muted : false })
    }

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

    function onSetLastVolume(ev) {
        console.log('last')
        dispatch({ type: SET_LAST_VOLUME, lastVolume: ev.target.value })
    }

    function handleVolumeChange(event) {
        const inputTarget = event.target
        dispatch({ type: TOGGLE_MUTE, muted: false })
        dispatch({ type: SET_VOLUME, volume: Number.parseFloat(inputTarget.value) })
    };

    function onToggleShuffle() {
        dispatch({ type: TOGLLE_SHUFFLE })
    }

    function onToggleLoop() {
        dispatch({ type: TOGLLE_LOOP })
    }

    function handleTimeUpdate() {
        const player = playerRef.current;
        // We only want to update time slider if we are not currently seeking
        if (!player || seeking) return;

        // dispatch({ type: SET_PLAYED_SECONDS, playedSeconds: player.currentTime })
        dispatch({ type: SET_PLAYED, played: player.currentTime / player.duration })
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


    if (muted) volume = 0;

    return (
        <section className="player container flex ">
            <div className='now-playing'></div>
            <div className='main-container flex column'>
                <div className="controls flex">

                    <div className={`shuffle ${shuffle ? ' on' : ''}`} >
                        <Tippy content={`${shuffle ? 'Disable' : 'Enable'} shuffle mode`} delay={[500, 0]} arrow={false}>
                            <span className="tooltip-wrapper">
                                <Shuffle className={`icon small`} onClick={onToggleShuffle} />
                            </span>
                        </Tippy>
                    </div>
                    <Tippy content={'Previous'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                        <span className="tooltip-wrapper">
                            <PlayPrev className="icon small" />
                        </span>
                    </Tippy>
                    <div className="btn-play" onMouseDown={() => {
                        dispatch({ type: SET_SRC, src: "https://www.youtube.com/watch?v=1e8mzCW0nlU&list=RD85qgguw11P4&index=2" })
                    }}
                        onMouseUp={() => dispatch({ type: SET_IS_PLAYING })
                        }>{(playing)
                            ?
                            <Tippy content={'Pause'} delay={[500, 0]} offset={[0, 15]} arrow={false} key="pause-tip">
                                <span className="tooltip-wrapper"><Pause className="icon small black" /></span>
                            </Tippy>
                            :
                            <Tippy content={'Play'} delay={[500, 0]} offset={[0, 15]} arrow={false} key="play-tip">
                                <span className="tooltip-wrapper"><Play className="icon small black" /></span>
                            </Tippy>
                        }
                    </div>

                    <Tippy content={'Next'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                        <span className="tooltip-wrapper">
                            <PlayNext className="icon small" />
                        </span>
                    </Tippy>

                    <div className={`repeat ${loop ? ' on' : ''}`} >
                        <Tippy content={`${loop ? 'Disable' : 'Enable'} repeat mode`} delay={[500, 0]} arrow={false}>
                            <span className="tooltip-wrapper">
                                <Repeat className={`icon small`} onClick={onToggleLoop} />
                            </span>
                        </Tippy>
                    </div>

                </div>

                <div className='info flex'>
                    <div className='timer'> {playerRef.current && src && <Duration seconds={playerRef.current.duration * played} />}</div>
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
                    <div className='timer'>  {playerRef.current && src && <Duration seconds={playerRef.current.duration} />} </div>
                </div>
            </div>

            <div className="volume-controls flex align-center">
                <Tippy content={'Queue'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                    <span className="tooltip-wrapper">
                        <Queue className="icon small" />
                    </span>
                </Tippy>

                <div className="inner-container">
                    <div className="volume-icon" onClick={onToggleMute}>
                        {volume === 0 &&
                            <Tippy content={'Unmute'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                                <span className="tooltip-wrapper">
                                    <VolumeMute className="icon small" />
                                </span>
                            </Tippy>
                        }
                        <Tippy content={'Mute'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                            <span className="tooltip-wrapper">
                                {!muted && volume > 0 && volume < 0.3 && <VolumeLow className="icon small" />}
                                {!muted && volume >= 0.3 && volume < 0.7 && <VolumeMid className="icon small" />}
                                {!muted && volume >= 0.7 && < VolumeHigh className="icon small" />}                            </span>
                        </Tippy>

                    </div>
                    <div className="volume-bar flex ">
                        <input
                            onMouseDown={onSetLastVolume}
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
                </div>
                <Tippy content={'Enter full screen'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                    <span className="tooltip-wrapper">
                        <FullScreen className="icon small" />
                    </span>
                </Tippy>
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
                    muted={muted}
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

