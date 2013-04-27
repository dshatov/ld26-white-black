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

const Direction = {
    left:   cc.KEY.left,
    right:  cc.KEY.right,
    bottom: cc.KEY.up,
    top:    cc.KEY.down
};

var Game;
Game = cc.Layer.extend({
    fadeLayer:null,
    background:null,
    hero:null,
    heroDirection:null,

    init:function() {
        this._super();

        this.setMouseEnabled(true);
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();

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

        this.fadeLayer.setColor(kItemColor);
        this.fadeLayer.runAction(
            cc.Sequence.create(
                cc.FadeTo.create(t, 255),
                cc.CallFunc.create(function() {
                    invertColors();

                    this.background.setColor(kBackgroundColor);
                    this.hero.setColor(kItemColor);
                }, this),
                cc.DelayTime.create(t/2),
                cc.FadeTo.create(t, 0)
            )
        );
    },

    onKeyDown:function(evt) {
        switch (evt)
        {
            case cc.KEY.left:
            case cc.KEY.right:
            case cc.KEY.up:
            case cc.KEY.down: {
                this.heroDirection = evt;
            } break;

            default:
                break;
        }
    },

    onKeyUp:function(evt) {
        switch (evt)
        {
            case cc.KEY.left:
            case cc.KEY.right:
            case cc.KEY.up:
            case cc.KEY.down: {
                this.heroDirection = null;
            } break;

            default:
                break;
        }
    },

    onMouseDown:function(mouse) {
//        var location = mouse.getLocation();
        this.invert();
    },

    reset:function() {

    },

    update:function(dt) {
        const heroSpeed = 320.0;

        var d = heroSpeed*dt;
        var dp = null;
        switch (this.heroDirection)
        {
            case Direction.left: {
                dp = cc.p(-d, 0);
            } break;

            case Direction.right: {
                dp = cc.p(d, 0);
            } break;

            case Direction.bottom: {
                dp = cc.p(0, d);
            } break;

            case Direction.top: {
                dp = cc.p(0, -d);
            } break;

            default:
                break;
        }

        if (dp != null) {
            this.hero.setPosition(cc.pAdd(this.hero.getPosition(), dp));
        }
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