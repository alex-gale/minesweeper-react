import _ from 'underscore'

class Game {
  constructor (width, height, mines) {
    this.width = width
    this.height = height
    this.mines = mines
    this.clicks = 0
    this.mouseDown = false
    this.board = this.generateBoard()
  }

  /**
   * Returns a list of valid neighbouring board coordinates
   * @param {int} x
   * @param {int} y
   * @returns List of valid neighbouring coordinates
   */
  getNeighbours (x, y) {
    // list of all possible neighbours
    const possibleNeighbours = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]
    // filter out spaces outside of the board
    const neighbours = possibleNeighbours.filter((coord) => {
      return coord[0] >= 0 && coord[0] < this.width && coord[1] >= 0 && coord[1] < this.height
    })

    return neighbours
  }

  /**
   * Generate a minesweeper board based on the specs of this game
   * @returns A random minesweeper board of width this.width and height this.height
   */
  generateBoard () {
    // generate list of random mine locations by creating array of numbers 1 - (width * height) and sampling `mines` numbers
    const mineLocations = _.sample([...Array(this.width * this.height).keys()], this.mines)
    // convert square numbers to coordinates
    const mineCoordinates = mineLocations.map((loc) => [
      /* x */ loc % this.width,
      /* y */ Math.floor(loc / this.width)
    ])

    // create a width * height array of square data objects
    const board = [...Array(this.height)].map(() => {
      return [...Array(this.width)].map(() => {
        return {
          value: 0,
          opened: false,
          highlighted: false,
          flagged: false,
          update: () => {}
        }
      })
    })

    mineCoordinates.forEach(([x, y]) => {
      // set square to mine
      board[y][x].value = -1

      // iterate through valid neighbours
      this.getNeighbours(x, y).forEach(([nx, ny]) => {
        // if neighbour is not a mine, increment adjacent mine count
        if (board[ny][nx].value !== -1) {
          board[ny][nx].value += 1
        }
      })
    })

    return board
  }

  /**
   * Update a value given square on the board and send the update to the component
   * @param {int} x
   * @param {int} y
   * @param {string} property The property to update
   * @param {*} value The value to give the property
   */
  updateSquare (x, y, property, value) {
    this.board[y][x][property] = value
    this.board[y][x].update(this.board[y][x])
  }

  /**
   * Opens a square at (x, y) on the board, and recursively opens neighbours if it is a 0
   * @param {int} x
   * @param {int} y
   */
  openSquare (x, y) {
    const squareData = this.board[y][x]

    if (squareData.flagged) {
      return
    }

    if (squareData.opened) {
      this.chordSquare(x, y)
      return
    }

    this.updateSquare(x, y, 'opened', true)
    this.updateSquare(x, y, 'flagged', false)

    // if the square is a zero, open all neighbours recursively
    if (squareData.value === 0) {
      this.getNeighbours(x, y).forEach(([nx, ny]) => {
        if (!this.board[ny][nx].opened) {
          this.openSquare(nx, ny)
        }
      })
    }
  }

  /**
   * Counts flags surrounding (x, y) and opens neighbours if flag count matches desired number
   * @param {int} x
   * @param {int} y
   */
  chordSquare (x, y) {
    // count flags around square (x, y)
    let flagCount = 0
    const neighbours = this.getNeighbours(x, y)
    neighbours.forEach(([nx, ny]) => {
      if (this.board[ny][nx].flagged) {
        flagCount += 1
      }
    })

    // if the flagcount matches the square's value, open all neighbours
    if (flagCount === this.board[y][x].value) {
      neighbours.forEach(([nx, ny]) => {
        if (!this.board[ny][nx].opened) {
          this.openSquare(nx, ny)
        }
      })
    }
  }

  /**
   * Toggles flag on a given closed square
   * @param {int} x
   * @param {int} y
   */
  toggleFlag (x, y) {
    if (!this.board[y][x].opened) {
      this.updateSquare(x, y, 'flagged', !this.board[y][x].flagged)
    }
  }

  /**
   * Sets a square and its unopened neighbours to be highlighted
   * @param {int} x
   * @param {int} y
   */
  highlightSquare (x, y) {
    if (!this.board[y][x].opened) {
      this.updateSquare(x, y, 'highlighted', true)
      return
    }

    this.getNeighbours(x, y).forEach(([nx, ny]) => {
      if (!this.board[ny][nx].opened) {
        this.updateSquare(nx, ny, 'highlighted', true)
      }
    })
  }

  /**
   * Sets a square and its neighbours to be unhighlighted
   * @param {int} x
   * @param {int} y
   */
  unHighlightSquare (x, y) {
    this.updateSquare(x, y, 'highlighted', false)

    this.getNeighbours(x, y).forEach(([nx, ny]) => {
      this.updateSquare(nx, ny, 'highlighted', false)
    })
  }

  /**
   * Set up a connection between square in the board and the render component
   * @param {int} x
   * @param {int} y
   * @param {function} subscribeFunction
   */
  squareUpdateSubscribe (x, y, subscribeFunction) {
    this.updateSquare(x, y, 'update', subscribeFunction)
  }

  /**
   * Remove connection between square in the board and the render component
   * @param {int} x
   * @param {int} y
   * @param {function} subscribeFunction
   */
  squareUpdateUnsubscribe (x, y) {
    this.updateSquare(x, y, 'update', () => {})
  }
}

export default Game
