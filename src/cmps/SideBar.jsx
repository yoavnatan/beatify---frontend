import { useRef, useState } from "react";
import { useDispatch } from "react-redux"
import Arrow from "../assets/svg/nav-arrow.svg?react"
import Collapse from "../assets/svg/collapse-library.svg?react"
import Tippy from '@tippyjs/react';

export function SideBar() {
    const [isBarOpen, SetIsBarOpen] = useState(false)

    const sidebarRef = useRef()

    function onMouseDown(e) {
        e.preventDefault()

        const rect = sidebarRef.current.getBoundingClientRect();
        const rightAnchor = rect.right;

        document.body.style.cursor = "col-resize";

        const onMouseMove = (moveEvent) => {
            if (sidebarRef.current) {

                let newWidth = rightAnchor - moveEvent.clientX;

                const MIN_WIDTH = 50;
                const MAX_WIDTH = 420;

                if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
                if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

                if (newWidth < 100) {
                    SetIsBarOpen(false)
                    newWidth = MIN_WIDTH
                }

                if (!isBarOpen && newWidth > 100) SetIsBarOpen(true)
                sidebarRef.current.style.width = `${newWidth}px`;
            }
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.body.style.cursor = "default";
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    function handleOpenBar() {
        SetIsBarOpen(true)
        sidebarRef.current.style.width = `${300}px`;
    }

    function handleCloseBar() {
        SetIsBarOpen(false)
        sidebarRef.current.style.width = `${50}px`;
    }
    return (
        <>
            <section className="sidebar container"
                ref={sidebarRef}
                style={{ width: '50px' }}>

                <div className="resizer-handle" onMouseDown={onMouseDown}>
                    <div className="resizer-line" />
                </div>

                {!isBarOpen && <div className="small arrow-side-bar"
                    onClick={handleOpenBar}>
                    <Tippy content={'Expand sidebar'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                        <span className="tooltip-wrapper">
                            <Arrow className='icon medium' />
                        </span>
                    </Tippy>
                </div>}
                {isBarOpen && <div className='sidebar-content'>

                    <header className="flex">
                        <Tippy content={'Collapse sidebar'} delay={[500, 0]} offset={[0, 15]} arrow={false} >
                            <span className="tooltip-wrapper">
                                <Collapse className="icon small collapse-side" style={{ rotate: '180deg' }} onClick={handleCloseBar} />
                            </span>
                        </Tippy>
                        <h1>Now Playing</h1>
                    </header>
                    <article className="side-bar-item">
                    </article>
                </div>}
            </section>
        </>


    )
}