import Phaser from 'phaser'
import pokerTable from '../model/poker/pokerTable'
import { BaseScene } from './common/baseScene'
import { WideButton } from './common/wideButton'
import Text = Phaser.GameObjects.Text
import Sprite = Phaser.GameObjects.Sprite
export class PokerView extends BaseScene {
  private width: number = 0
  private height: number = 0
  private table: pokerTable | null = null
  //   private user: PokerPlayer | null = null

  // playerInfo
  private potInfo: Text | null = null
  private turnData: Text | null = null
  private currBetInfo: Text | null = null

  // destroyするためのlist
  private actionButtons: WideButton[] = []
  private playerhandsImages: Sprite[][] = []
  private playerNameInfo: Text[] = []
  private playerChipsInfo: Text[] = []
  private playerHandInfo: Text[] = []
  private playerBetInfo: Text[] = []
  private dealerHandInfo: Sprite[] = []
  private dealerCoinInfo: Sprite[] = []

  /**
   * pokerSceneを初期化する関数
   *
   * @param {any} data - pokerTableインスタンスを含むデータ
   * @returns {void}
   */
  create(data: any): void {
    // reset all the scene
    this.table = data.table
    // this.user = this.table!.players[0]
    this.actionButtons = []
    this.playerhandsImages = []
    this.playerNameInfo = []
    this.playerChipsInfo = []
    this.playerHandInfo = []
    this.playerBetInfo = []
    this.playerHandInfo = []
    this.dealerCoinInfo = []
    const { width, height } = this.cameras.main
    this.width = width
    this.height = height
    super.create(data)
    this.renderScene()
  }

  /**
   * Pokerテーブルのデータを取得する関数
   *
   * @returns {string[][]} - テーブルのデータ
   */
  getResultTableData(): string[][] {
    let tableData: string[][] = [[]]
    for (let i = 0; i < this.table?.maxTurn! + 1; i++) {
      if (i == 0) {
        tableData[0].push('Name')
      } else {
        tableData[0].push(`Round${i}`)
      }
    }

    for (let i = 0; i < this.table?.players.length!; i++) {
      let currPlayer = this.table!.players[i]
      tableData.push([currPlayer.name])
    }

    for (let i = 0; i < this.table?.resultsLog.length!; i++) {
      let currResult = this.table?.resultsLog[i]
      let round_i = currResult?.split(',')
      for (let i = 0; i < round_i?.length!; i++) {
        tableData[i + 1].push(round_i![i])
      }
    }
    return tableData
  }

