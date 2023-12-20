import { PreloadScene } from '../games/common/preloadScene'
import { WarView } from '../games/warScene'
import WarTable from '../model/war/warTable'

export class WarController {
  static startGame(table: WarTable) {
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
    game.scene.add('war', WarView, false)

    game.scene.start('preload', { table: table })
  }
}
