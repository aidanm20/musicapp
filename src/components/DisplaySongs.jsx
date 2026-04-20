import ThreeDots from '../assets/svg/three-dots-svgrepo-com.svg'
import '../styles/displaySongs.css'

function DisplaySongs({setSong, songs}) {
    return (
      <div> 
            {songs.map(song =>
            <div className="songRow">
                <p onClick={() => setSong(song)} key={song.id}>{song.title}</p>
                <img src={ThreeDots} alt="options" width="16" 
    height="16" />
            </div>
             )
            
            }
        </div>
  )
 }

 export default DisplaySongs