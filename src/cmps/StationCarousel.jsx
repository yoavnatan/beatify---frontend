import { useEffect, useRef, useState } from "react"
import Arrow from "../assets/svg/nav-arrow.svg?react"
import Play from "../assets/svg/play.svg?react"

export function StationCarousel({ stations }) {
    const listRef = useRef()

    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)

    // useEffect(() => {
    //     listRef.current.addEventListener('scroll', onScrollEvent)

    //     return () => listRef.current.removeEventListener('scroll', onScrollEvent)

    // }, [])

    function onScrollEvent() {
        setShowLeftArrow(true)
        setShowRightArrow(true)
        if (listRef.current.scrollLeft + listRef.current.offsetWidth + 1 >= listRef.current.scrollWidth) setShowRightArrow(false)
        if (listRef.current.scrollLeft === 0) setShowLeftArrow(false)
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


    return (
        <section className="station-carousel" >
            <h2 className="carusel-title">More of your taste</h2>
            {showLeftArrow && <div className="arrow-wrapper left " onClick={() => scrollCarousel('left')}  >
                <Arrow className="icon small arrow-left" />
            </div>}
            {showRightArrow && <div className="arrow-wrapper right " onClick={() => scrollCarousel('right')}>
                <Arrow className="icon small arrow-right" />
            </div>}
            <ul ref={listRef} className="list" onScroll={onScrollEvent}>
                {stations.map(station =>
                    <li key={station._id} className="item">
                        <div className="img-container">
                            <img
                                src={
                                    station._id === 'likedSongs'
                                        ? "https://misc.scdn.co/liked-songs/liked-songs-300.png"
                                        : station.songs[0]?.imgUrl
                                }
                                alt={station.name}
                                />                            
                                    <div className="btn-play">
                                            <Play className="icon small-medium black" />
                                    </div>
                        </div>
                        
                        <div className="description ">{station.name}</div>

                    </li>
                )}
            </ul>
        </section >
    )
}