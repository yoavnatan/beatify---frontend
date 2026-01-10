import Play from "../assets/svg/play.svg?react"
export function StationPreview({ station }) {
    return (
        <article className="station-preview">
            {/* <Link to={`/station/${station._id}`}>{station.name}</Link> */}
            <img src={station.songs[0]?.imgUrl} alt={station.name} />
            <h3 className="station-name-preview">{station.name}</h3>
            <div className="btn-play">
                <Play className="icon small black" />
            </div>
        </article>
    )
}