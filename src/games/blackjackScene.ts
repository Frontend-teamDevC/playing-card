import { Controller } from '../controller/controller'
import BlackjackTable from '../model/blackjack/blackjackTable'
import Player from '../model/common/player'
import { BaseScene } from './common/baseScene'
import { Button } from './common/button'
import Text = Phaser.GameObjects.Text
import Image = Phaser.GameObjects.Image

export class BlackjackScene extends BaseScene {
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

  #playerNameTexts: Text[] = []
  #chipTexts: Text[] = []
  #betTexts: Text[] = []
  #scoreTexts: Text[] = []

  #playersHandsImages: Image[][] = [[], [], []]
  #dealerHandImages: Image[] = []

  /**
   * blackjackSceneを初期化する関数
   *
   * @param {any} data - blackjackTableを含むデータ
   * @returns {void}
   */
  create(data: any): void {
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

    this.table = data.table
    this.user = this.table!.players[0]
    this.dealer = this.table!.dealer
    this.difficulty = this.table!.difficulty
    this.maxRounds = this.table!.maxRounds

    this.renderScene()
  }

  /**
   * blackjackSceneを描画する関数
   *
   * @returns {void}
   */
  renderScene(): void {
    this.arrowBackButton()

    this.userChipCount()
    this.userBetCount()

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
        this.userChipCount()
        this.userBetCount()
        return

      case 'evaluating':
        this.roundResults()

        this.#userBetCount = 0
        this.#userChipCount = this.user!.chips
        this.#userChipText!.destroy()
        this.#userBetText!.destroy()
        this.userChipCount()
        this.userBetCount()
        return
      case 'dealer turn':
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
            (this.dealer!.getHandScore() as number) < 17
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
          if (this.#playersHandsImages[0].length === 0) {
            this.dealInitialHands()
          }
          this.playersInfo()
          if (this.table!.playerActionResolved(turnPlayer)) {
            this.table!.haveTurn()
            this.renderScene()
          } else {
            this.actionButtons()
          }
        }
        break

      default:
        this.playersInfo()

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

