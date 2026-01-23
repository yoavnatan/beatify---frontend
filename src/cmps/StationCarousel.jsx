import { useEffect, useRef, useState } from "react"
import Arrow from "../assets/svg/nav-arrow.svg?react"
import Play from "../assets/svg/play.svg?react"
import { useNavigate } from "react-router"

export function StationCarousel({ stations }) {
    const listRef = useRef()
    const navigate = useNavigate()

    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const [fadeLeft, setFadeLeft] = useState(0)
    const [fadeRight, setFadeRight] = useState(1)

    function onScrollEvent() {
        if ((listRef.current.scrollWidth - (listRef.current.scrollLeft + listRef.current.offsetWidth + 1)) / 100 <= 1) setFadeRight((listRef.current.scrollWidth - (listRef.current.scrollLeft + listRef.current.offsetWidth + 1)) / 100)

        if (listRef.current.scrollLeft / 100 <= 1) setFadeLeft(listRef.current.scrollLeft / 100)
        setShowLeftArrow(true)
        setShowRightArrow(true)
        if (listRef.current.scrollLeft + listRef.current.offsetWidth + 1 >= listRef.current.scrollWidth) {
            setShowRightArrow(false)
        }
        if (listRef.current.scrollLeft === 0) {
            setShowLeftArrow(false)
        }
    }
    function scrollCarousel(side) {
        if (side === 'right') {
            listRef.current.scrollBy({
                left: 350,
                behavior: 'smooth'
            })
        }
        else {
            listRef.current.scrollBy({
                left: -350,
                behavior: 'smooth'
            })
        }


    }

    function onChooseStation(station) {
        navigate(`station/${station._id}`)
    }
    return (

        <section className="station-carousel" >
            <div className="fade-left"
                style={{ opacity: `${fadeLeft}` }} >
            </div>
            <div className="fade-right"
                style={{ opacity: `${fadeRight}` }} >
            </div>
            <h2 className="carusel-title">More of your taste</h2>
            {showLeftArrow && <div className="arrow-wrapper left " onClick={() => scrollCarousel('left')}  >
                <Arrow className="icon small arrow-left" />
            </div>}
            {showRightArrow && <div className="arrow-wrapper right " onClick={() => scrollCarousel('right')}>
                <Arrow className="icon small arrow-right" />
            </div>}
            <ul ref={listRef} className="list" onScroll={onScrollEvent}>
                {stations.map(station => {

                    const coverImg =
                        station._id === 'likedSongs'
                            ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
                            : station.songs?.[0]?.imgUrl ||
                            station.imgUrl ||
                            "/img/blank-screen.png"

                    return (
                        <li key={station._id} className="item">
                            <div className="img-container">
                                <img
                                    src={coverImg}
                                    alt={station.name}
                                    onClick={() => onChooseStation(station)}
                                />
                                <div className="btn-play">
                                    <Play className="icon small-medium black" />
                                </div>
                            </div>

                            <div className="description">{station.name}</div>
                        </li>
                    )
                })}
            </ul>

        </section >
    )
}