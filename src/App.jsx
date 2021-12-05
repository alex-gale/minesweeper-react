import { Game } from './components'

const App = () => {
  return (
    <div className='minesweeper-app'>
      <Game width={50} height={50} mines={375} />
    </div>
  )
}

export default App
