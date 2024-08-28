document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelector(".grid div"));
  // console.table(squares);
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId = 0;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];

  //The Tetrominoes
  //0xx
  //0x0
  //0x0
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  console.log(theTetrominoes[0][0]);
  
  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

   //draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
  })
}
  
  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    })
  }

  //assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

  ////fix rotation of tetrominos at the egde
  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
  }

  function checkRotatePosition(P) {
    //get current position.  Then, check if the piece is near the left side.
    P = P || currentPosition
    //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
    if ((P+1) % width < 4) {
    //use actual position to check if it's flipped over to right side  
    if (isAtRight()) {
    //if so, add one to wrap it back around
    currentPosition +=1
    //check again.  Pass position from start, since long block might need to move more.  
    checkRotatePosition(P)
    }
  }
  else if (P % width > 5) {
    if (isAtLeft()){
      currentPosition -= 1
      checkRotatedPosition(P)
    }
  }
}

//rotate the tetromino
function rotate() {
  undraw()
  currentRotation ++
  if(currentRotation === current.length) {
    //if the current rotation gets to 4, make it go back to 0
    currentRotation = 0
  }
  current = theTetrominoes[random][currentRotation]
  checkRotatedPosition()
  draw()
}
////


//show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

//the Tetrominos without rotations
const upNextTetrominoes = [
//lTetromino
  [1, displayWidth+1, displayWidth*2+1, 2], 
 //zTetromino
  [0, displayWidth, displayWidth+1, displayWidth*2+1],
//tTetromino
  [1, displayWidth, displayWidth+1, displayWidth+2], 
 //oTetromino
  [0, 1, displayWidth, displayWidth+1],
//iTetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] 
]

//display the shape in the mini-grid display
function displayShape() {
  //remove any trace of a tetromino form the entire grid
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ''
  })
  upNextTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}