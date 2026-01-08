
export function StationPreview({ station }) {
    return (
        <article className="station-preview">
            {/* <Link to={`/station/${station._id}`}>{station.name}</Link> */}
            <img src={station.songs[0]?.imgUrl} alt={station.name} />
            <h3 className="station-name">{station.name}</h3>
        </article>
    )
}