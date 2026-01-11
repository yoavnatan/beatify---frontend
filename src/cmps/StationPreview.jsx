import Play from "../assets/svg/play.svg?react"
export function StationPreview({ station, setGradientColor }) {
    function onChangeGradient(s) {
        setGradientColor(s.averageColor)
    }

    function onRevertGradient() {
        setGradientColor('rgba(47, 38, 89, 0.9)')
    }
    return (
        <article className="station-preview" onMouseOver={() => onChangeGradient(station)} onMouseOut={onRevertGradient}>
            {/* <Link to={`/station/${station._id}`}>{station.name}</Link> */}
            <img src={station.songs[0]?.imgUrl} alt={station.name} />
            <h3 className="station-name-preview">{station.name}</h3>
            <div className="btn-play">
                <Play className="icon small black" />
            </div>
        </article>
    )
}