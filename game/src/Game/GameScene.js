/**
 * Created with JetBrains WebStorm.
 * User: hmmvot
 * Date: 05.04.13
 * Time: 21:01
 * To change this template use File | Settings | File Templates.
 */


var Game;
Game = cc.Layer.extend({
    background:null,
    hero:null,

    init:function() {
        this._super();

        this.background = cc.LayerColor.create(kBackgroundColor);
        this.addChild(this.background);

        return true;
    },

    onKeyDown:function(evt) {

    },

    onMouseDown:function(mouse) {
//        var location = mouse.getLocation();
    },

    reset:function() {

    },

    update:function(dt) {
    }
});

Game.create = function() {
    var layer = new this();
    layer.init();
    return layer;
};

var GameScene = cc.Scene.extend({});
GameScene.create = function() {
    var scene = new this();
    scene.init();

    var layer = Game.create();
    scene.addChild(layer);

    return scene;
};