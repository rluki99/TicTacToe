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

let selectedSymbol
let selectedVersus
let playerTurn = true
let aiTurn = false

const gameController = () => {
	const player1 = createPlayer('Player 1', 'X')
	const player2 = createPlayer('Player 2', 'O')
	const winnerInfo = document.querySelector('.modal__winner')

	const togglersBox = document.querySelector('.togglers')

	const symbolTogglerOptions = document.querySelectorAll('.toggler__option--symbol .toggler__option-input')
	selectedSymbol = document.querySelector('.toggler__option--symbol .toggler__option-input:checked').value

	const versusTogglerOptions = document.querySelectorAll('.toggler__option--versus .toggler__option-input')
	selectedVersus = document.querySelector('.toggler__option--versus .toggler__option-input:checked').value

	let currentPlayer

	const cells = document.querySelectorAll('.board__cell')

	symbolTogglerOptions.forEach(option => {
		option.addEventListener('change', () => {
			console.log(option.value)
			selectedSymbol = option.value
			startGame()
		})
	})

	versusTogglerOptions.forEach(option => {
		option.addEventListener('change', () => {
			console.log(option.value)
			selectedVersus = option.value
			startGame()
		})
	})

	console.log(selectedSymbol)

	const startGame = () => {
		console.log(`selected symbol ${selectedSymbol}`)
		currentPlayer = selectedSymbol === player1.symbol ? player1 : player2

		const handleClick = (cell, index) => {
			if (!playerTurn || aiTurn) {
				return
			}

			if (gameBoard.makeMove(index, currentPlayer.symbol)) {
				if(selectedVersus === 'ai') {
					playerTurn = false
				}
				
				cell.textContent = currentPlayer.symbol
				console.log(index)
				if (checkWinner()) {
					endGame(currentPlayer)
				} else if (checkTie()) {
					endGame(null)
				} else {
					currentPlayer = currentPlayer === player1 ? player2 : player1
					if (selectedVersus === 'ai' && currentPlayer.symbol !== selectedSymbol) {
						aiMove()
					}
				}
			}
		}

		cells.forEach((cell, index) => {
			cell.addEventListener('click', () => {
				handleClick(cell, index)
			})
		})

		if (selectedVersus === 'ai' && currentPlayer.symbol !== selectedSymbol) {
			aiMove()
		}
	}

	const aiMove = async () => {
		aiTurn = true
		const cellsArray = Array.from(cells) // Tworzymy tablicę z elementów komórek planszy
		const emptyCells = cellsArray.filter((cell, index) => gameBoard.isSpotTaken(index) === false) // Filtrujemy wolne komórki

		if (emptyCells.length === 0) {
			return // Nie ma wolnych miejsc, nie ma ruchu AI do wykonania
		}

		const randomIndex = Math.floor(Math.random() * emptyCells.length) // Losujemy indeks komórki do postawienia symbolu
		const selectedCell = emptyCells[randomIndex] // Wybieramy losową komórkę

		await delay(500)

		gameBoard.makeMove([...cells].indexOf(selectedCell), currentPlayer.symbol) // Wykonujemy ruch AI w logice gry
		selectedCell.textContent = currentPlayer.symbol // Wyświetlamy symbol AI w wybranej komórce

		if (checkWinner()) {
			endGame(currentPlayer)
		} else if (checkTie()) {
			endGame(null)
		} else {
			currentPlayer = currentPlayer === player1 ? player2 : player1
		}

		aiTurn = false
		playerTurn = true
	}

	const delay = milliseconds => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	const endGame = winner => {
		if (winner) {
			winnerInfo.textContent = `Player '${winner.symbol}' wins!`
		} else {
			winnerInfo.textContent = `It's a tie!`
		}
		openModal()
		togglersBox.classList.remove('togglers--inactive')
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
		togglersBox.style.display = 'block'
		playerTurn = true
		aiTurn = false
		closeModal()
	}

	const resetButton = document.querySelector('.modal__reset')
	resetButton.addEventListener('click', resetGame)

	cells.forEach(cell => {
		cell.addEventListener('click', () => {
			togglersBox.classList.add('togglers--inactive')
		})
	})

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