  /**
   * チップのボタンを作成する関数
   *
   * @returns {void}
   */
  chipButtons(): void {
    for (let i = 0; i < this.table!.betDenominations.length; i++) {
      const chipButton = new Button(
        this,
        225 + i * 160,
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
          this.userChipCount()

          this.#userBetText!.destroy()
          this.userBetCount()
        }
      )
      this.#chipButtons.push(chipButton)
    }
  }

  /**
   * ベットのボタンを作成する関数
   *
   * @returns {void}
   */
  betButton(): void {
    this.#betButton = new Button(
      this,
      700,
      500,
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

  /**
   * かけ金をクリアするボタンを作成する関数
   *
   * @returns {void}
   */
  clearButton(): void {
    this.#clearButton = new Button(
      this,
      350,
      500,
      `Clear`,
      'orange-button',
      'coin-se',
      () => {
        this.#userChipCount += this.#userBetCount
        this.#userBetCount = 0

        this.#betButton?.destroy()
        this.betButton()
        this.#userBetText!.destroy()
        this.userBetCount()

        this.#userChipCount += this.user!.bet
        this.#userChipText!.destroy()
        this.userChipCount()
      }
    )
  }

  /**
   * プレイヤーの行動のボタンを作成する関数
   *
   * @returns {void}
   */
  actionButtons(): void {
    this.hitButton()
    this.standButton()
    this.doubleButton()
    this.surrenderButton()
  }

  /**
   * ヒットのボタンを作成する関数
   *
   * @returns {void}
   */
  hitButton(): void {
    const hitButton = new Button(
      this,
      200,
      600,
      'Hit',
      'orange-button',
      'select-se',
      () => {
        this.#actionButtons.forEach((button: Button) => button.destroy())

        this.table!.haveTurn('hit')
        this.drawCard(this.user!)
        this.renderScene()
      }
    )
    this.#actionButtons.push(hitButton)
  }

  /**
   * スタンドのボタンを作成する関数
   *
   * @returns {void}
   */
  standButton(): void {
    const standButton = new Button(
      this,
      400,
      600,
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

  /**
   * ダブルのボタンを作成する関数
   *
   * @returns {void}
   */
  doubleButton(): void {
    const doubleButton = new Button(
      this,
      600,
      600,
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

  /**
   * サレンダーのボタンを作成する関数
   *
   * @returns {void}
   */
  surrenderButton(): void {
    const surrenderButton = new Button(
      this,
      800,
      600,
      'Surrender',
      'orange-button',
      'select-se',
      () => {
        this.#actionButtons.forEach((button: Button) => button.destroy())

        this.table!.haveTurn('surrender')
        this.renderScene()
      }
    )
    this.#actionButtons.push(surrenderButton)
  }

  /**
   * プレイヤーの情報を表示する関数
   *
   * @returns {void}
   */
  playersInfo(): void {
    this.playerNameTexts()
    this.chipTexts()
    this.playerScoreTexts()
    this.betTexts()
  }

  /**
   * プレイヤーの名前を表示する関数
   *
   * @returns {void}
   */
  playerNameTexts(): void {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())

    const dealerNameText = this.add.text(480, 50, `${this.dealer!.name}`, {
      fontSize: '30px',
      color: '#ffffff'
    })

    this.#playerNameTexts.push(dealerNameText)

    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const playerNameText = this.add.text(
        80 + i * 380,
        270,
        `${player.name}`,
        {
          fontSize: '30px',
          color: '#ffffff'
        }
      )
      this.#playerNameTexts.push(playerNameText)
    }
  }

  /**
   * ユーザーのチップの数を表示する関数
   *
   * @returns {void}
   */
  userChipCount(): void {
    this.#userChipText?.destroy()

    const userChipText = this.add.text(
      900,
      35,
      `Chips: ${this.#userChipCount}`,
      {
        fontSize: '30px',
        color: '#ffffff'
      }
    )
    this.#userChipText = userChipText
  }

  /**
   * ユーザーのベットの数を表示する関数
   *
   * @returns {void}
   */
  userBetCount(): void {
    this.#userBetText?.destroy()

    const userBetText = this.add.text(900, 60, `Bet: ${this.#userBetCount}`, {
      fontSize: '30px',
      color: '#ffffff'
    })
    this.#userBetText = userBetText
  }

  chipTexts() {
    this.#chipTexts.forEach((text: Text) => text.destroy())

    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const chipText = this.add.text(
        80 + i * 380,
        320,
        `Chips: ${player.chips}`,
        {
          fontSize: '30px',
          color: '#ffffff'
        }
      )
      this.#chipTexts.push(chipText)
    }
  }

  /**
   * ベットの数を表示する関数
   *
   * @returns {void}
   */
  betTexts(): void {
    this.#betTexts.forEach((text: Text) => text.destroy())

    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const betText = this.add.text(80 + i * 380, 350, `Bet: ${player.bet}`, {
        fontSize: '30px',
        color: '#ffffff'
      })
      this.#betTexts.push(betText)
    }
  }

  /**
   * スコアを表示する関数
   *
   * @returns {void}
   */
  playerScoreTexts(): void {
    // destroy previous texts
    this.#scoreTexts.forEach((text: Text) => text.destroy())

    const dealerScore =
      this.table!.gamePhase === 'dealer turn'
        ? `Score: ${this.table!.dealer.getHandScore()}`
        : 'Score: ?'

    const dealerScoreText = this.add.text(480, 100, dealerScore, {
      fontSize: '30px',
      color: '#ffffff'
    })

    this.#scoreTexts.push(dealerScoreText)

    for (let i = 0; i < this.table!.players.length; i++) {
      const player = this.table!.players[i]
      const playerScore =
        player.hand.length > 0 ? `Score: ${player.getHandScore()}` : 'Score: ?'
      const playerScoreText = this.add.text(80 + i * 380, 380, playerScore, {
        fontSize: '30px',
        color: '#ffffff'
      })

      this.#scoreTexts.push(playerScoreText)
    }
  }

  /**
   * 初期の手札を配る関数
   *
   * @returns {void}
   */
  dealInitialHands(): void {
    const dealerHands = this.table!.dealer.hand
    for (let i = 0; i < dealerHands.length; i++) {
      const card = dealerHands[i]

      // move card from the top center to the dealer's hand with sound
      const cardImage = this.add.image(400, 0, 'back')
      this.tweens.add({
        targets: cardImage,
        x: 480 + i * 25,
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
          x: 100 + i * 380 + j * 25,
          y: 460,
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

  /**
   * カードを引く関数
   *
   * @param {Player} player - プレイヤー
   * @returns {void}
   */
  drawCard(player: Player): void {
    const card = player.hand[player.hand.length - 1]
    const cardImage = this.add.image(400, -10, 'back')
    const playerIndex = this.table!.players.indexOf(player)

    let posX: number = 0
    let posY: number = 0
    if (player.type === 'dealer') {
      posX = 480 + (player.hand.length - 1) * 25
      posY = 180
    } else {
      posX = 100 + playerIndex * 380 + (player.hand.length - 1) * 25
      posY = 460
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

  /**
   * ディーラーのカードを裏返す関数
   *
   * @returns {void}
   */
  flipDealerCard(): void {
    // ディーラーの裏面になってるカード
    const card = this.dealer!.hand[1]
    const cardImage = this.#dealerHandImages[1]

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

  /**
   * ラウンドの結果を表示する関数
   *
   * @returns {void}
   */
  roundResults(): void {
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
      (this.user!.getHandScore() as number) > 21 ||
      (this.dealer!.getHandScore() > this.user!.getHandScore() &&
        (this.dealer!.getHandScore() as number) <= 21) ||
      this.user!.gameStatus === 'surrender'
    ) {
      this.sound.play('lose-se')
    } else if (
      this.user!.getHandScore() > this.dealer!.getHandScore() ||
      (this.dealer!.getHandScore() as number) > 21
    ) {
      this.sound.play('win-se')
    }
    const resultsLog = this.table!.evaluateAndGetRoundResults()
    this.add.text(400, 300, resultsLog, {
      fontSize: '30px',
      color: '#ffffff'
    })

    this.#nextButton = this.nextButton()
    this.#nextButton.addListener('pointerover', () => {
      // destroy this button
      this.#nextButton?.destroy()
    })
  }

  /**
   * 次のラウンドに進むボタンを作成する関数
   *
   * @returns {Button} - 次のラウンドに進むボタン
   */
  nextButton(): Button {
    return new Button(
      this,
      500,
      500,
      'Next',
      'orange-button',
      'select-se',
      () => {
        this.table!.resetRoundInfo()
        this.create({ table: this.table, difficulty: this.difficulty })
      }
    )
  }

  /**
   * 最終結果を表示する関数
   *
   * @returns {void}
   */
  finalResults(): void {
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

    this.add.image(540, 360, 'board')

    const resultsLog = this.table!.evaluateAndGetFinalResults()
    this.add
      .text(540, 300, resultsLog, {
        fontSize: '24px',
        color: 'black'
      })
      .setOrigin(0.5)

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

  /**
   * ゲームオーバー画面を表示する関数
   *
   * @returns {void}
   */
  gameOver(): void {
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

    this.sound.play('lose-se')

    this.add.image(540, 360, 'board')

    const resultsLog = 'You ran out of chips...'
    this.add.text(540, 300, resultsLog, {
      fontSize: '24px',
      color: 'black'
    })

    this.againButton()
    this.backButton()
  }

  /**
   * もう一度プレイするボタンを作成する関数
   *
   * @returns {Button} - もう一度プレイするボタン
   */
  againButton(): Button {
    return new Button(
      this,
      540,
      400,
      'もう一度遊ぶ',
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
  }

  backButton() {
    return new Button(
      this,
      540,
      550,
      '他のゲームで遊ぶ',
      'orange-button',
      'select-se',
      () => {
        const root = document.getElementById('app')
        root!.innerHTML = ''
        Controller.renderModeSelectPage(
          ['blackjack', 'war', 'poker', 'speed'],
          this.user!.name
        )
      }
    )
  }

  arrowBackButton(): Button {
    return new Button(this, 55, 55, '', 'back-button', 'select-se', () => {
      const root = document.getElementById('app')
      root!.innerHTML = ''
      Controller.renderModeSelectPage(
        ['blackjack', 'war', 'poker', 'speed'],
        this.user!.name
      )
    })
  }
}
