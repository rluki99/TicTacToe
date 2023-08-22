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
	let gameEnded = false

	const cells = document.querySelectorAll('.board__cell')

	const startGame = () => {
		cells.forEach(cell => {
			cell.textContent = ''
		})
		cells.forEach((cell, index) => {
			cell.addEventListener('click', () => {
				if (gameBoard.makeMove(index, currentPlayer.symbol)) {
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
		if (winner) {
			console.log(`${winner.name} wins!`)
		} else {
			console.log(`It's a tie!`)
		}
		openModal()
		gameEnded = true
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

	const resetGame = () => {
		gameBoard.getBoard().fill('')
		cells.forEach(cell => {
			cell.textContent = ''
		})
		currentPlayer = player1
		gameEnded = false
		closeModal()
	}

	const resetButton = document.querySelector('.modal__reset')
	resetButton.addEventListener('click', resetGame)

	startGame()
}

const modalControler = () => {
	const modal = document.querySelector('.modal')
	const modalOverlay = document.querySelector('.modal-overlay')

	const openModal = () => {
		modal.classList.add('modal--active')
		modalOverlay.classList.add('modal-overlay--active')
	}

	const closeModal = () => {
		modal.classList.remove('modal--active')
		modalOverlay.classList.remove('modal-overlay--active')
	}

	return { openModal, closeModal }
}

const { openModal, closeModal } = modalControler()

gameController()
