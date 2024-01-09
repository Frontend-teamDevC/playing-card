import { SpeedScene } from '../games/speedScene'
import { PreloadScene } from '../games/common/preloadScene'
import SpeedTable from '../model/speed/speedTable'

export class SpeedController {
  /*
  startGame(table: BlackjackTable): void
  ゲームのシーンを開始する
  */
  static startGame(table: SpeedTable) {
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
    game.scene.add('speed', SpeedScene, false)

    game.scene.start('preload', { table: table })
  }
}
