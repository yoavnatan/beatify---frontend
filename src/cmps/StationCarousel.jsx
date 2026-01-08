import { useEffect, useRef } from "react"
import Arrow from "../assets/svg/nav-arrow.svg?react"

export function StationCarousel({ stations }) {
    const listRef = useRef()


    useEffect(() => {
        // listRef.current.scrollTo(0, 0)
    }, [])


    function scrollCarousel(side) {
        if (side === 'right') listRef.current.scrollBy({
            left: 350,
            behavior: 'smooth'
        })
        else listRef.current.scrollBy({
            left: -330,
            behavior: 'smooth'
        })

    }

    return (
        <section className="station-carousel">
            <h2>More of your taste</h2>
            <div className="arrow-wrapper left" onClick={() => scrollCarousel('left')} >
                <Arrow className="icon small arrow-left" />
            </div>
            <div className="arrow-wrapper right" onClick={() => scrollCarousel('right')}>
                <Arrow className="icon small arrow-right" />
            </div>
            <ul ref={listRef} className="list">
                {stations.map(station =>
                    <li key={station._id} className="item">
                        <img src={station.songs[0]?.imgUrl} alt={station.name} />
                        <h4>{station.name}</h4>
                    </li>
                )}
            </ul>
        </section >
    )
}