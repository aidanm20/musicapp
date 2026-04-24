import { useState } from 'react'
import '../styles/lofibutton.css'


function LofiButton({setPitch, setSpeed, setReverb, setDecay, setFilter}) {
    const [active, setActive] = useState(false);

    function turnthistvoff() {
        if(active == false) {
            setPitch(-1.5) 
            setSpeed(.8) 
            setDecay(.8)
            setReverb(.5)
            setFilter(1000)
            setActive(!active)
        } else {
            setPitch(0) 
            setSpeed(1) 
            setDecay(.5)
            setReverb(0)
            setFilter(20000)
            setActive(!active)
        }
    }

    return (
        <button className='lofibutton' onClick={() => {turnthistvoff()}}>{active ? 'Turn Off' : 'Lofi'}</button>
    )
}

export default LofiButton
