import { BlackjackView } from '../games/blackjackScene'
import { PreloadScene } from '../games/common/preloadScene'
import BlackjackTable from '../model/blackjack/blackjackTable'

export class BlackjackController {
  /*
  startGame(table: BlackjackTable): void
  ゲームのシーンを開始する
  */
  static startGame(table: BlackjackTable) {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'app',
      width: 1080,
      height: 720,
      scene: [],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    })
    game.scene.add('preload', PreloadScene, false)
    game.scene.add('blackjack', BlackjackView, false)

    game.scene.start('preload', { table: table })
  }
}
