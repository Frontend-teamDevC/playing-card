import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;

export class pokerButton extends Phaser.GameObjects.Container {
    private image: Image;
    private text: Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        key: string,
        callback: () => void
    ) {
        super(scene, x, y);
        this.text = new Text(scene, 0, 0, text, {
            style: {
                color: "#ffffff",
                fontSize: "10px",
                fontFamily: "pixel",
            },
        });

        this.image = new Image(scene, 0, 0, key);
        this.image.setInteractive();

        this.image.on("pointerdown", () => {
            this.image.y += 4;
            this.text.y += 4;
            callback();
        });

        this.image.on("pointerup", () => {
            this.image.y -= 4;
            this.text.y -= 4;
            callback();
        });

        this.image.on("pointerover", () => {
            this.image.setTint(0xcccccc);
        });

        this.image.on("pointerout", () => {
            this.image.clearTint();
        });

        // adjust image size
        const { width, height } = this.text;
        this.image.displayWidth = width + 68;
        this.image.displayHeight = height + 18;

        // adjust text position
        this.text.x = -width / 2;
        this.text.y = -height / 2;

        this.add(this.image);
        this.add(this.text);

        scene.add.existing(this);
    }
}
