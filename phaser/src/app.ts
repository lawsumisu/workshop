import * as Phaser from "phaser";
import logoImg from "src/assets/logo.png";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

new Phaser.Game(config);

function preload(this: Phaser.Scene) {
  this.load.image("logo", logoImg);
}

function create(this: Phaser.Scene) {
  const logo = this.add.image(400, 150, "logo");

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}