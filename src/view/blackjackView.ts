import { Controller } from '../controller/controller'
import BlackjackTable from '../model/blackjack/blackjackTable'
import Player from '../model/common/player'
import { BaseScene } from './common/baseScene'
import { Button } from './components/button'
import Text = Phaser.GameObjects.Text
import Image = Phaser.GameObjects.Image

export class BlackjackView extends BaseScene {
  table: BlackjackTable | null = null
  user: Player | null = null
  dealer: Player | null = null
  difficulty: string = ''
  maxRounds: number = 0

  #userChipCount: number = 100
  #userChipText: Text | null = null
  #userBetCount: number = 0
  #userBetText: Text | null = null

  #chipButtons: Button[] = []
  #betButton: Button | null = null
  #clearButton: Button | null = null
  #actionButtons: Button[] = []
  #nextButton: Button | null = null
  #againButton: Button | null = null
  #backButton: Button | null = null

  #playerNameTexts: Text[] = []
  #chipTexts: Text[] = []
  #betTexts: Text[] = []
  #scoreTexts: Text[] = []

  #playersHandsImages: Image[][] = [[], [], []]
  #dealerHandImages: Image[] = []

  create(data: any) {
    super.create(data)

    // reset all the scene
    this.#chipButtons = []
    this.#betButton = null
    this.#clearButton = null
    this.#actionButtons = []
    this.#betTexts = []
    this.#scoreTexts = []
    this.#playersHandsImages = [[], [], [], []]
    this.#dealerHandImages = []

    console.log()
    this.table = data.table
    this.user = this.table!.players[0]
    this.dealer = this.table!.dealer
    this.difficulty = this.table!.difficulty
    this.maxRounds = this.table!.maxRounds

    this.renderScene()
  }

  renderScene() {
    this.userChipText()
    this.userBetText()

    console.log(this.table!.gamePhase)
    if (this.table!.roundCount === this.table!.maxRounds) {
      this.finalResults()
      return
    }
    switch (this.table!.gamePhase) {
      case 'game over':
        this.gameOver()

        this.#userBetCount = 0
        this.#userChipCount = this.user!.chips
        this.#userChipText!.destroy()
        this.#userBetText!.destroy()
        this.userChipText()
        this.userBetText()
        return

      case 'evaluating':
        this.roundResults()

        this.#userBetCount = 0
        this.#userChipCount = this.user!.chips
        this.#userChipText!.destroy()
        this.#userBetText!.destroy()
        this.userChipText()
        this.userBetText()
        return
      case 'dealer turn':
        // flip the dealer's card once
        if (this.dealer!.gameStatus === 'waiting') {
          this.flipDealerCard()
        }
        this.playersInfo()

        this.dealer!.gameStatus =
          this.dealer!.gameStatus === 'waiting'
            ? 'acting'
            : this.dealer!.gameStatus
        setTimeout(() => {
          if (
            this.dealer!.gameStatus === 'acting' &&
            this.dealer!.getHandScore() < 17
          ) {
            this.table!.haveTurn()

            this.drawCard(this.dealer!)
            this.renderScene()
            return
          } else {
            this.table!.haveTurn()
            this.renderScene()
            return
          }
        }, 3000)
        return
    }

    const turnPlayer = this.table!.getTurnPlayer()
    switch (turnPlayer.type) {
      case 'human':
        if (this.table!.gamePhase === 'betting') {
          this.chipButtons()
          this.betButton()
          this.clearButton()
        } else if (this.table!.gamePhase === 'acting') {
          // deal hands if hands are not dealt yet
          if (this.#playersHandsImages[0].length === 0) {
            this.dealInitialHands()
          }

          this.playersInfo()

          if (this.table!.playerActionResolved(turnPlayer)) {
            this.table!.haveTurn()
            this.renderScene()
          } else {
            this.hitButton()
            this.standButton()
            this.doubleButton()
            this.surrenderButton()
          }
        }
        break

      default:
        this.playersInfo()
        // this.currentHands()
        // this.
        setTimeout(() => {
          switch (this.table!.gamePhase) {
            case 'betting':
              this.table!.haveTurn()
              this.renderScene()
              return
            case 'acting':
              this.table!.haveTurn()
              if (!this.table!.playerActionResolved(turnPlayer)) {
                this.drawCard(turnPlayer)
              }
              this.renderScene()
              return
          }
        }, 3000)
    }
  }

