import { useEffect, useRef } from "react"

export function StationCarousel({ stations }) {
    const listRef = useRef()

    useEffect(() => {
        // listRef.current.scrollTo(0, 0)
    }, [])

    return (
        <section className="station-carousel">
            <h2>More of your taste</h2>
            <ul ref={listRef} className="list">
                {stations.map(station =>
                    <li className="item">
                        <img src={station.songs[0]?.imgUrl} alt={station.name} />
                        <h4>{station.name}</h4>
                    </li>
                )}
            </ul>
        </section>
    )
}