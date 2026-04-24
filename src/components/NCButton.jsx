import { useState } from 'react'
import '../styles/NCButton.css'


function NCButton({setPitch, setSpeed, setMode}) {
    const [active, setActive] = useState(false);

    function turnthistvoff() {
        if(active == false) {
            setPitch(2.69) 
            setSpeed(1.23456789) 
            setActive(!active)
            setMode('nightcore')
        } else {
            setPitch(0) 
            setSpeed(1) 
            setActive(!active)
            setMode('default')
        }
    }

    return (
        <button className='ncbutton' onClick={() => {turnthistvoff()}}>{active ? 'Turn Off' : 'Nightcore'}</button>
    )
}

export default NCButton
