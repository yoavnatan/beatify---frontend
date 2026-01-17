import { useSelector } from "react-redux"
import Pen from "../assets/svg/pen.svg?react"
import Search from "../assets/svg/search.svg?react"
import X from "../assets/svg/x.svg?react"
import { useState } from "react"





export function LibraryAddStation(){
    const { user } = useSelector(storeState => storeState.userModule)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stationName, setStationName] = useState("My Playlist")
    const [stationDesc, setStationDesc] = useState("")
    const [stationImg, setStationImg] = useState("../public/img/blank-screen.jpg")


    function saveStation() {
        const updatedStation = {
            name: stationName,
            description: stationDesc,
            imgUrl: stationImg,
            createdBy: user.fullname
        }
        
        setIsModalOpen(false)
        console.log('saving',updatedStation)
    }



    return(
    <div className="add-station">
        <header className="add-station-header" style={{ "--avg-color": "grey" }} >
            <div className="add-image-wrapper" onClick={() => setIsModalOpen(true)}>
            <img className="add-station-cover" src="../public/img/blank-screen.jpg" alt="station cover" />
            <div className="icon-pen"><Pen/></div>
            </div>

            <div className="add-station-meta">
                <span className="add-station-label">Playlist</span>

                <h1 className="add-station-title-wrapper">
                    <span className="add-station-title">My Playlist</span>
                </h1>

                <div className="add-station-subinfo">

                    <span className="creator">
                        {user.fullname}
                    </span>
               </div>
            </div>
      </header>

      <div className="add-songs">
        <div className="search-songs-wrapper">
            <h1 className="add-songs-title">Let's find something for your playlist</h1>
            <div className="add-search-row">
                <input className="search-songs" type="text" placeholder="Search for songs or episodes" />
                <Search className="add-icon-search"/>
            </div>
        </div>
            <X  className="icon-x"/>
        </div>

      {isModalOpen && (
  <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
    <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
      
      <div className="modal-hedaer"> 
        <h2>Edit details</h2>
        <X className="modal-icon-x" onClick={() => setIsModalOpen(false)} />
      </div>

      <form
        className="modal-info-layout"
        onSubmit={(ev) => {
            ev.preventDefault()
            saveStation()
        }}
        >
        <input
            type="text"
            className="modal-name"
            value={stationName}
            onChange={(ev) => setStationName(ev.target.value)}
            required
        />

        <img className="modal-image" src={stationImg} />

        <textarea
            className="modal-description"
            value={stationDesc}
            onChange={(ev) => setStationDesc(ev.target.value)}
            placeholder="Add an optional description"
        />

        <button type="submit" className="modal-save">
            Save
        </button>

        <p className="modal-disclaimer">
            By proceeding, you agree to give Spotify access to the image you upload.
        </p>
    </form>


    </div>
  </div>
)}



    </div>
    
    )
}