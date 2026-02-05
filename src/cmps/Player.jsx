import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_PLAY, SET_IS_SEEKING, SET_LAST_VOLUME, SET_PLAYED, SET_PLAYED_SECONDS, SET_SRC, SET_VOLUME, TOGGLE_MUTE, TOGLLE_LOOP, TOGLLE_SHUFFLE, PLAY, SET_LAST_CLICKED, TOGGLE_QUEUE_SHOW, REMOVE_FROM_QUEUE, SHUFFLE_ON, SHUFFLE_OFF } from '../store/reducers/player.reducer.js';
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
import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"
import FullScreen from "../assets/svg/full-screen.svg?react"
import Tippy from '@tippyjs/react';

import 'tippy.js/dist/tippy.css';
import { setSong } from '../store/actions/player.actions.js';
import { updateUser, updateUserOptimistic } from '../store/actions/user.actions.js';
import { loadStation, loadStations, updateStation } from '../store/actions/station.actions.js';
import { showSuccessMsg } from '../services/event-bus.service.js';
import { searchMusicService } from '../services/searchMusic.service.js';
import { getRandomIntInclusive, shuffleArray } from '../services/util.service.js';
import { SET_NOW_PLAYING_STATION, SET_STATION_SONGS } from '../store/reducers/station.reducer.js';
import { SOCKET_EMIT_OFF_LOOP, SOCKET_EMIT_OFF_SHUFFLE, SOCKET_EMIT_ON_LOOP, SOCKET_EMIT_ON_SHUFFLE, SOCKET_EMIT_PLAY, SOCKET_EMIT_TOGGLE_PLAY, SOCKET_EVENT_OFF_SHUFFLE, SOCKET_EVENT_ON_SHUFFLE, socketService } from '../services/socket.service.js';
import { useLocation } from 'react-router';


