import { PreloadScene } from "../games/common/preloadScene";
import { PokerView } from "../games/pokerScene";
import PokerTable from "../model/poker/pokerTable";

export class PokerController {
    static startGame(table: PokerTable) {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
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
