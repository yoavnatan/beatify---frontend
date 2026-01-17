import { useSelector } from "react-redux"
import Pen from "../assets/svg/pen.svg?react"
import Search from "../assets/svg/search.svg?react"
import X from "../assets/svg/x.svg?react"
import { useEffect, useState, useRef } from "react"
import { updateStation } from "../store/actions/station.actions"
import { useParams } from "react-router-dom"
import { stationService } from "../services/station/station.service"




export function LibraryAddStation(){
    const { user } = useSelector(storeState => storeState.userModule)
    const { stationId } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stationName, setStationName] = useState(null)
    const [stationDesc, setStationDesc] = useState("")
    const [stationImg, setStationImg] = useState(null)
    const [station, setStation] = useState(null)
    const fileInputRef = useRef()

    
    



    useEffect(() => {
    async function load() {
        if (!stationId) return
        const station = await stationService.getById(stationId)
        setStation(station)
        setStationName(station.name)
        setStationDesc(station.description || "")
        setStationImg(station.imgUrl)
    }
        load()
    }, [stationId])




   async function saveStationUpdates() {
        const updatedStation = {
            ...station,
            name: stationName,
            description: stationDesc,
            imgUrl: stationImg
        }
            await updateStation(updatedStation)
            setIsModalOpen(false)
        }
    async function handleImageUpload(ev) {
        const file = ev.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "spotify_uploads")
        formData.append("cloud_name", "dklscvc2o")

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dklscvc2o/image/upload",
            {
                method: "POST",
                body: formData
            }
        )

        const data = await res.json()
        setStationImg(data.secure_url)
    }

    function handleImageClick() {
        setIsModalOpen(true)
        fileInputRef.current.click()
    }




    return(
    <div className="add-station">
        <header className="add-station-header" style={{ "--avg-color": "grey" }} >
        <div
            className="add-image-wrapper"
            onClick={handleImageClick}
        >
            <img className="add-station-cover" src={stationImg} />
            <div className="add-image-overlay"></div>
            <div className="icon-pen"><Pen /></div>
        </div>


        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
        />



            <div className="add-station-meta">
                <span className="add-station-label">Playlist</span>

                <h1 className="add-station-title-wrapper">
                <span className="add-station-title">{stationName}</span>
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
        <h1>Edit details</h1>
        <X className="modal-icon-x" onClick={() => setIsModalOpen(false)} />
      </div>

      <form
        className="modal-info-layout"
        onSubmit={(ev) => {
            ev.preventDefault()
            saveStationUpdates()
        }}
        >
        <input
            type="text"
            className="modal-name"
            value={stationName}
            onChange={(ev) => setStationName(ev.target.value)}
            required
        />

        <div className="modal-image-wrapper">
            <img className="modal-image" src={stationImg} />
            <div className="modal-image-overlay"></div>
            <div className="modal-icon-pen"><Pen /></div>
        </div>

        <textarea
            className="modal-description"
            value={stationDesc}
            onChange={(ev) => setStationDesc(ev.target.value)}
            placeholder="Add an optional description"
        />
        <span
            className="modal-save"
            onClick={saveStationUpdates}
        >
            Save
        </span>

        <p className="modal-disclaimer">
            By proceeding, you agree to give Spotify access to the image
            you choose to upload. Please make sure you 
            have the right to upload the image. 
        </p>
    </form>


    </div>
  </div>
)}



    </div>
    
    )
}