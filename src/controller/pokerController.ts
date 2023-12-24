import { Config } from "../config/pageConfig";
import pokerTable from "../model/poker/pokerTable";
import { PokerView } from "../view/PokerView";
import { PreloadScene } from '../games/common/preloadScene'

export class PokerController {
    static startGame(table: pokerTable) {
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
    }ß
}