  chipButtons() {
    for (let i = 0; i < this.table!.betDenominations.length; i++) {
      const chipButton = new Button(
        this,
        220 + i * 100,
        300,
        this.table!.betDenominations[i].toString(),
        'coin',
        'coin-se',
        () => {
          this.#userBetCount +=
            this.#userBetCount + this.table!.betDenominations[i] <=
            this.user!.chips
              ? this.table!.betDenominations[i]
              : 0
          this.#betButton?.destroy()
          this.betButton()

          this.#userChipCount -=
            this.#userChipCount - this.table!.betDenominations[i] >= 0
              ? this.table!.betDenominations[i]
              : 0
          this.#userChipText!.destroy()
          this.userChipText()

          this.#userBetText!.destroy()
          this.userBetText()
        }
      )
      this.#chipButtons.push(chipButton)
    }
  }

  betButton() {
    this.#betButton = new Button(
      this,
      420,
      400,
      `Bet ${this.#userBetCount} & Deal`,
      'orange-button',
      'select-se',
      () => {
        if (this.#userBetCount <= 0) return

        // clear previous buttons
        this.#chipButtons.forEach((button: Button) => button.destroy())
        this.#actionButtons.forEach((button: Button) => button.destroy())
        this.#betButton?.destroy()
        this.#clearButton?.destroy()

        this.table!.haveTurn(this.#userBetCount)
        this.renderScene()
      }
    )
  }

  clearButton() {
    this.#clearButton = new Button(
      this,
      220,
      400,
      `Clear`,
      'orange-button',
      'coin-se',
      () => {
        this.#userChipCount += this.#userBetCount
        this.#userBetCount = 0

        this.#betButton?.destroy()
        this.betButton()
        this.#userBetText!.destroy()
        this.userBetText()

        this.#userChipCount += this.user!.bet
        this.#userChipText!.destroy()
        this.userChipText()
      }
    )
  }

  hitButton() {
    const hitButton = new Button(
      this,
      100,
      700,
      'Hit',
      'orange-button',
      'select-se',
      () => {
        // destroy
        this.#actionButtons.forEach((button: Button) => button.destroy())

        this.table!.haveTurn('hit')
        this.drawCard(this.user!)
        this.renderScene()
      }
    )
    this.#actionButtons.push(hitButton)
  }

  standButton() {
    const standButton = new Button(
      this,
      300,
      700,
      'Stand',
      'orange-button',
      'select-se',
      () => {
        this.#actionButtons.forEach((button: Button) => button.destroy())

        this.table!.haveTurn('stand')
        this.renderScene()
      }
    )
    this.#actionButtons.push(standButton)
  }

  doubleButton() {
    const doubleButton = new Button(
      this,
      500,
      700,
      'Double',
      'orange-button',
      'select-se',
      () => {
        this.#actionButtons.forEach((button: Button) => button.destroy())

        this.table!.haveTurn('double')
        this.drawCard(this.user!)
        this.renderScene()
      }
    )
    this.#actionButtons.push(doubleButton)
  }

  surrenderButton() {
    const surrenderButton = new Button(
      this,
      700,
      700,
      'Surrender',
      'orange-button',
      'select-se',
      () => {
        this.table!.haveTurn('surrender')
        this.renderScene()
      }
    )
    this.#actionButtons.push(surrenderButton)
  }

  playersInfo() {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    this.#chipTexts.forEach((text: Text) => text.destroy())
    this.#betTexts.forEach((text: Text) => text.destroy())
    this.#scoreTexts.forEach((text: Text) => text.destroy())

    this.playerNameTexts()
    this.chipTexts()
    this.playerScoreTexts()
    this.betTexts()
  }

