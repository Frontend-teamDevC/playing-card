import Phaser from 'phaser'
import { CardConfig } from '../../config/cardConfig'

export class PreloadScene extends Phaser.Scene {
  #progressBox: Phaser.GameObjects.Graphics | null = null
  #progressBar: Phaser.GameObjects.Graphics | null = null
  #loadingText: Phaser.GameObjects.Text | null = null
  #percentText: Phaser.GameObjects.Text | null = null

  preload() {
    const { width, height } = this.cameras.main

    // ロードバーの背景
    this.#progressBox = this.add.graphics()
    this.#progressBox.fillStyle(0x222222, 0.8)
    this.#progressBox.fillRect(width / 2 - 150, height / 2 - 30, 300, 30)

    // ロードバーを作成
    this.#progressBar = this.add.graphics()

    // テキスト
    this.#loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: { font: 'monospace' }
    })
    this.#loadingText.setOrigin(0.5, 0.5)

    this.#percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 30,
      text: '0%',
      style: { font: 'monospace' }
    })
    this.#percentText.setOrigin(0.5, 0.5)

    // ロードイベント
    this.load.on('progress', (value: number) => {
      if (this.#percentText && this.#progressBar) {
        this.#percentText.setText(`${Math.floor(value * 100)}%`)
        this.#progressBar.clear()
        this.#progressBar.fillStyle(0xffffff, 1)
        this.#progressBar.fillRect(
          width / 2 - 150,
          height / 2 - 30,
          300 * value,
          30
        )
      }
    })

    this.load.on('complete', () => {
      if (
        this.#progressBox &&
        this.#progressBar &&
        this.#loadingText &&
        this.#percentText
      ) {
        this.#progressBar.destroy()
        this.#progressBox.destroy()
        this.#loadingText.destroy()
        this.#percentText.destroy()
      }
    })

    // アセットのロード
    // カード画像
    const suits = CardConfig.suits
    const ranks = CardConfig.ranks
    suits.forEach((suit: string) => {
      ranks.forEach((rank: string) => {
        this.load.image(`${rank}${suit}`, `assets/cards/${rank}${suit}.png`)
      })
    })

    this.load.image('back', 'assets/cards/backB.png')

    // ボタン画像
    this.load.image('coin', 'assets/coin.gif')
    this.load.image('orange-button', 'assets/ui/orange-button.png')
    this.load.image('blue-button', 'assets/ui/blue-button.png')
    this.load.image('gray-button', 'assets/ui/gray-button.png')

    // 背景画像
    this.load.image('background', 'assets/ui/background.jpeg')
    // BGM

    // SE
    this.load.audio('coin-se', 'assets/sounds/coin-se.ogg')

    this.load.audio('card-se', 'assets/sounds/card-se.mp3')
    this.load.audio('card-flip-se', 'assets/sounds/card-flip-se.mp3')

    this.load.audio('hover-se', 'assets/sounds/hover-se.wav')
    this.load.audio('select-se', 'assets/sounds/select-se.wav')

    this.load.audio('win-se', 'assets/sounds/win-se.mp3')
    this.load.audio('lose-se', 'assets/sounds/lose-se.mp3')
  }

  create(data: any) {
    this.#percentText = this.make.text({
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        fontFamily: 'pixel'
      }
    })
    this.#percentText.setOrigin(0.5, 0.5)

    this.#progressBox?.destroy()
    this.#progressBar?.destroy()
    this.#loadingText?.destroy()
    this.#percentText?.destroy()

    console.log(data.table)
    if (data.table.gameType === 'blackjack') {
      this.scene.start('blackjack', { table: data.table })
    } else if (data.table.gameType === 'war') {
      this.scene.start('war', { table: data.table })
    } else if (data.table.gameType === 'poker') {
      this.scene.start('poker', { table: data.table })
    }
  }
}
