/**
 * Created with JetBrains WebStorm.
 * User: hmmvot
 * Date: 05.04.13
 * Time: 21:01
 * To change this template use File | Settings | File Templates.
 */

const zOrder = {
    fadeLayer:  2,
    hero:       1,
    background: 0
};

var Game;
Game = cc.Layer.extend({
    fadeLayer:null,
    background:null,
    hero:null,

    init:function() {
        this._super();

        this.setMouseEnabled(true);

        var fadeLayer = cc.LayerColor.create(kItemColor);
        fadeLayer.setOpacity(0);
        this.addChild(fadeLayer, zOrder.fadeLayer);
        this.fadeLayer = fadeLayer;

        var background = cc.LayerColor.create(kBackgroundColor);
        this.addChild(background, zOrder.background);
        this.background = background;

        var hero = GameObject.create();
        hero.setColor(kItemColor);
        hero.setPosition(kScreenCenter);
        this.addChild(hero, zOrder.hero);
        this.hero = hero;

        return true;
    },

    invert:function() {
        const t = 0.5;

        var hero = this.hero;
        var background = this.background;

        this.fadeLayer.setColor(kItemColor);
        this.fadeLayer.runAction(
            cc.Sequence.create(
                cc.FadeTo.create(t, 255),
                cc.CallFunc.create(function() {
                    invertColors();

                    background.setColor(kBackgroundColor);
                    hero.setColor(kItemColor);
                }),
                cc.DelayTime.create(0.25),
                cc.FadeTo.create(t, 0)
            )
        );
    },

    onKeyDown:function(evt) {

    },

    onMouseDown:function(mouse) {
//        var location = mouse.getLocation();
        this.invert();
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