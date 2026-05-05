import React from 'react'
import '../styles/tutorialList.css'
import { useState, useEffect } from "react";
function TutorialInfo() {
   const [flip, setFlip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlip(f => !f);
    }, 500);

    return () => clearInterval(interval);
  }, []);
    
  return (
    <div className="tutorial-body">
     <div>{flip ? "<o/" : "\\o>"}</div>
    
      <p className="tutorial-heading">GETTING STARTED</p>
      <ul>
        <li>Drag titlebars to move windows</li>
        <li>Click desktop icons to open windows</li>
        <li>Import songs via the IMPORT window, multiple can be imported at once using folder option</li> 
        <li>Drag the icon in queue to change song order manually</li> 
      </ul>

      <p className="tutorial-heading">MIXER</p>
      <ul>
        <li>Pitch &amp; Speed sliders adjust playback feel</li>
        <li>Reverb adds spacious echo</li>
        <li>Nightcore / Lofi / Vaporwave: one-click presets</li>
        <li>Custom presets coming soon!</li>
        <li>Extreme changes can degrade audio quality</li>
      </ul>

      <p className="tutorial-heading">PLAYBACK</p>
      <ul>
        <li>Click a song in SONGS to play it</li>
        <li>Playing a song will give you control in bottom taskbar</li>
        <li>Loop &amp; shuffle buttons on taskbar right</li>
      </ul>

      
  
    </div>
  )
}

export default TutorialInfo