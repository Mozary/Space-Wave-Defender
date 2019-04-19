import 'phaser';
import SceneMain from './SceneMain';

let game;
window.onload = () => {
  let config = {
      type: Phaser.AUTO,
      parent: 'phaser-game',
      width: 640, //Resolusi
      height: 480, //Resolusi
      physics: {
    		default: 'arcade',
    		arcade: {
    			//gravity: {y: 300},
    			debug: false
    		}
      },
      scene: [SceneMain]
  };
  game = new Phaser.Game(config);
}
