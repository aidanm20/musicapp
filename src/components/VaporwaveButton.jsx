import '../styles/vaporwavebutton.css'


function VaporwaveButton({setPitch, setSpeed, setReverb, setDecay, setBitCrush, setMode, activeButton, setActiveButton, resetAllEffects}) {
    const active = activeButton === 'vaporwave'

    function turnthistvoff() {
        if (!active) {
            resetAllEffects()
            setPitch(-7)
            setSpeed(.8)
            setDecay(7)
            setReverb(.8)
            setBitCrush(6)
            setActiveButton('vaporwave')
            setMode('vaporwave')
        } else {
            setPitch(0)
            setSpeed(1)
            setDecay(.5)
            setReverb(0)
            setActiveButton(null)
            setMode('default')
        }
    }

    return (
        <button className='vaporwavebutton' onClick={() => {turnthistvoff()}}>{active ? 'Turn Off' : 'Vaporwave'}</button>
    )
}

export default VaporwaveButton
