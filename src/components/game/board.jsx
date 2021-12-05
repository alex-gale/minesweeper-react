import React from 'react'
import Square from './square'

import './board.scss'

const Board = ({ board, subscribeFunction, unsubscribeFunction, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave }) => {
  return (
    <div className='board'>
      {
        board.map((row, i) => (
          <div key={i} className='board-row'>
            {
              row.map((square, j) => (
                <Square
                  key={`${i}, ${j}`}
                  updateSubscribe={subscribeFunction}
                  updateUnsubscribe={unsubscribeFunction}
                  x={j}
                  y={i}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default Board
