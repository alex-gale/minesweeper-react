import { useEffect, useState } from 'react'
import './square.scss'

const Square = ({ updateSubscribe, updateUnsubscribe, x, y, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave }) => {
  const [squareData, setSquareData] = useState({})

  const [value, setValue] = useState()
  const [opened, setOpened] = useState()
  const [highlighted, setHighlighted] = useState()
  const [flagged, setFlagged] = useState()

  const [className, setClassName] = useState('square')
  // const _class = `square${opened ? ' opened' : ' closed'}${opened ? ` value_${value}` : ''}${highlighted ? ' highlighted' : ''}${flagged ? ' flagged' : ''}`

  useEffect(() => {
    updateSubscribe(x, y, (data) => {
      const { value, opened, highlighted, flagged } = data
      setClassName(`square${opened ? ' opened' : ' closed'}${opened ? ` value_${value}` : ''}${highlighted ? ' highlighted' : ''}${flagged ? ' flagged' : ''}`)
    })

    return () => {
      updateUnsubscribe(x, y)
    }
  }, [updateSubscribe, updateUnsubscribe, x, y])

  return (
    <div
      className={className}
      onMouseDown={(e) => onMouseDown(e, x, y)}
      onMouseUp={(e) => onMouseUp(e, x, y)}
      onMouseEnter={(e) => onMouseEnter(e, x, y)}
      onMouseLeave={(e) => onMouseLeave(e, x, y)}
      onContextMenu={(e) => e.preventDefault()}
    />
  )
}

export default Square
