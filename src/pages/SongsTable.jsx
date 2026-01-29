import Duration from "../assets/svg/duration.svg?react"
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Search from "../assets/svg/search.svg?react"
import Tippy from "@tippyjs/react"
import Trash from "../assets/svg/trash.svg?react"
import Delete from "../assets/svg/delete.svg?react"
import Plus from "../assets/svg/plus.svg?react"
import AddToQueue from "../assets/svg/queue-add.svg?react"
import Remove from "../assets/svg/remove.svg?react"
import ArrowInMenu from "../assets/svg/arrow-in-menu.svg?react"
import DropDownMenu from "../assets/svg/drop-down-menu.svg?react"
import Like from "../assets/svg/like.svg?react"
import Liked from "../assets/svg/liked.svg?react"
import Pause from "../assets/svg/pause.svg?react";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { Popover } from 'react-tiny-popover';
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../store/actions/user.actions.js"
import { formatTime } from "../services/util.service.js"
import { ADD_TO_QUEUE } from "../store/reducers/player.reducer.js"

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableSongRow } from "../cmps/sortableSongRow.jsx"
import { updateStation } from "../store/actions/station.actions.js"
import { UPDATE_STATION } from "../store/reducers/station.reducer.js"

export function SongsTable({
  deleteSong,
  station,
  onSearch,
  onPlaySearchedResult,
  search,
  handleChange,
  searchResults,
  onAddSong,
  onUpdateStation
}) {
  const dispatch = useDispatch();

  const stations = useSelector(storeState => storeState.stationModule.stations)
  const { user } = useSelector(storeState => storeState.userModule)
  let { playing, nowPlaying } = useSelector(storeState => storeState.playerModule)


  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const scrollContainerRef = useRef(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // אם האלמנט לא ב-100% נראות בתוך הטווח שהגדרנו, הוא נחשב סטיקי
        setIsSticky(entry.intersectionRatio >= 1);
      },
      {
        root: scrollContainerRef.current,
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  async function likeSong(ev, songId) {
    ev.stopPropagation()
    if (!user) {
      showErrorMsg("You must be logged in to like songs")
      return
    }
    const likedSongs = user?.likedSongs || []
    if (likedSongs.includes(songId)) {
      const userToUpdate = { ...user, likedSongs: likedSongs.filter(id => id !== songId) }
      await updateUser(userToUpdate)
      showSuccessMsg("Song removed from Liked Songs")

    } else {
      const userToUpdate = { ...user, likedSongs: [...likedSongs, songId] }
      await updateUser(userToUpdate)
      showSuccessMsg("Song added to Liked Songs")
    }
  }

  // DND

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // עוזר להבדיל בין לחיצה לנגינה לבין גרירה
      },
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = station.songs.findIndex(s => s.id === active.id);
      const newIndex = station.songs.findIndex(s => s.id === over.id);
      const reorderedSongs = arrayMove(station.songs, oldIndex, newIndex);
      dispatch({ type: UPDATE_STATION, station: { ...station, songs: reorderedSongs } })
      onUpdateStation({ ...station, songs: reorderedSongs });
    }
  }
  //


  return (
    <section className="song-table container " ref={scrollContainerRef}>
      <div className={`table-header ${isSticky ? 'is-sticky' : ''}`}
        ref={headerRef}>
        <div className="col-index">#</div>
        <div className="col title">Title</div>
        <div className="col album">Album</div>
        <div></div>
        <div className="col date">Date Added</div>
        <div className="col duration">
          <Duration className="duration-icon" />
        </div>
      </div>
      {station.isShared &&
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={station.songs.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="song-list">
              {station.songs.map((song, idx) => (
                <SortableSongRow
                  key={song.id}
                  song={song}
                  idx={idx}
                  station={station}
                  playing={playing}
                  nowPlaying={nowPlaying}
                  user={user}
                  onPlaySearchedResult={onPlaySearchedResult}
                  likeSong={likeSong}
                  formatTime={formatTime}
                  deleteSong={deleteSong}
                  onAddSong={onAddSong}
                  stations={stations}
                  DropDown={DropDown}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>}

      {!station.isShared && <ul className="song-list">
        {station.songs.map((song, idx) => (
          <li
            key={`${station._id}-${song.id}-${idx}`}
            className="song-row"
            onClick={() => onPlaySearchedResult(song)}
          >
            <div className='song-row-inner'>
              <div className="song-index-wrapper">
                <span className="song-index">
                  {playing && song.id === nowPlaying.id && <img style={{ width: '14px', heigth: '14px' }} src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif" />}
                  {(!playing || song.id !== nowPlaying.id) && idx + 1}</span>

                {/* <Tippy content={`Play ${song.title}`} delay={[800, 0]} offset={[0, -60]} arrow={false} placement="bottom">
                  <span className="icon-white-arrow-details"><WhiteArrow /></span>
                </Tippy> */}
                <span className="play-icon-row">
                  {(!playing || playing && song.id !== nowPlaying.id) && <Tippy content={'Play'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                    <span className="tooltip-wrapper">
                      <WhiteArrow className="icon small white" />
                    </span>
                  </Tippy>}
                  {playing && song.id === nowPlaying.id && <Tippy content={'Pause'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                    <span className="tooltip-wrapper">
                      <Pause className="icon small white" />
                    </span>
                  </Tippy>}
                </span>
              </div>

              <div className="song-title-wrapper">
                <img className="song-img" src={song.imgUrl} alt={song.title} />
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist.name}</div>
                </div>
              </div>

              <div className="song-album">{song.album.title}</div>
              <div className={`like-icon ${(user?.likedSongs || []).includes(song.id) ? 'on' : ''}`}>
                <Tippy
                  content={`${(user?.likedSongs || []).includes(song.id) ? 'Remove from' : 'Add to'} Liked Songs`}
                  delay={[500, 0]}
                  offset={[0, 15]}
                  arrow={false}
                >
                  <span className="tooltip-wrapper">
                    {!(user?.likedSongs || []).includes(song.id) && (
                      <Like className="icon small" onClick={(ev) => likeSong(ev, song.id)} />
                    )}

                    {(user?.likedSongs || []).includes(song.id) && (
                      <Liked className="icon small" onClick={(ev) => likeSong(ev, song.id)} />
                    )}
                  </span>
                </Tippy>
              </div>
              <div className="song-date">2 days ago</div>

              <div className='song-duration-wrapper'>
                <div className="song-duration">{formatTime(song.duration)}</div>
                {/* <span className='icon-trash' onClick={(ev) => deleteSong(ev, song.id, station._id)}>
                  <Delete className="icon small" />
                </span> */}
              </div>
              <DropDown onAdd={onAddSong}
                onDelete={deleteSong}
                canDelete={'true'}
                song={song}
                stationId={station._id}
                stations={stations}
              />

            </div>
          </li>
        ))}
      </ul>}


      {(station._id !== 'likedSongs') && <div className='search container'>
        <h1>Let's find something for your playlist</h1>
        <form onSubmit={onSearch}>
          <div className="wrapper">
            <Tippy content={'Search'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
              <span className="tooltip-wrapper">
                <Search className="icon" />
              </span>
            </Tippy>
            <input className='search-input open'
              value={search}
              onChange={handleChange}
              type="text"
              placeholder='Search for songs'
            />
          </div>
        </form>
        <ul className='search-results'>
          {search && searchResults.length > 0 && searchResults.map(res => (
            <li key={res.id} className="result-item">
              <img className="song-img" src={`https://e-cdns-images.dzcdn.net/images/cover/${res.md5_image}/220x220.jpg`} onClick={() => onPlaySearchedResult(res)} />
              <div>
                <div className="song-title">{res.title}</div>
                <div className="song-artist">{res.artist.name}</div>
              </div>
              <button className="btn-add-song" onClick={(ev) => onAddSong(ev, res, station._id)}>Add</button>
            </li>
          ))}
        </ul>
      </div >
      }
    </section>
  )
}


export function DropDown({ onAdd, onDelete, canDelete, song, stationId, stations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const dispatch = useDispatch()
  const { user } = useSelector(storeState => storeState.userModule)

  function onAddToQueue(ev, song) {
    ev.stopPropagation()
    dispatch({ type: ADD_TO_QUEUE, song: song })
  }
  return (
    <div onClick={(ev) => ev.stopPropagation()}>

      <Popover
        isOpen={isOpen}
        positions={['bottom', 'top', 'right', 'left']}
        boundaryInset={30}
        onClickOutside={() => {
          setIsOpen(false);
          setIsSubMenuOpen(false);
        }}
        content={
          <div className="options-menu">

            <Popover
              isOpen={isSubMenuOpen}
              positions={['right', 'left', 'top']}
              padding={5}
              align="start"
              alignOffset={10}
              onClickOutside={() => {
                setIsOpen(false)
                setIsSubMenuOpen(false)
              }}
              content={
                <div className="options-menu submenu" onMouseLeave={() => setIsSubMenuOpen(false)}>
                  {stations.filter(station => {
                    const createdByUser = station.createdBy?._id === user?._id
                    const likedByUser = station.likedByUsers?.some(u => u._id === user?._id)
                    return createdByUser || likedByUser
                  }).map(station => (
                    <div key={station._id} className="option" onClick={(ev) => {
                      onAdd(ev, song, station._id); setIsOpen(false)
                      setIsSubMenuOpen(false)
                    }}>
                      <button >{station.name}</button>
                    </div>
                  ))}
                </div>
              }
            >
              <div
                className="option flex first"
                onMouseEnter={() => setIsSubMenuOpen(true)}
                data-state={isSubMenuOpen ? 'open' : 'closed'}>
                <Plus className="icon small" />
                <button >Add to playlist</button>
                <ArrowInMenu className="icon small" style={{ transform: 'rotate(90deg)', marginInlineStart: 'auto' }} />
              </div>
            </Popover>

            {canDelete && <div className="option flex justify-between"
              onMouseEnter={() => setIsSubMenuOpen(false)}
              onClick={(ev) => { onDelete(ev, song.id, stationId); setIsOpen(false); }}>
              <Remove className="icon small" />
              <button>Delete from this playlist</button>
            </div>}
            <div className="option flex justify-between"
              onMouseEnter={() => setIsSubMenuOpen(false)}
              onClick={(ev) => { onAddToQueue(ev, song); setIsOpen(false); }}>
              <AddToQueue className="icon small" />
              <button style={{ marginInlineEnd: 'auto' }}>Add to queue</button>
            </div>
          </div>
        }
      >
        <div
          data-state={isOpen ? 'open' : 'closed'}
          onClick={(ev) => {
            ev.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <Tippy content={'Options'} delay={[500, 0]} offset={[0, 15]} arrow={false}>
            <span className="tooltip-wrapper">
              <DropDownMenu className="icon-options icon small" />
            </span>
          </Tippy>
        </div>
      </Popover>
    </div>
  );
}