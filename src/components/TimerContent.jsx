import React from 'react'
import { useState, useRef, useEffect } from 'react'
import '../styles/timer.css'

function TimerContent({playing, setPlay}) {

    let [pomoButton, setPomoButton] = useState(false)
    let [timerDisplay, setTimerDisplay] = useState('25:00')
    let [phase, setPhase] = useState('off')//work, rest
    const timerRef = useRef(null)
    const phaseRef = useRef('work')

    useEffect(() => {
        return () => clearInterval(timerRef.current)
    }, [])
    
    function switchPhase(newPhase) {
        setPhase(newPhase)
        phaseRef.current = newPhase
    }
    /*
    function pomoClickHandler() {
        if (!pomoButton) {
              
            const endTime = pomoCycle + new Date().getTime()


            timerRef.current = setInterval(() => {

                if(phase === 'work') {

                    const pomoCycle = 25 * 60 * 1000 // 25 min * seconds * miliseconds
                     
                    const now = new Date().getTime();
                    const timeLeft = endTime - now;

                    if (timeLeft < 0) {
                        setPlay(false)
                        switchPhase('rest')
                        clearInterval(timerRef.current)
                        setTimerDisplay('5:00')
                    }

                    const min = Math.floor(timeLeft / (1000 * 60))
                    const secs = Math.floor(timeLeft % (1000 * 60) / 1000) 
                    setTimerDisplay((min < 10 ? ('0' + min + ':') : (min + ':')) + (secs < 10 ? ('0' + secs) : (secs)))
                    setPomoButton(true)
                } else if (phase === 'rest') {
                    const pomoCycle = 5 * 60 * 1000 // 25 min * seconds * miliseconds 
                    const now = new Date().getTime();
                    const timeLeft = endTime - now;

                    if (timeLeft < 0) {
                        setPlay(true)
                        switchPhase('work')
                        clearInterval(timerRef.current)
                        setTimerDisplay('25:00')
                    }

                    const min = Math.floor(timeLeft / (1000 * 60))
                    const secs = Math.floor(timeLeft % (1000 * 60) / 1000) 
                    setTimerDisplay((min < 10 ? ('0' + min + ':') : (min + ':')) + (secs < 10 ? ('0' + secs) : (secs)))
                    setPomoButton(true)
                } 

                 
            }, 1000);
        } else {
                clearInterval(timerRef.current)
                setTimerDisplay('25:00')
                setPomoButton(false)
                 
        }
    }

     */

    function pomoClickHandler() {
        if (!pomoButton) {
            switchPhase('work')
            startTimer(25 * 60 * 1000)
            setPomoButton(true)
        } else {
            clearInterval(timerRef.current)
            setTimerDisplay('25:00')
            setPomoButton(false)
            setPhase('off')
        }
    }

    function startTimer(durationMs) {
        clearInterval(timerRef.current)
        const endTime = new Date().getTime() + durationMs
        timerRef.current = setInterval(() => {
            const timeLeft = endTime - new Date().getTime()
            if (timeLeft < 0) {
                if (phaseRef.current === 'work') {
                    setPlay(false)
                    switchPhase('rest')
                    startTimer(5 * 60 * 1000)
                } else {
                    setPlay(true)
                    switchPhase('work')
                    startTimer(25 * 60 * 1000)
                }
                return
            }
            const min = Math.floor(timeLeft / (1000 * 60))
            const secs = Math.floor((timeLeft % (1000 * 60)) / 1000)
            setTimerDisplay(
                (min < 10 ? '0' + min : min) + ':' + (secs < 10 ? '0' + secs : secs)
            )
        }, 1000)
    }

  return (
    <div className="pomoContainer">
        <div className="pomoTopRow">
            <button className='pomoButton' onClick={() => { pomoClickHandler()}}>{!pomoButton ? 'Pomodoro' : 'Off'}</button>
        <span className="pomominicontainer">
            <span className='pomoDisplay'>Time Left: 
            {timerDisplay}
        </span>
        <span className='pomoModeDisplay'>Mode: 
            {phase}
        </span>
        </span>
        </div>
         
         
        
        <div className="explain">Music will play for 25 minutes then pause for 5 minutes. This cycle will repeat. Closing this window will reset timer.</div>
         
      </div>
         
         
     
     
  )
}

export default TimerContent