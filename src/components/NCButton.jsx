import '../styles/NCButton.css'


function NCButton({setPitch, setSpeed, setMode, activeButton, setActiveButton, resetAllEffects}) {
    const active = activeButton === 'nightcore'

    function turnthistvoff() {
        if (!active) {
            resetAllEffects()
            setPitch(2.69)
            setSpeed(1.23456789)
            setActiveButton('nightcore')
            setMode('nightcore')
        } else {
            setPitch(0)
            setSpeed(1)
            setActiveButton(null)
            setMode('default')
        }
    }

    return (
        <button className='ncbutton' onClick={() => {turnthistvoff()}}>{active ? 'Turn Off' : 'Nightcore'}</button>
    )
}

export default NCButton
