import '../styles/desktop.css'
import {useState,useRef,useEffect} from 'react'
import Window from './Window'
import DisplaySongs from './DisplaySongs'
import FolderInput from './FolderInput'
import NCButton from './NCButton'
import SpeedSlider from './SpeedSlider'
import BackButton from './BackButton'
import PlayButton from './PlayButton'
import NextButton from './NextButton'
import PitchSlider from './PitchSlider'
import SeekBar from './SeekBar'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import gridTextureUrl from '../assets/maps/grid-6.png'
import displacementUrl from '../assets/maps/displacement-7.png'
import metalnessUrl from '../assets/maps/metalness-2.png'
import noteIcon from '../assets/svg/music-note-svgrepo-com.svg'
import fileIcon from '../assets/svg/music-note-on-folder-svgrepo-com.svg'
import gearIcon from '../assets/svg/gear-svgrepo-com.svg'
import mixerIcon from '../assets/svg/mixer-studio-audio-sound-svgrepo-com.svg'
import tutorialIcon from '../assets/svg/info-svgrepo-com.svg'
import ReverbSlider from './reverbSlider'
import LowBitButton from './LowBitButton'
import VaporwaveButton from './VaporwaveButton'
import LofiButton from './LofiButton'
import TutorialInfo from './TutorialInfo'

