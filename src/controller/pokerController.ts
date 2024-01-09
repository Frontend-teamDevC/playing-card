import PokerTable from "../model/poker/pokerTable";
import { PokerView } from "../games/pokerScene";
import { PreloadScene } from "../games/common/preloadScene.js";

export class PokerController {
    static startGame(table: PokerTable) {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            parent: 'app',
            width: 1080,
            height: 720,
            scene: [],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        });

        game.scene.add("preload", PreloadScene, false);
        game.scene.add("poker", PokerView, false);

        game.scene.start("preload", { table: table });
    }
}
