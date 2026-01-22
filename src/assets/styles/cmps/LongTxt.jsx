import { useState } from "react";

export function LongTxt({ txt, length = 100 }) {
    const [isShowLong, setIsShowLong] = useState(false)
    console.log(txt)
    function onToggleIsShowLong() {
        setIsShowLong(isShowLong => !isShowLong)
    }

    const isLongText = txt.length > length
    const textToShow = isShowLong ? txt : (txt.substring(0, length))
    return (
        <section className="long-txt" style={{ height: '200px' }}>
            <div className="bio">
                {textToShow}
                {isLongText &&
                    <button onClick={onToggleIsShowLong}>
                        {isShowLong ? ' Less...' : ' More...'}
                    </button>
                }
            </div>
        </section>
    );
}