function Desktop({ songs, setSong, song, playing, setPlay, setPitch, setSpeed, addSongs, deleteSong, setTime, currTime, totalTime, setReverb, setDecay, setBitCrush, setFilter, meterRef }) {
 
    const [openSongs, setOpenSongs] = useState(false)
    const [openMixer, setOpenMixer] = useState(false)
    const [openImport, setOpenImport] = useState(false)
    const [openManage, setOpenManage] = useState(false)
    const [openTutorial, setOpenTutorial] = useState(false)
    const [mode, setMode] = useState('default')
   
     

    const canvasRef = useRef(null)
    const sunRef = useRef(null)
    const currentColorRef = useRef(null)
     
    useEffect(() => {
      if (!canvasRef.current) return
const textureLoader = new THREE.TextureLoader();
const gridTexture = textureLoader.load(gridTextureUrl);
const terrainTexture = textureLoader.load(displacementUrl);
const metalnessTexture = textureLoader.load(metalnessUrl);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0e0a10');
// Fog
const fog = new THREE.Fog("#242222", 1,4);
scene.fog = fog;

// Objects
const geometry = new THREE.PlaneGeometry(1, 2, 24, 24);
const material = new THREE.MeshStandardMaterial({
    map: gridTexture,
    displacementMap: terrainTexture,
    displacementScale: 0.4,
    /**
     * Add a metalnessMap to our material that will tell the renderer
     * where the "rough" parts of our terrains are
     */ 
    metalnessMap: metalnessTexture,
    /**
     * Make the terrain very very metallic so it will reflect the light
     * and not diffuse it: it will stay black
     */ 
    metalness: 0.96,
    /**
     * Make the terrain a bit rough so the rough parts will diffuse the light
     * well
     */ 
    roughness: 0.5,
});

const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0.0;
plane.position.z = 0.15;


const plane2 = new THREE.Mesh(geometry, material);
plane2.rotation.x = -Math.PI * 0.5;
plane2.position.y = 0.0;
plane2.position.z = -1.85; // 0.15 - 2 (the length of the first plane)

scene.add(plane);
scene.add(plane2);


  //sun
  const sgeometry = new THREE.SphereGeometry(.8, 32, 16)
const smaterial = new THREE.ShaderMaterial({
  uniforms: {
    topColor: { value: new THREE.Color('#ffc142') },     
    bottomColor: { value: new THREE.Color(0x9900ff) }   
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    varying vec2 vUv;
    void main() {
      vec3 color = mix(bottomColor, topColor, vUv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `
})
const sun = new THREE.Mesh(sgeometry, smaterial) 
sunRef.current = sun
sun.position.set(0, 0.15, -1.5)
scene.add(sun)

//stars
const starGeometry = new THREE.SphereGeometry(0.008, 6, 6)
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
const stars = new THREE.InstancedMesh(starGeometry, starMaterial, 500)

//we set a dummy and push star's positions to the dummy's matrix (position, rotation, scale)

const dummy = new THREE.Object3D()

for (let i = 0; i < 500; i++) {
  dummy.position.set(
    //Math.random() * (max - min) + min
    Math.random() * 15 - 7.5,    // x: -2 to 2
    Math.random() * 5 - .5,  // y: 0.1 to 1.1  
    Math.random() * 2 - 3        // z: -2 to -4
  )
  dummy.updateMatrix()
  stars.setMatrixAt(i, dummy.matrix)
}

stars.instanceMatrix.needsUpdate = true
scene.add(stars)



 


// Light
// Ambient Light
const ambientLight = new THREE.AmbientLight("#ffffff", 10);
scene.add(ambientLight);

// Right Spotlight aiming to the left
const spotlight = new THREE.SpotLight("#fca9ff", 20, 25, Math.PI * 0.1, 0.25);
spotlight.position.set(0.5, 0.75, 2.2);
// Target the spotlight to a specific point to the left of the scene
spotlight.target.position.x = -0.25;
spotlight.target.position.y = 0.25;
spotlight.target.position.z = 0.25;
scene.add(spotlight);
scene.add(spotlight.target);

// Left Spotlight aiming to the right
const spotlight2 = new THREE.SpotLight("#a6f6ff", 20, 25, Math.PI * 0.1, 0.25);
spotlight2.position.set(-0.5, 0.75, 2.2);
// Target the spotlight to a specific point to the right side of the scene
spotlight2.target.position.x = 0.25;
spotlight2.target.position.y = 0.25;
spotlight2.target.position.z = 0.25;
scene.add(spotlight2);
scene.add(spotlight2.target);


// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  20
);
camera.position.x = 0;
camera.position.y = 0.1;
camera.position.z = 1;

// Controls
const controls = new OrbitControls(camera, canvasRef.current);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.current,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Post Processing
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms["amount"].value = 0.0015;

effectComposer.addPass(rgbShiftPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

const handleResize = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    effectComposer.setSize(sizes.width, sizes.height);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener("resize", handleResize);

const clock = new THREE.Clock();
let animationId;
let scrollPos = 0;

const tick = () => {
    const delta = clock.getDelta();
    controls.update();


    if (sunRef.current && currentColorRef.current) {
      sunRef.current.material.uniforms.topColor.value.lerp(new THREE.Color(currentColorRef.current.top), 0.02)
      sunRef.current.material.uniforms.bottomColor.value.lerp(new THREE.Color(currentColorRef.current.bottom), 0.02)
    }

    const meterValue = meterRef?.current?.getValue()
    const minDb = -100
    const maxDb = 0
    const minSpeed = 0.04
    const maxSpeed = 0.4
    const rawDb = Array.isArray(meterValue) ? meterValue[0] : meterValue
    const db = Number.isFinite(rawDb) ? rawDb : minDb
    const clampedDb = THREE.MathUtils.clamp(db, minDb, maxDb)
    const normalizedDb = (clampedDb - minDb) / (maxDb - minDb)
    const safeSpeed = minSpeed + normalizedDb * (maxSpeed - minSpeed)
    scrollPos = (scrollPos + delta * safeSpeed) % 2;
    plane.position.z = scrollPos + 0.15;
    plane2.position.z = scrollPos - 1.85;
    effectComposer.render();
    animationId = window.requestAnimationFrame(tick);
};

tick();

return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
};

    },[meterRef])

    useEffect(() => {
      if (!sunRef.current) return 
      if(mode == 'default') {
        currentColorRef.current = {
          top:'#ffc142',
          bottom: 0x9900ff
        }
      } else if (mode == 'nightcore') {
        currentColorRef.current = {
          top:'#ff69b4',
          bottom: '#01cbcb'
        }
      } else if (mode == 'vaporwave') {
        currentColorRef.current = {
          top:'#564aff' ,
          bottom: '#ff3939' 
        }
      } else if (mode == 'lofi') {
        currentColorRef.current = {
          top:'#84ff5f',
          bottom:'#c900fb' 
        }
      }
    }, [mode])

    // we put the 3d canvas in a z index behind the desktop which has a transparent background
  return (
    <> 
    <canvas className='webgl' ref={canvasRef} style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: -1  
      }} />
    <div className="desktop">
      <div className="scanlines"></div>
      <div className="icons">
        <div className="icon" onClick={() => setOpenSongs(!openSongs)}>
          <div className="icon-img songs"><img 
                                  src={noteIcon}
                                  alt="options"
                                  width="26"
                                  height="26" /></div>
          <div className="icon-label">SONGS</div>
        </div>
        <div className="icon" onClick={() => setOpenMixer(!openMixer)}>
          <div className="icon-img mixer"><img 
                                  src={mixerIcon}
                                  alt="options"
                                  width="26"
                                  height="26"/></div>
          <div className="icon-label">MIXER</div> 
        </div>
        <div className="icon" onClick={() => setOpenImport(!openImport)}>
          <div className="icon-img import"><img 
                                  src={fileIcon}
                                  alt="options"
                                  width="26"
                                  height="26"/></div>
          <div className="icon-label">IMPORT</div> 
        </div>
        <div className="icon" onClick={() => setOpenManage(!openManage)}>
          <div className="icon-img manage"><img 
                                  src={gearIcon}
                                  alt="options"
                                  width="26"
                                  height="26"/></div>
          <div className="icon-label">MANAGE</div> 
        </div>

        <div className="icon" onClick={() => setOpenTutorial(!openTutorial)}>
          <div className="icon-img tutorial"><img 
                                  src={tutorialIcon}
                                  alt="options"
                                  width="26"
                                  height="26"/></div>
          <div className="icon-label">TUTORIAL</div> 
        </div>
      </div>
      
       {openSongs ? <Window title="SONGS" onClose={() => setOpenSongs(!openSongs)} children={<DisplaySongs setSong={setSong} songs={songs} deleteSong={deleteSong} /> } className="songs-window"></Window> : null}
       {openMixer ? <Window title="MIXER" onClose={() => setOpenMixer(!openMixer)} children={<>
       <PitchSlider setPitch={setPitch} />
       <SpeedSlider setSpeed={setSpeed} />
       <ReverbSlider setReverb={setReverb} />
       <NCButton setPitch={setPitch} setSpeed={setSpeed} setMode={setMode} />
       <LofiButton setPitch={setPitch} setSpeed={setSpeed} setDecay={setDecay} setReverb={setReverb} setFilter={setFilter} setMode={setMode} />
       <VaporwaveButton setPitch={setPitch} setSpeed={setSpeed} setDecay={setDecay} setReverb={setReverb} setBitCrush={setBitCrush} setMode={setMode} />
       {//<LowBitButton setBitCrush={setBitCrush} />
       }
       </>} className='mixer-window' ></Window> : null}

       {openImport ? <Window title="IMPORT" onClose={() => setOpenImport(!openImport)} children={<FolderInput onSongsLoaded={addSongs} />} className='import-window' ></Window> : null}
{openManage ? <Window title="MANAGE" onClose={() => setOpenManage(!openManage)} children={'nothing here yet!'} className='manage-window' ></Window> : null}
{openTutorial ? <Window title="TUTORIAL" onClose={() => setOpenTutorial(!openTutorial)} children={<TutorialInfo />} className='tutorial-window' ></Window> : null}
    </div>
    <div className="taskbar">
         
        {song ? song.title : '♫ nothing playing' }
        {song && (
          <>
            <BackButton song={song} setSong={setSong} songs={songs} /> 
            <PlayButton playing={playing} setPlay={setPlay} song={song} /> 
            <NextButton song={song} setSong={setSong} songs={songs} />
            <SeekBar setTime={setTime} currTime={currTime} totalTime={totalTime} />
          </>
        )
      }
         
      </div>
      </>
  )
}

export default Desktop
