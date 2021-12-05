import React, { useEffect, useState } from 'react'

import Board from './board'
import MSGame from '../../lib/minesweeper'
import images from '../../assets/minesweeper'

const Game = ({ width, height, mines }) => {
  const [game, setGame] = useState()

  useEffect(() => {
    // Preload all images
    images.forEach(img => {
      const image = new window.Image()
      image.src = img
    })
  }, [])

  useEffect(() => {
    setGame(new MSGame(width, height, mines))
  }, [width, height, mines])

  const handleMouseDown = (event, x, y) => {
    if (event.button === 0) {
      // on left click down
      game.mouseDown = true
      game.highlightSquare(x, y)
    } else if (event.button === 2) {
      // on right click down, place flag
      event.preventDefault()
      game.toggleFlag(x, y)
    }
  }

  const handleMouseUp = (event, x, y) => {
    if (event.button === 0) {
      // on left click up, open selected square
      game.mouseDown = false
      game.unHighlightSquare(x, y)
      game.openSquare(x, y)
      game.clicks += 1
    }
  }

  const handleMouseEnter = (event, x, y) => {
    if (game.mouseDown) {
      game.highlightSquare(x, y)
    }
  }

  const handleMouseLeave = (event, x, y) => {
    if (game.mouseDown) {
      game.unHighlightSquare(x, y)
    }
  }

  return (
    <Board
      board={game ? game.board : [[]]}
      subscribeFunction={game ? game.squareUpdateSubscribe.bind(game) : () => {}}
      unsubscribeFunction={game ? game.squareUpdateUnsubscribe.bind(game) : () => {}}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}

export default Game
