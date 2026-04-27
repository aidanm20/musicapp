import '../styles/lofibutton.css'


function LofiButton({setPitch, setSpeed, setReverb, setDecay, setFilter, setMode, activeButton, setActiveButton, resetAllEffects}) {
    const active = activeButton === 'lofi'

    function turnthistvoff() {
        if (!active) {
            resetAllEffects()
            setPitch(-6)
            setSpeed(.72)
            setDecay(.8)
            setReverb(.5)
            setFilter(800)
            setActiveButton('lofi')
            setMode('lofi')
        } else {
            setPitch(0)
            setSpeed(1)
            setDecay(.5)
            setReverb(0)
            setFilter(20000)
            setActiveButton(null)
            setMode('default')
        }
    }

    return (
        <button className='lofibutton' onClick={() => {turnthistvoff()}}>{active ? 'Turn Off' : 'Lofi'}</button>
    )
}

export default LofiButton