export function Player() {

    const playerRef = useRef(null);
    const { user } = useSelector(storeState => storeState.userModule)
    let { playing, nowPlaying, src, seeking, played, volume, muted, shuffle, lastVolume, loop, queue, queueShown, lastClickedSong } = useSelector(storeState => storeState.playerModule)
    const { stationSongs, stations, nowPlaying: nowPlayingStationId } = useSelector(
        (storeState) => storeState.stationModule,
    );

    const location = useLocation()
    const lastIdx = useRef()
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
        dispatch({ type: SET_LAST_VOLUME, lastVolume: ev.target.value })
    }

    function handleVolumeChange(event) {
        const inputTarget = event.target
        dispatch({ type: TOGGLE_MUTE, muted: false })
        dispatch({ type: SET_VOLUME, volume: Number.parseFloat(inputTarget.value) })
    };

    function onToggleShuffle() {
        if (nowPlayingStationId && !shuffle) {
            const shuffledPlaylist = shuffleArray(stationSongs)
            dispatch({ type: SET_STATION_SONGS, stationSongs: shuffledPlaylist })
            if (stations.find(s => s.isShared)._id === nowPlayingStationId) {
                socketService.emit(SOCKET_EMIT_ON_SHUFFLE, { stationSongs: shuffledPlaylist })
            }
        } else if (nowPlayingStationId && shuffle) {
            dispatch({ type: SET_STATION_SONGS, stationSongs: stations.find(station => station._id === nowPlayingStationId).songs })
            if (stations.find(s => s.isShared)._id === nowPlayingStationId) {
                socketService.emit(SOCKET_EMIT_OFF_SHUFFLE, { stationSongs: stations.find(station => station._id === nowPlayingStationId).songs })
            }
        }
        dispatch({ type: TOGLLE_SHUFFLE })
    }


    function onToggleLoop() {
        dispatch({ type: TOGLLE_LOOP })
        if (!loop && stations.find(s => s.isShared)._id === nowPlayingStationId) {
            socketService.emit(SOCKET_EMIT_ON_LOOP)
        } else if (loop && stations.find(s => s.isShared)._id === nowPlayingStationId) {
            socketService.emit(SOCKET_EMIT_OFF_LOOP)
        }
    }

    function onPlayNext() {

        let nextSongIdx
        if (queue.length > 0 && stations.find(s => s.isShared)._id !== nowPlayingStationId) {
            onPlayFromQueue()
            return
        }
        if (loop) {
            onPlayLoop()
            return
        } else {
            if (lastIdx.current) nextSongIdx = lastIdx.current + 1
            else {
                if (nowPlayingStationId === 'likedSongs') {
                    nextSongIdx = user.likedSongs.findIndex(s => s.id === nowPlaying.id) + 1
                }

                nextSongIdx = stationSongs.findIndex(s => s.id === nowPlaying.id) + 1
                lastIdx.current = null
            }
            if (stationSongs.length === nextSongIdx) nextSongIdx = 0
        }
        onPlaySearchedResult(stationSongs[nextSongIdx])
    }

    function onPlayFromQueue() {
        if (!lastIdx.current) lastIdx.current = stationSongs.findIndex(s => s.id === nowPlaying.id)
        onPlaySearchedResult(queue[0])
        dispatch({ type: REMOVE_FROM_QUEUE, song: queue[0] })
    }

    function onPlayPrev() {
        let prevSongIdx
        const currentIdx = stationSongs.findIndex(s => s.id === nowPlaying.id)
        prevSongIdx = currentIdx - 1
        if (prevSongIdx === -1) prevSongIdx = stationSongs.length - 1

        onPlaySearchedResult(stationSongs[prevSongIdx])
    }

    async function onPlaySearchedResult(search) {
        let song = search

        if (!search.src && nowPlayingStationId !== 'likedSongs') {
            song = await searchMusicService.getYoutubeURL(search)
            const songsToUpdate = stations.find(s => s._id === nowPlayingStationId).songs.map(s =>
                s.id === song.id ? { ...s, src: song.src } : s
            )
            const stationToUpdate = { ...stations.find(station => station._id === nowPlayingStationId), songs: songsToUpdate }
            await updateStation(stationToUpdate)

        }
        const data = { song, user }
        const prev = lastClickedSong
        dispatch({ type: SET_LAST_CLICKED, lastClickedSong: song })
        if (prev?.id === song.id) {
            dispatch({ type: TOGGLE_PLAY })
            if (stations.find(s => s.isShared)._id === nowPlayingStationId) {
                socketService.emit(SOCKET_EMIT_TOGGLE_PLAY, data)
            }
        } else {
            setSong(song)
            dispatch({ type: PLAY })
            if (stations.find(s => s.isShared)._id === nowPlayingStationId) {
                socketService.emit(SOCKET_EMIT_PLAY, data)
            }
            // dispatch({ type: SET_NOW_PLAYING_STATION, nowPlaying: station._id })
        }
    }

    async function onPlayLoop() {
        dispatch({ type: PLAY })
    }

    function onToggleQueueShow() {
        dispatch({ type: TOGGLE_QUEUE_SHOW })
    }
    function handleTimeUpdate() {
        const player = playerRef.current;
        // We only want to update time slider if we are not currently seeking
        if (!player || seeking) return;
        // dispatch({ type: SET_PLAYED_SECONDS, playedSeconds: player.currentTime })
        dispatch({ type: SET_PLAYED, played: player.currentTime / player.duration })
    }

    async function likeSong(songId) {
        const likedSongs = user.likedSongs
        if (user.likedSongs.includes(songId)) {
            let userToUpdate = { ...user, likedSongs: likedSongs.filter(song => song !== songId) }
            await updateUser(userToUpdate)
            showSuccessMsg('Song removed from Liked Songs')

        } else {
            const userToUpdate = { ...user, likedSongs: [songId, ...likedSongs] }
            await updateUser(userToUpdate)
            showSuccessMsg('Song added to Liked Songs')
        }
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
    const isSongLiked = (user?.likedSongs?.includes(nowPlaying.id))

    return (
        <section className="player container flex ">
            <div className='now-playing'>
                <img src={nowPlaying.imgUrl} />
                {nowPlaying.src && <div className="song-details">
                    <div className='song-title'>{nowPlaying.title}</div>
                    <div className='artist-name'>{nowPlaying.artist.name}</div>
                </div>}
                {nowPlaying.src && <div className={`like-button ${isSongLiked ? ' on' : ''}`}>
                    <Tippy content={`${isSongLiked ? 'Remove from' : 'Add to'} Liked Songs`} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                        <span className="tooltip-wrapper">
                            {!isSongLiked && <Like className="icon small" onClick={() => likeSong(nowPlaying.id)} />}
                            {isSongLiked && <Liked className="icon small" onClick={() => likeSong(nowPlaying.id)} />}
                        </span>
                    </Tippy>
                </div>}
            </div>

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
                            <PlayPrev className="icon small" onClick={onPlayPrev} />
                        </span>
                    </Tippy>
                    <div className="btn-play"
                        onClick={() => {
                            dispatch({ type: TOGGLE_PLAY })
                            if (stations.find(s => s.isShared)._id === nowPlayingStationId) {
                                socketService.emit(SOCKET_EMIT_TOGGLE_PLAY, { song: nowPlaying })
                            }
                        }
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
                            <PlayNext className="icon small" onClick={onPlayNext} />
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
                    <div className='timer'> {playerRef.current && nowPlaying && <Duration seconds={playerRef.current.duration * played} />}</div>
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
                    <div className='timer'>  {playerRef.current && nowPlaying && <Duration seconds={playerRef.current.duration} />} </div>
                </div>
            </div>

            <div className="volume-controls flex align-center">
                <div className={`queue-icon ${queueShown ? ' on' : ''}`}>
                    <Tippy content={'Queue'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                        <span className="tooltip-wrapper">
                            <Queue className="icon small" onClick={onToggleQueueShow} />
                        </span>
                    </Tippy>
                </div>
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
                    src={nowPlaying.src}
                    controls={true}
                    width="100%"
                    height="100%"
                    playing={playing}
                    volume={volume}
                    muted={muted}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={onPlayNext}
                    // onProgress={handleProgress}
                    config={{
                        youtube: {
                            color: 'white'
                        },
                    }}
                />
            </div>
        </section >
    )
}


