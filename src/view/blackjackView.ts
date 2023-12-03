import BlackjackTable from '../model/blackjack/blackjackTable'
import Player from '../model/common/player'

export class BlackjackView {
  /*
  createBetModal(table: BlackjackTable): void
  bet phaseで使うチップ選択のモーダルを生成する
  */
  static createBetModal(table: BlackjackTable) {
    const root = document.getElementById('app')

    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.id = 'bet-modal'

    const betButton = document.createElement('button')
    betButton.innerText = 'Bet'
    betButton.classList.add('bet-button')

    let betCount = 0
    table.betDenominations.forEach((denomination: number) => {
      const chipButton = document.createElement('button')
      chipButton.innerText = denomination.toString()
      chipButton.classList.add('coin-button')

      modal.append(chipButton)

      chipButton.addEventListener('click', () => {
        betButton.ariaDisabled = 'false'
        const playerChips = table.getTurnPlayer().chips
        const bet = document.querySelectorAll('.bet')[1]
        betCount += playerChips >= betCount + denomination ? denomination : 0
        bet.innerHTML = `Bet: ${betCount}`
        betButton.innerHTML = `Bet ${betCount} & Start`
      })
    })

    const clearButton = document.createElement('button')
    clearButton.innerText = 'Clear'
    clearButton.classList.add('clear-button')
    clearButton.addEventListener('click', () => {
      betButton.ariaDisabled = 'true'

      betCount = 0
      const betCounter = document.querySelectorAll('.bet')[1]
      betCounter.innerHTML = `Bet: ${table.getTurnPlayer().bet}`
      betButton.innerHTML = 'Bet'
    })

    modal.append(clearButton, betButton)

    root?.append(modal)
  }

  /*
  createActionsModal(): void
  acting phaseで使う行動選択のモーダルを生成する
  */
  static createActionsModal() {
    const root = document.getElementById('app')

    const container = document.createElement('div')

    const hitButton = document.createElement('button')
    hitButton.innerText = 'Hit'
    hitButton.classList.add('hit-button')

    const standButton = document.createElement('button')
    standButton.innerText = 'Stand'
    standButton.classList.add('stand-button')

    const doubleButton = document.createElement('button')
    doubleButton.innerText = 'Double'
    doubleButton.classList.add('double-button')

    const surrenderButton = document.createElement('button')
    surrenderButton.innerText = 'Surrender'
    surrenderButton.classList.add('surrender-button')

    container.append(hitButton, standButton, doubleButton, surrenderButton)
    root?.append(container)
  }

  /*
  createPlayerView(player: Player, table: BlackjackTable): void
  プレイヤーの情報を表示する
  */
  static createPlayerView(player: Player, table: BlackjackTable) {
    const root = document.getElementById('app')

    const container = document.createElement('div')
    container.classList.add('player-container', 'pb-6')

    const name = document.createElement('h2')
    name.innerText = player.name

    const chips = document.createElement('h3')
    chips.classList.add('chips')

    const bet = document.createElement('h3')
    bet.classList.add('bet')

    if (player.type !== 'dealer') {
      chips.innerText = `Chips: ${player.chips}`
      bet.innerText = `Bet: ${player.bet}`
    }
    const hand = document.createElement('div')
    hand.classList.add('hand')
    const imgContainer = document.createElement('div')

    const score = document.createElement('h3')

    const status = document.createElement('h3')
    status.classList.add('status')

    score.classList.add('score')
    switch (table.gamePhase) {
      case 'acting':
        score.innerText =
          player.type === 'dealer'
            ? `Score: ?`
            : `Score: ${player.getHandScore()}`
        status.innerText = `Status: ${player.gameStatus}`
        break
      case 'dealer turn':
        score.innerText = `Score: ${player.getHandScore()}`
        status.innerText = `Status: ${player.gameStatus}`
        break
    }

    imgContainer.classList.add('card-img-container', 'flex')
    for (let card of player.hand) {
      const img = document.createElement('img')
      img.classList.add('card-img', 'w-1/4')
      img.src =
        table.gamePhase !== 'dealer turn' &&
        player.type === 'dealer' &&
        player.hand.indexOf(card) === 1
          ? '../../assets/cards/reverseImage.svg'
          : `../../assets/cards/${card.suit}${card.rank}.svg`
      imgContainer.append(img)
      hand.append(imgContainer)
    }

    container.append(name, chips, bet, score, status, hand)
    root?.append(container)
  }

  /*
  createRoundOverModal(table: BlackjackTable): void
  ラウンドが終了した際に表示するモーダルを生成する
  */
  static createRoundOverModal(table: BlackjackTable) {
    const root = document.getElementById('app')

    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.id = 'round-over-modal'

    const title = document.createElement('h2')
    title.innerText = `Round ${table.roundCount + 1} is Over!`

    const resultsLog = document.createElement('p')
    resultsLog.innerText = table.evaluateAndGetRoundResults()

    const nextRoundButton = document.createElement('button')
    nextRoundButton.innerText = 'Next Round'
    nextRoundButton.classList.add('next-round-button')

    modal.append(title, resultsLog, nextRoundButton)
    root?.append(modal)
  }

  /*
  createGameOverModal(table: BlackjackTable): void
  操作プレイヤーのチップがなくなった際に表示するモーダルを生成する
  */
  static createGameOverModal() {
    const root = document.getElementById('app')

    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.id = 'game-over-modal'

    const title = document.createElement('h2')
    title.innerText = `Game Over!`

    const resultsLog = document.createElement('p')
    resultsLog.innerText = `You ran out of chips!`

    const restartButton = document.createElement('button')
    restartButton.innerText = 'Restart'
    restartButton.classList.add('restart-button')

    const backButton = document.createElement('button')
    backButton.innerText = 'Back to Mode Select'
    backButton.classList.add('back-button')

    modal.append(title, resultsLog, restartButton, backButton)
    root?.append(modal)
  }

  /*
  createFinalResultsModal(table: BlackjackTable): void
  全ラウンド終了後に表示するモーダルを生成する
  */
  static createFinalResultsModal(table: BlackjackTable) {
    const root = document.getElementById('app')

    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.id = 'final-results-modal'

    const title = document.createElement('h2')
    title.innerText = `Final Results`

    const resultsLog = document.createElement('p')
    resultsLog.innerText = table.evaluateAndGetFinalResults()

    const backButton = document.createElement('button')
    backButton.innerText = 'Back to Mode Select'
    backButton.classList.add('back-button')

    modal.append(title, resultsLog, backButton)
    root?.append(modal)
  }

  static createTutorialView() {}
}