  /**
   * ゲームの結果を表示する関数
   *
   * @returns {void}
   */
  renderResultLog(): void {
    this.destroyAllInfo()
    const tableData: string[][] = this.getResultTableData()

    // セルの幅と高さ
    const cellWidth = 100
    const cellHeight = 40

    // テーブルの幅と高さ
    const tableWidth = tableData[0].length * cellWidth
    const tableHeight = tableData.length * cellHeight

    // テーブルの位置
    const tableX = this.width / 2 - tableWidth / 2
    const tableY = this.height / 2 - tableHeight / 2

    // テーブル作成
    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].length; j++) {
        const cellX = tableX + j * cellWidth
        const cellY = tableY + i * cellHeight

        // セルを作成
        const cellText = this.add.text(
          cellX + cellWidth / 2,
          cellY + cellHeight / 2,
          tableData[i][j],
          {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
          }
        )
        cellText.setOrigin(0.5, 0.5)

        // セルの背景を追加（デザインの一部として）
        const cellBackground = this.add.rectangle(
          cellX + cellWidth / 2,
          cellY + cellHeight / 2,
          cellWidth,
          cellHeight
        )
        cellBackground.setStrokeStyle(2, 0xffffff)
      }
    }

    // this.againButton()
    // this.backButton()
  }

  /**
   * 画面の情報を全て削除する関数
   *
   * @returns {void}
   */
  destroyAllInfo(): void {
    this.playerNameInfo.forEach((name) => name.destroy())
    this.playerChipsInfo.forEach((chip) => chip.destroy())
    this.playerHandInfo.forEach((hand) => hand.destroy())
    this.actionButtons.forEach((button) => button.destroy())
    this.playerBetInfo.forEach((bet) => bet.destroy())
    this.dealerHandInfo.forEach((hand) => hand.destroy())
    this.dealerCoinInfo.forEach((coin) => coin.destroy())
    this.potInfo?.destroy()
    this.currBetInfo?.destroy()
    this.turnData?.destroy()
  }

  /**
   * PokerSceneを描画する関数
   *
   * @returns {void}
   */
  renderScene(): void {
    // this.arrowBackButton()

    console.log(
      'ROUNDCOUNTER',
      this.table!.roundCounter,
      'MAXTURN',
      this.table!.maxTurn
    )
    if (this.table!.roundCounter == this.table!.maxTurn) {
      this.renderResultLog()
    } else {
      this.playerInfo()
      this.tableInfo()

      setTimeout(() => {
        this.putDealerCoin()
      }, 300)

      const turnPlayer = this.table!.getTurnPlayer()
      const beforePlayer = this.table?.getoneBeforePlayer()
      console.log('THIS.TABLE.PHASE', this.table?.gamePhase)
      console.log('現在のdelarIndx', this.table?.dealerIndex)

      if (
        this.table?.gamePhase == 'betting' &&
        this.playerhandsImages[0] === undefined
      ) {
        this.dealInitialHands()
      }

      if (this.table?.gamePhase == 'evaluating') {
        setTimeout(() => {
          this.filpCard()
          setTimeout(() => {
            this.clearAllHand()
            this.clearDealerCard()
            this.clearDealrCoin()
            setTimeout(() => {
              this.table?.haveTurn()
              this.renderScene()
            }, 1000)
          }, 2000)
        }, 1000)
        return
      }
      if (this.table?.gamePhase == 'dealer turn') {
        console.log('ディーラーきた', turnPlayer.name, this.table.dealer.hand)
        setTimeout(() => {
          this.setDealerCard()
          setTimeout(() => {
            this.playerHandText()
            this.table?.haveTurn()
            this.renderScene()
          }, 2000)
        }, 1000)
        return
      }

      // テーブル全員がallin or foldの場合
      if (this.table?.allplayerAllInOrFold()) {
        console.log('PLPAYER全員が何もできない状況です。')
        this.table?.haveTurn()
        this.renderScene()
      }

      switch (turnPlayer.type) {
        case 'player':
          console.log(
            'PLAYER',
            turnPlayer.name,
            'STATUS',
            turnPlayer.gameStatus,
            this.table?.turnCounter,
            this.table?.dealerIndex
          )
          if (this.table!.allPlayerActionResolved()) {
            setTimeout(() => {
              this.table?.haveTurn()
              this.renderScene()
            }, 500)
            break
          }
          if (this.table?.gamePhase != 'blinding') {
            if (
              turnPlayer.gameStatus == 'fold' ||
              turnPlayer.gameStatus == 'allin' ||
              turnPlayer.chips == 0
            ) {
              // 何もボタンは表示しない.
              console.log('player は allIn or Fold')
              setTimeout(() => {
                this.table?.haveTurn()
                this.renderScene()
              }, 500)
              break
            }
            if (
              beforePlayer?.gameStatus == 'check' ||
              this.table?.playerIndexCounter == this.table?.dealerIndex! + 1
            ) {
              if (turnPlayer.chips <= this.table?.betMoney!) {
                this.createCheckButton(600)
                this.createAllInButton(640)
                this.createFoldButton(690)
              } else {
                // チェックも選択肢にあり
                this.createCheckButton(570)
                this.createCallButton(610)
                this.createRaiseButton(650)
                this.createFoldButton(690)
              }
            } else {
              if (turnPlayer.chips <= this.table?.betMoney!) {
                this.createAllInButton(630)
                this.createFoldButton(670)
              } else if (turnPlayer.chips * 2 <= this.table?.betMoney!) {
                this.createAllInButton(630)
                this.createFoldButton(670)
              } else {
                if (
                  turnPlayer.gameStatus == 'bet' &&
                  this.table?.playerIndexCounter ==
                    (this.table?.dealerIndex! + 2) %
                      this.table?.players.length! &&
                  this.table.turnCounter == 0
                ) {
                  this.createPassButton(610)
                  this.createRaiseButton(650)
                  this.createFoldButton(690)
                } else {
                  this.createCallButton(600)
                  this.createRaiseButton(640)
                  this.createFoldButton(690)
                }
              }
            }
          } else {
            if (this.table!.allPlayerActionResolved()) {
              setTimeout(() => {
                this.table?.haveTurn()
                this.renderScene()
              }, 500)
              break
            } else {
              setTimeout(() => {
                this.table?.haveTurn()
                this.renderScene()
              }, 1000)
            }
          }
          break
        default:
          setTimeout(() => {
            this.table?.haveTurn()
            this.renderScene()
          }, 1000)
          break
      }
    }
  }

  /**
   * ディーラーのコインを表示する関数
   * @returns {void}
   */
  putDealerCoin(): void {
    if (this.table?.dealerIndex == 0) {
      const dealerCoin = this.add.sprite(
        this.setXPosition(0) + 30,
        this.height - 50,
        'orange-button'
      )
      dealerCoin.setOrigin(0.5, 0.5)
      this.dealerCoinInfo.push(dealerCoin)
    } else if (this.table?.dealerIndex == 1) {
      const dealerCoin = this.add.sprite(
        this.setXPosition(1) + 120,
        this.height / 2 - 120,
        'orange-button'
      )
      dealerCoin.setOrigin(0.5, 0.5)
      this.dealerCoinInfo.push(dealerCoin)
    } else if (this.table?.dealerIndex == 2) {
      const dealerCoin = this.add.sprite(
        this.setXPosition(2) + 30,
        130,
        'orange-button'
      )
      dealerCoin.setOrigin(0.5, 0.5)
      this.dealerCoinInfo.push(dealerCoin)
    } else {
      const dealerCoin = this.add.sprite(
        this.setXPosition(3) - 45,
        this.height / 2 + 120,
        'orange-button'
      )

      dealerCoin.setOrigin(0.5, 0.5)
      this.dealerCoinInfo.push(dealerCoin)
    }
  }

  /**
   * 全てのプレイヤーの行動が終了したかどうかを返す関数
   *
   * @returns {boolean} - 全てのプレイヤーの行動が終了したかどうか
   */
  allPlayerActionResolved(): boolean {
    for (let player of this.table?.players!) {
      if (!this.table?.playerActionResolved(player)) return false
    }
    return true
  }

  /**
   * ディーラーのカードを全て削除する関数
   * @returns {void}
   */
  clearDealerCard(): void {
    this.dealerHandInfo.forEach((hand) => hand.destroy())
  }

  /**
   * ディーラーのコインを全て削除する関数
   * @returns {void}
   */
  clearDealrCoin() {
    this.dealerCoinInfo.forEach((hand) => hand.destroy())
  }

  /**
   * ディーラーのカードを表示する関数
   *
   * @returns {void}
   */
  setDealerCard(): void {
    if (this.table?.turnCounter == 1) {
      for (let i = 0; i < this.table?.dealer.hand.length!; i++) {
        const delaerCard = this.table?.dealer.hand[i]
        const dealerHand = this.add.sprite(
          this.width,
          0,
          `${delaerCard?.rank}${delaerCard?.suit}`
        )

        dealerHand.setScale(1.5)
        this.add.tween({
          targets: dealerHand,
          x: 320 + i * 100,
          y: this.height / 2,
          duration: 1000
        })
        this.dealerHandInfo.push(dealerHand)
      }
    } else {
      let i = this.table?.dealer.hand.length! - 1
      const delaerCard = this.table?.dealer.hand[i]
      const dealerHand = this.add.sprite(
        this.width,
        0,
        `${delaerCard?.rank}${delaerCard?.suit}`
      )

      dealerHand.setScale(1.5)
      this.add.tween({
        targets: dealerHand,
        x: 320 + i * 100,
        y: this.height / 2,
        duration: 1000
      })
      this.dealerHandInfo.push(dealerHand)
    }
  }

  /**
   * プレイヤーの初期カードを表示する関数
   *
   * @returns {void}
   */
  dealInitialHands(): void {
    for (let i = 0; i < 2; i++) {
      let targetX: number = 0
      let targetY: number = 0
      for (let j = 0; j < this.table?.players.length!; j++) {
        const player = this.table!.players[j]
        const playerHand = player.hand
        const card = playerHand[i]
        if (j == 0) {
          targetX = i == 0 ? this.width / 2 - 50 : this.width / 2 + 50
          targetY = this.height - 80
        } else if (j == 1) {
          targetX = 80
          targetY = i == 0 ? this.height / 2 - 40 : this.height / 2 + 40
        } else if (j == 2) {
          targetY = 80
          targetX = i == 0 ? this.width / 2 - 30 : this.width / 2 + 50
        } else {
          targetX = this.width - 80
          targetY = i == 0 ? this.height / 2 - 40 : this.height / 2 + 40
        }

        const cardDeck = this.add.sprite(
          this.width / 2,
          this.height / 2,
          'back'
        )

        cardDeck.setOrigin(0.5, 0.5)
        if (j == 1 || j == 3) cardDeck.setRotation(1.5708)
        j == 0 ? cardDeck.setScale(1.5) : cardDeck.setScale(1.1)
        // カードを移動させてくる
        this.add.tween({
          targets: cardDeck,
          x: targetX,
          y: targetY,
          duration: 1000
        })

        if (j == 0) {
          cardDeck.setScale(1.5)
          cardDeck.setOrigin(0.5, 0.5)
          setTimeout(() => {
            this.add.tween({
              targets: cardDeck,
              scaleY: 0,
              duration: 500,
              ease: 'Linear',
              onComplete: () => {
                cardDeck.setTexture(`${card.rank}${card.suit}`)
                this.add.tween({
                  targets: cardDeck,
                  scaleY: 1.5,
                  duration: 500,
                  ease: 'Linear'
                })
              }
            })
          }, 1000)
        }
        if (this.playerhandsImages[j] == undefined) {
          this.playerhandsImages.push([cardDeck])
        } else {
          this.playerhandsImages[j].push(cardDeck)
        }
      }
    }
  }

  /**
   * プレイヤーのカードをめくる関数
   *
   * @returns {Promise<void>}
   */
  async filpCard(): Promise<void> {
    for (let i = 1; i < this.table?.players.length!; i++) {
      let currHand = this.table?.players[i].hand
      let currImages = this.playerhandsImages[i]
      for (let j = 0; j < 2; j++) {
        let currImage = currImages[j]
        this.add.tween({
          targets: currImages[j],
          scaleY: 0,
          duration: 500,
          ease: 'linear',
          onComplete: () => {
            currImage.setTexture(`${currHand![j].rank}${currHand![j].suit}`)
            this.add.tween({
              targets: currImage,
              scaleY: 1,
              duration: 500,
              ease: 'linear'
            })
          }
        })
      }
    }
  }

  /**
   * プレイヤーのカードを全て削除する関数
   *
   * @returns {Promise<void>}
   */
  async clearAllHand(): Promise<void> {
    this.playerhandsImages.forEach((player) =>
      player.forEach((hand) => hand.destroy())
    )
    this.playerHandInfo.forEach((hand) => hand.destroy())
    this.playerhandsImages = []
    this.playerHandInfo = []
  }

  /**
   * x座標を計算して返す関数
   *
   * @returns {void}
   */
  setXPosition(i: number): number {
    return i == 0
      ? this.width / 2 - 250
      : i == 1
        ? 50
        : i == 2
          ? this.width / 2 + 100
          : this.width - 120
  }

  /**
   * テーブルの情報を表示する関数
   *
   * @returns {void}
   */
  turnInfo(): void {
    this.turnData?.destroy()
    const turnInfo = this.add.text(
      990,
      55,
      'Round: ' + String(this.table?.roundCounter!),
      {
        fontSize: '15px',
        color: '#ffffff',
        fontFamily: 'pixel'
      }
    )
    this.turnData = turnInfo
  }

  /**
   * ポットの情報を表示するポット
   *
   * @returns {void}
   */
  PotInfo(): void {
    this.potInfo?.destroy()
    const potInfo = this.add.text(
      990,
      30,
      'Pot : ' + String(this.table?.pot!),
      {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'pixel'
      }
    )
    this.potInfo = potInfo
  }

  /**
   * かけ金の情報を表示する関数
   *
   * @returns {void}
   */
  BetInfo(): void {
    this.currBetInfo?.destroy()
    const betInfo = this.add.text(
      990,
      70,
      'Bet: ' + String(this.table?.betMoney),
      {
        fontSize: '15px',
        color: '#ffffff',
        fontFamily: 'pixel'
      }
    )
    this.currBetInfo = betInfo
  }

  /**
   * プレイヤーの情報を表示する関数
   *
   * @returns {void}
   */
  playerInfo(): void {
    this.playerNameText()
    this.playerChipText()
    // if (this.table?.gamePhase != "blinding") {
    setTimeout(() => {
      this.playerHandText()
    }, 2000)
    // } else this.playerHandText();
  }

  /**
   * テーブルの情報を表示する関数
   *
   * @returns {void}
   */
  tableInfo(): void {
    this.turnInfo()
    this.PotInfo()
    this.BetInfo()
  }

  /**
   * プレイヤーの名前を表示する関数
   *
   * @returns {void}
   */
  playerNameText(): void {
    this.playerNameInfo.forEach((name) => name.destroy())
    for (let i = 0; i < this.table?.players.length!; i++) {
      const currPlayer = this.table?.players![i]
      const playerInfo = this.add.text(
        // x
        this.setXPosition(i),
        // y
        i == 0
          ? this.height - 150
          : i == 1
            ? this.height / 2 - 160
            : i == 2
              ? 40
              : this.height / 2 + 100,
        'Name: ' + currPlayer?.name!,
        {
          fontSize: '15px',
          color: '#ffffff',
          fontFamily: 'pixel'
        }
      )
      if (
        this.table?.playerIndexCounter == i &&
        (currPlayer?.gameStatus == 'bet' || currPlayer?.gameStatus == 'blind')
      ) {
        playerInfo.setFont('bold 17px pixel')
        playerInfo.setColor('#ffd700')
      }
      this.playerNameInfo.push(playerInfo)
    }
  }

  /**
   * プレイヤーの手札の情報を表示する関数
   *
   * @returns {void}
   */
  playerHandText(): void {
    this.playerHandInfo.forEach((hand) => hand.destroy())
    if (this.table?.gamePhase == 'evaluating') {
      for (let i = 0; i < this.table?.players.length; i++) {
        const currPlayer = this.table?.players[i]
        const playerInfo = this.add.text(
          this.setXPosition(i),
          i == 0
            ? this.height - 110
            : i == 1
              ? this.height / 2 - 110
              : i == 2
                ? 80
                : this.height / 2 + 150,
          currPlayer.gameStatus == 'fold'
            ? 'fold'
            : 'Hand: ' + currPlayer?.getHandScore(this.table.dealer),
          {
            fontSize: '15px',
            color: '#ffffff',
            fontFamily: 'pixel'
          }
        )
        this.playerHandInfo.push(playerInfo)
      }
    }
    if (
      this.table?.gamePhase == 'betting' ||
      this.table?.gamePhase == 'dealer turn'
    ) {
      const currPlayer = this.table?.players[0]
      const playerInfo = this.add.text(
        this.setXPosition(0),
        this.height - 110,
        currPlayer.gameStatus == 'fold'
          ? 'fold'
          : 'Hand: ' + currPlayer?.playerHandStatus,
        {
          fontSize: '15px',
          color: '#ffffff',
          fontFamily: 'pixel'
        }
      )
      this.playerHandInfo.push(playerInfo)
    }
  }

  /**
   * プレイヤーのかけ金の情報を表示する関数
   *
   * @returns {void}
   */
  playerBetText(): void {
    this.playerBetInfo.forEach((bet) => bet.destroy())
  }

  /**
   * プレイヤーの残りチップの情報を表示する関数
   *
   * @returns {void}
   */
  playerChipText(): void {
    this.playerChipsInfo.forEach((chip) => chip.destroy())

    for (let i = 0; i < this.table?.players.length!; i++) {
      const currPlayer = this.table?.players![i]
      const playerInfo = this.add.text(
        // x
        this.setXPosition(i),
        // y
        i == 0
          ? this.height - 130
          : i == 1
            ? this.height / 2 - 130
            : i == 2
              ? 60
              : this.height / 2 + 120,
        'CHIP: ' + String(currPlayer?.chips!),
        {
          fontSize: '15px',
          color: '#ffffff',
          fontFamily: 'pixel'
        }
      )
      if (
        this.table?.playerIndexCounter == i &&
        (currPlayer?.gameStatus == 'bet' || currPlayer?.gameStatus == 'blind')
      ) {
        playerInfo.setFont('bold 17px pixel')
        playerInfo.setColor('#ffd700')
      }
      console.log(currPlayer?.chips)
      this.playerChipsInfo.push(playerInfo)
    }
  }

  playerGetCard(): void {
    // 初期プレイヤーカードをもらうアニメーションを追加。
    if (
      this.table?.gamePhase == 'blinding' &&
      this.table.playerIndexCounter == this.table.dealerIndex + 1
    ) {
      for (let player of this.table.players) {
        console.log(player)
      }
    }
  }

  /**
   * パスボタンを作成する関数
   *
   * @param {number} y - ボタンのy座標
   *　@returns {void}
   */
  createPassButton(y: number): void {
    const callButton = new WideButton(
      this,
      750,
      y,
      'pass',
      'gray-button',
      'select-se',
      () => {
        console.log('pass')
        this.table?.haveTurn('call')
        this.renderScene()
        this.actionButtons.forEach((button) => button.destroy())
        this.playerInfo()
      }
    )
    this.actionButtons.push(callButton)
  }

  /**
   * コールボタンを作成する関数
   *
   * @param {number} y - ボタンのy座標
   *　@returns {void}
   */
  createCallButton(y: number): void {
    const callButton = new WideButton(
      this,
      750,
      y,
      'call',
      'gray-button',
      'select-se',
      () => {
        console.log('calll')
        this.table?.haveTurn('call')
        this.renderScene()
        this.actionButtons.forEach((button) => button.destroy())
        this.playerInfo()
      }
    )
    this.actionButtons.push(callButton)
  }

  /**
   * オールインボタンを作成する関数
   *
   * @param {number} y - ボタンのy座標
   *　@returns {void}
   */
  createAllInButton(y: number): void {
    const allInButton = new WideButton(
      this,
      750,
      y,
      'allIn',
      'gray-button',
      'select-se',
      () => {
        console.log('allIn')
        this.table?.haveTurn('allin')
        this.renderScene()
        this.actionButtons.forEach((button) => button.destroy())
        this.playerInfo()
      }
    )
    this.actionButtons.push(allInButton)
  }

  /**
   * チェックボタンを作成する関数
   *
   * @param {number} y - ボタンのy座標
   *　@returns {void}
   */
  createCheckButton(y: number): void {
    const checkButton = new WideButton(
      this,
      750,
      y,
      'check',
      'gray-button',
      'select-se',
      () => {
        console.log('check')
        this.table?.haveTurn('check')
        this.renderScene()
        this.actionButtons.forEach((button) => button.destroy())
        this.playerInfo()
      }
    )
    this.actionButtons.push(checkButton)
  }

  /**
   * レイズボタンを作成する関数
   *
   * @param {number} y - ボタンのy座標
   *　@returns {void}
   */
  createFoldButton(y: number): void {
    const foldButton = new WideButton(
      this,
      750,
      y,
      'fold',
      'gray-button',
      'select-se',
      () => {
        console.log('fold')
        this.table?.haveTurn('fold')
        this.renderScene()
        this.actionButtons.forEach((button) => button.destroy())
        this.playerInfo()
      }
    )

    this.actionButtons.push(foldButton)
  }

  /**
   * レイズボタンを作成する関数
   *
   * @param {number} y - ボタンのy座標
   *　@returns {void}
   */
  createRaiseButton(y: number): void {
    const raiseButton = new WideButton(
      this,
      750,
      y,
      'raise',
      'gray-button',
      'select-se',
      () => {
        console.log('raise')
        this.table?.haveTurn('raise')
        this.renderScene()
        this.actionButtons.forEach((button) => button.destroy())
        this.playerInfo()
      }
    )
    this.actionButtons.push(raiseButton)
  }
  /**
   * もう一度遊ぶボタンを表示する関数
   * @returns {Button} - もう一度遊ぶボタン
   * */
  //   againButton(): Button {
  //     return new Button(
  //       this,
  //       750,
  //       550,
  //       'Again',
  //       'orange-button',
  //       'select-se',
  //       () => {
  //         const root = document.getElementById('app')
  //         root!.innerHTML = ''
  //         this.table = new pokerTable(this.user!.name, this.table!.maxTurn)

  //         PokerController.startGame(this.table!)
  //       }
  //     )
  //   }

  //   /**
  //    * モード選択画面に戻るボタンを表示する関数
  //    * @returns {Button} - モード選択画面に戻るボタン
  //    * */
  //   backButton(): Button {
  //     return new Button(
  //       this,
  //       550,
  //       550,
  //       'Back',
  //       'orange-button',
  //       'select-se',
  //       () => {
  //         const root = document.getElementById('app')
  //         root!.innerHTML = ''
  //         Controller.renderModeSelectPage(
  //           ['blackjack', 'war', 'poker', 'speed'],
  //           this.user!.name
  //         )
  //       }
  //     )
  //   }

  //   arrowBackButton(): Button {
  //     return new Button(this, 55, 55, '', 'back-button', 'select-se', () => {
  //       const root = document.getElementById('app')
  //       root!.innerHTML = ''
  //       Controller.renderModeSelectPage(
  //         ['blackjack', 'war', 'poker', 'speed'],
  //         this.user!.name
  //       )
  //     })
  //   }
}
