import Duration from "../assets/svg/duration.svg?react"
import WhiteArrow from "../assets/svg/white-arrow.svg?react"
import Search from "../assets/svg/search.svg?react"
import Tippy from "@tippyjs/react"
import Trash from "../assets/svg/trash.svg?react"
import Delete from "../assets/svg/delete.svg?react"
import Plus from "../assets/svg/plus.svg?react"
import Remove from "../assets/svg/remove.svg?react"
import ArrowInMenu from "../assets/svg/arrow-in-menu.svg?react"
import DropDownMenu from "../assets/svg/drop-down-menu.svg?react"
import { Popover } from 'react-tiny-popover';
import { useState } from "react"
import { useSelector } from "react-redux"

export function SongsTable({
  deleteSong,
  station,
  onSearch,
  onPlaySearchedResult,
  search,
  handleChange,
  searchResults,
  onAddSong
}) {

  const stations = useSelector(storeState => storeState.stationModule.stations)

  return (
    <>
      <div className="table-header">
        <div className="col-index">#</div>
        <div className="col title">Title</div>
        <div className="col album">Album</div>
        <div className="col date">Date Added</div>
        <div className="col duration">
          <Duration className="duration-icon" />
        </div>
      </div>

      <ul className="song-list">
        {station.songs.map((song, idx) => (
          <li
            key={`${station._id}-${song.id}-${idx}`}
            className="song-row"
            onClick={() => onPlaySearchedResult(song)}
          >
            <div className='song-row-inner'>
              <div className="song-index-wrapper">
                <span className="song-index">{idx + 1}</span>
                <Tippy content={`Play ${song.title}`} delay={[800, 0]} offset={[0, -60]} arrow={false} placement="bottom">
                  <span className="icon-white-arrow-details"><WhiteArrow /></span>
                </Tippy>
              </div>

              <div className="song-title-wrapper">
                <img className="song-img" src={song.imgUrl} alt={song.title} />
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">Artist Name</div>
                </div>
              </div>

              <div className="song-album">Album Name</div>
              <div className="song-date">2 days ago</div>

              <div className='song-duration-wrapper'>
                <div className="song-duration">3:45</div>
                {/* <span className='icon-trash' onClick={(ev) => deleteSong(ev, song.id, station._id)}>
                  <Delete className="icon small" />
                </span> */}
              </div>
              <DropDown onAdd={onAddSong}
                onDelete={deleteSong}
                song={song}
                stationId={station._id}
                stations={stations}
              />

            </div>
          </li>
        ))}
      </ul>

      <hr />

      <div className='search container'>
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
              <img className="song-img" src={`https://e-cdns-images.dzcdn.net/images/cover/${res.md5_image}/56x56.jpg`} onClick={() => onPlaySearchedResult(res)} />
              <div>
                <div className="song-title">{res.title}</div>
                <div className="song-artist">{res.artist.name}</div>
              </div>
              <button className="btn-add-song" onClick={(ev) => onAddSong(ev, res, station._id)}>Add</button>
            </li>
          ))}
        </ul>
      </div >
    </>
  )
}


function DropDown({ onAdd, onDelete, song, stationId, stations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

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
                  {stations.slice(1, 5).map(station => (
                    <div key={station._id} className="option" onClick={(ev) => onAdd(ev, song, station._id)}>
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

            <div className="option flex justify-between" onClick={(ev) => { onDelete(ev, song.id, stationId); setIsOpen(false); }}>
              <Remove className="icon small" />
              <button>Delete from this playlist</button>
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