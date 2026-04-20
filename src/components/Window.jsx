import '../styles/window.css'
import {gsap} from 'gsap'
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import '../styles/desktop.css'
import { useRef, useEffect} from 'react'

function Window({ title, onClose, children, className }) {

    const windowRef = useRef(null)

    useEffect(() => {
        gsap.registerPlugin(Draggable, InertiaPlugin)
        Draggable.create('.window', {
        bounds: ".desktop",
        
        })
    }, [])
    

  return (
    <div className={`window ${className || ''}`}>
      <div className="window-titlebar">
        <span>{title}</span>
        <button className='closeButton' onClick={onClose}>X</button>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  )
}

export default Window