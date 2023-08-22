const gameBoard = (() => {
	const board = Array(9).fill('')

	const getBoard = () => board

	const makeMove = (index, playerSymbol) => {
		if (!isSpotTaken(index)) {
			board[index] = playerSymbol
			return true
		}
		return false
	}

	const isSpotTaken = index => board[index] !== ''

	const isBoardFull = () => board.every(cell => cell !== '')

	return { getBoard, makeMove, isSpotTaken, isBoardFull }
})()

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

	const startGame = () => {
		gameActive = true
		cells.forEach(cell => {
			cell.textContent = ''
		})
		cells.forEach((cell, index) => {
			cell.addEventListener('click', () => {
				if (gameActive && gameBoard.makeMove(index, currentPlayer.symbol)) {
					cell.textContent = currentPlayer.symbol
					if (checkWinner()) {
						endGame(currentPlayer)
					} else if (checkTie()) {
						endGame(null)
					} else {
						currentPlayer = currentPlayer === player1 ? player2 : player1
					}
				}
			})
		})
	}

	const endGame = winner => {
		gameActive = false
		if (winner) {
			console.log(`${winner.name} wins!`)
		} else {
			console.log(`It's a tie!`)
		}
	}

	const checkWinner = () => {
		const winningCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8], // Wiersze
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8], // Kolumny
			[0, 4, 8],
			[2, 4, 6], // Przekątne
		]

		return winningCombos.some(combo => {
			const [a, b, c] = combo
			return (
				gameBoard.getBoard()[a] !== '' &&
				gameBoard.getBoard()[a] === gameBoard.getBoard()[b] &&
				gameBoard.getBoard()[a] === gameBoard.getBoard()[c]
			)
		})
	}

	const checkTie = () => {
		return gameBoard.isBoardFull() && !checkWinner()
	}

	cells.forEach(cell => {
		cell.addEventListener('click', () => {
			if (!gameActive) {
				startGame()
			}
		})
	})
}

gameController()
