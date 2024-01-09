import Image = Phaser.GameObjects.Image;
import Sound = Phaser.Sound.BaseSound
import Text = Phaser.GameObjects.Text;

export class WideButton extends Phaser.GameObjects.Container {
    private image: Image;
    private text: Text;
    private sound : Sound;


    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        key: string,
        soundKey: string,
        callback: () => void
    ) {
        super(scene, x, y);
        this.text = new Text(scene, 0, 0, text, {
            color: "#ffffff",
            fontSize: "10px",
            fontFamily: "pixel",
        });

        this.image = new Image(scene, 0, 0, key);
        this.image.setInteractive();
        this.sound = scene.sound.add(soundKey)

        this.image.on("pointerdown", () => {
            this.image.y += 4;
            this.text.y += 4;
            callback();
        });

        this.image.on("pointerup", () => {
            this.sound.play()
            this.image.y -= 4;
            this.text.y -= 4;
            callback();
        });

        this.image.on("pointerover", () => {
            this.image.setTint(0xcccccc);
            const hoverSound = scene.sound.add('hover-se')
            hoverSound.play()
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
