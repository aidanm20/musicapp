import { useState } from 'react'
import '../styles/vaporwavebutton.css'


function VaporwaveButton({setPitch, setSpeed, setReverb, setDecay, setBitCrush, setMode}) {
    const [active, setActive] = useState(false);

    function turnthistvoff() {
        if(active == false) {
            setPitch(-3) 
            setSpeed(.8) 
            setDecay(7)
            setReverb(.8)
            setBitCrush(7)
            setActive(!active)
            setMode('vaporwave')
        } else {
            setPitch(0) 
            setSpeed(1) 
            setDecay(.5)
            setReverb(0)
            setActive(!active)
            setMode('default')
        }
    }

    return (
        <button className='vaporwavebutton' onClick={() => {turnthistvoff()}}>{active ? 'Turn Off' : 'Vaporwave'}</button>
    )
}

export default VaporwaveButton
