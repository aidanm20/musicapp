import { useState } from 'react' 


function LowBitButton({setBitCrush}) {
    const [active, setActive] = useState(false);

    function turnthistvoff() {
        if(active == false) {
            setBitCrush(5)
            setActive(!active)
        } else {
            setBitCrush(8)
            setActive(!active)
        }
    }

    return (
        <button className='lowbitbutton' onClick={() => {turnthistvoff()}}>{active ? 'Turn Off' : '8-Bit'}</button>
    )
}

export default LowBitButton