  playerNameTexts() {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    const dealerNameText = this.add.text(350, 60, `${this.dealer!.name}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })

    this.#playerNameTexts.push(dealerNameText)

    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const playerNameText = this.add.text(
        100 + i * 250,
        280,
        `${player.name}`,
        {
          fontSize: '20px',
          color: '#ffffff',
          fontFamily: 'pixel'
        }
      )
      this.#playerNameTexts.push(playerNameText)
    }
  }

  userChipText() {
    this.#userChipText?.destroy()

    const userChipText = this.add.text(0, 30, `Chips: ${this.#userChipCount}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })
    this.#userChipText = userChipText
  }

  userBetText() {
    this.#userBetText?.destroy()

    const userBetText = this.add.text(0, 60, `Bet: ${this.#userBetCount}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })
    this.#userBetText = userBetText
  }

  chipTexts() {
    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const chipText = this.add.text(
        100 + i * 250,
        320,
        `Chips: ${player.chips}`,
        {
          fontSize: '20px',
          color: '#ffffff',
          fontFamily: 'pixel'
        }
      )
      this.#chipTexts.push(chipText)
    }
  }

  betTexts() {
    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const betText = this.add.text(100 + i * 250, 340, `Bet: ${player.bet}`, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'pixel'
      })
      this.#betTexts.push(betText)
    }
  }
  playerScoreTexts() {
    // destroy previous texts
    this.#scoreTexts.forEach((text: Text) => text.destroy())

    const dealerScore =
      this.table!.gamePhase === 'dealer turn'
        ? `Score: ${this.table!.dealer.getHandScore()}`
        : 'Score: ?'

    const dealerScoreText = this.add.text(350, 100, dealerScore, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })

    this.#scoreTexts.push(dealerScoreText)

    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const playerScore =
        player.hand.length > 0 ? `Score: ${player.getHandScore()}` : 'Score: ?'
      const playerScoreText = this.add.text(100 + i * 250, 360, playerScore, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'pixel'
      })

      this.#scoreTexts.push(playerScoreText)
    }
  }

  dealInitialHands() {
    const dealerHands = this.table!.dealer.hand
    for (let i = 0; i < dealerHands.length; i++) {
      const card = dealerHands[i]

      // move card from the top center to the dealer's hand with sound
      const cardImage = this.add.image(400, 0, 'back')
      this.tweens.add({
        targets: cardImage,
        x: 350 + i * 50,
        y: 180,
        duration: 1000,
        ease: 'Power2',
        delay: i * 100
      })

      this.sound.play('card-se')

      // flip the first card with animation
      if (i === 0) {
        setTimeout(() => {
          this.sound.play('card-flip-se')

          this.add.tween({
            targets: cardImage,
            scaleX: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              cardImage.setTexture(`${card.rank}${card.suit}`)
              this.add.tween({
                targets: cardImage,
                scaleX: 1,
                duration: 500,
                ease: 'Power2'
              })
            }
          })
        }, 1000)
      }
      this.#dealerHandImages.push(cardImage)
    }

    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const playerHands = player.hand
      for (let j = 0; j < playerHands.length; j++) {
        const card = playerHands[j]
        const cardImage = this.add.image(400, -10, card.getImageKey())
        this.tweens.add({
          targets: cardImage,
          x: 100 + i * 250 + j * 50,
          y: 440,
          sound: 'card-se',
          duration: 1000,
          ease: 'Power2',
          delay: i * 100
        })

        // flip all the cards with animation
        setTimeout(() => {
          this.add.tween({
            targets: cardImage,
            scaleX: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              cardImage.setTexture(`${card.rank}${card.suit}`)
              this.add.tween({
                targets: cardImage,
                scaleX: 1,
                duration: 500,
                ease: 'Power2'
              })
            }
          })
        }, 1000)
        this.#playersHandsImages[i].push(cardImage)
      }
    }
  }

  drawCard(player: Player) {
    const card = player.hand[player.hand.length - 1]
    const cardImage = this.add.image(400, -10, 'back')
    const playerIndex = this.table!.players.indexOf(player)

    let posX: number = 0
    let posY: number = 0
    if (player.type === 'dealer') {
      posX = 350 + (player.hand.length - 1) * 50
      posY = 180
    } else {
      posX = 100 + playerIndex * 250 + (player.hand.length - 1) * 50
      posY = 440
    }
    this.tweens.add({
      targets: cardImage,
      x: posX,
      y: posY,
      duration: 1000,
      ease: 'Power2',
      delay: (playerIndex - 1) * 100
    })

    this.sound.play('card-se')

    setTimeout(() => {
      this.sound.play('card-flip-se')
      this.add.tween({
        targets: cardImage,
        scaleX: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          cardImage.setTexture(`${card.rank}${card.suit}`)
          this.add.tween({
            targets: cardImage,
            scaleX: 1,
            duration: 500,
            ease: 'Power2'
          })
        }
      })
    }, 1000)
    if (player.type === 'dealer') {
      this.#dealerHandImages.push(cardImage)
    } else {
      this.#playersHandsImages[playerIndex].push(cardImage)
    }
  }

  flipDealerCard() {
    // use the existing card image
    const card = this.dealer!.hand[1]
    const cardImage = this.#dealerHandImages[1]

    // flip the card with animation
    setTimeout(() => {
      this.sound.play('card-flip-se')

      this.add.tween({
        targets: cardImage,
        scaleX: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          cardImage.setTexture(`${card.rank}${card.suit}`)
          this.add.tween({
            targets: cardImage,
            scaleX: 1,
            duration: 500,
            ease: 'Power2'
          })
        }
      })
    }, 1000)
  }

  roundResults() {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    this.#chipTexts.forEach((text: Text) => text.destroy())
    this.#betTexts.forEach((text: Text) => text.destroy())
    this.#scoreTexts.forEach((text: Text) => text.destroy())

    this.#actionButtons.forEach((button: Button) => button.destroy())
    this.#chipButtons.forEach((button: Button) => button.destroy())
    this.#betButton?.destroy()
    this.#clearButton?.destroy()
    this.#playersHandsImages.forEach((hand: Image[]) => {
      hand.forEach((card: Image) => card.destroy())
    })
    this.#dealerHandImages.forEach((card: Image) => card.destroy())

    // if user won, play win sound
    if (
      this.user!.getHandScore() > 21 ||
      (this.dealer!.getHandScore() > this.user!.getHandScore() &&
        this.dealer!.getHandScore() <= 21) ||
      this.user!.gameStatus === 'surrender'
    ) {
      this.sound.play('lose-se')
    } else if (
      this.user!.getHandScore() > this.dealer!.getHandScore() ||
      this.dealer!.getHandScore() > 21
    ) {
      this.sound.play('win-se')
    }
    const resultsLog = this.table!.evaluateAndGetRoundResults()
    this.add.text(400, 300, resultsLog, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })

    this.nextButton(this.user!.name)
  }

  nextButton(username: string) {
    const nextButton = new Button(
      this,
      400,
      400,
      'Next',
      'orange-button',
      'select-se',
      () => {
        this.table!.resetRoundInfo()
        // this.table = new BlackjackTable(
        //   'blackjack',
        //   username,
        //   this.difficulty,
        //   this.maxRounds
        // )
        // this.user = this.table.players[0]
        // this.dealer = this.table.dealer
        this.create({ table: this.table, difficulty: this.difficulty })
      }
    )
    this.#nextButton = nextButton
  }

  finalResults() {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    this.#chipTexts.forEach((text: Text) => text.destroy())
    this.#scoreTexts.forEach((text: Text) => text.destroy())
    this.#betTexts.forEach((text: Text) => text.destroy())
    this.#actionButtons.forEach((button: Button) => button.destroy())
    this.#chipButtons.forEach((button: Button) => button.destroy())
    this.#betButton?.destroy()
    this.#clearButton?.destroy()
    this.#playersHandsImages.forEach((hand: Image[]) => {
      hand.forEach((card: Image) => card.destroy())
    })
    this.#dealerHandImages.forEach((card: Image) => card.destroy())

    const resultsLog = this.table!.evaluateAndGetFinalResults()
    this.add.text(400, 300, resultsLog, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })

    if (
      this.user!.chips >
      Math.max(this.table!.players[1].chips, this.table!.players[2].chips)
    ) {
      this.sound.play('win-se')
    } else {
      this.sound.play('lose-se')
    }

    this.againButton()
    this.backButton()
  }

  gameOver() {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    this.#chipTexts.forEach((text: Text) => text.destroy())
    this.#betTexts.forEach((text: Text) => text.destroy())
    this.#scoreTexts.forEach((text: Text) => text.destroy())
    this.#actionButtons.forEach((button: Button) => button.destroy())
    this.#chipButtons.forEach((button: Button) => button.destroy())
    this.#betButton?.destroy()
    this.#clearButton?.destroy()
    this.#playersHandsImages.forEach((hand: Image[]) => {
      hand.forEach((card: Image) => card.destroy())
    })

    this.#dealerHandImages.forEach((card: Image) => card.destroy())

    // gameover sound
    this.sound.play('lose-se')

    const resultsLog = 'You ran out of chips...'
    this.add.text(400, 300, resultsLog, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })

    this.againButton()
    this.backButton()
  }

  againButton() {
    const againButton = new Button(
      this,
      400,
      400,
      'Again',
      'orange-button',
      'select-se',
      () => {
        this.table!.resetRoundInfo()
        this.table = new BlackjackTable(
          'blackjack',
          this.user!.name,
          this.difficulty,
          this.maxRounds
        )
        this.user = this.table.players[0]
        this.dealer = this.table.dealer
        this.create({ table: this.table })
      }
    )
    this.#againButton = againButton
  }

  backButton() {
    const backButton = new Button(
      this,
      400,
      500,
      'Back',
      'orange-button',
      'select-se',
      () => {
        const root = document.getElementById('app')
        root!.innerHTML = ''
        Controller.renderModeSelectPage(['blackjack', 'war'], 'player')
      }
    )
    this.#backButton = backButton
  }
  static createTutorialView() {}
}
