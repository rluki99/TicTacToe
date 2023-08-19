const gameBoard = () => {
	const board = Array(9).fill('')

	const getBoard = () => board

	const makeMove = (index, playerSymbol) => {
		if (!isSpotTaken(index)) {
			board[index] = playerSymbol
			return true
		}
		return false
	}

	const isSpotTaken = (index) => board[index] !== ''

	const isBoardFull = () => board.every((cell) => cell !== '')

	return { getBoard, makeMove, isSpotTaken, isBoardFull }
}

const createPlayer = (name, symbol) => {
	return {
		name: name,
		symbol: symbol,
	}
}

const gameController = () => {
    const player1 = createPlayer('Player 1', 'X')
    const player2 = createPlayer('Player 2', 'O')
    let currentPlayer = player1
    let gameActive = false

    const cells = document.querySelectorAll('.board__cell')
}