/**
 * Created with JetBrains WebStorm.
 * User: hmmvot
 * Date: 05.04.13
 * Time: 21:01
 * To change this template use File | Settings | File Templates.
 */

const zOrder = {
    fadeLayer: 3,
    subtitlesLayer: 2,
    hero: 1,
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
    subtitlesLayer:null,

    init:function() {
        this._super();

        this.setMouseEnabled(true);
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();

        var fadeLayer = cc.LayerColor.create(kItemColor);
        fadeLayer.setOpacity(0);
        this.addChild(fadeLayer, zOrder.fadeLayer);
        this.fadeLayer = fadeLayer;

        var subtitlesLayer = SubtitlesLayer.create();
        this.addChild(subtitlesLayer, zOrder.subtitlesLayer);
        this.subtitlesLayer = subtitlesLayer;

        var background = cc.LayerColor.create(kBackgroundColor);
        this.addChild(background, zOrder.background);
        this.background = background;

        var hero = GameObject.create(GameObject.type_foursquare);
        hero.setColor(kItemColor);
        hero.setPosition(kScreenCenter);
        this.addChild(hero, zOrder.hero);
        this.hero = hero;

        var circle = GameObject.create(GameObject.type_circle);
        circle.setColor(kItemColor);
        circle.setPosition(kScreenWidth, kScreenHeight);
        this.addChild(circle);
        this.circle = circle;


        return true;
    },

    draw:function(ctx) {
//        var context = ctx != null ? ctx : cc.renderContext;
//        context.strokeStyle = "rgba(100,100,100,255)";
//
//        var screenSize = cc.size(4096, 4096);
//        for (var x = -kScreenWidth/2; x <= screenSize.width; x += 64.0) {
//            for (var y = -kScreenHeight/2; y <= screenSize.height; y += 64.0) {
//                cc.drawingUtil.drawPoint(cc.p(x, y));
//            }
//        }
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
                    for (var i = 0; i < this.getChildrenCount(); i++) {
                        var child = this.getChildren()[i];
                        if (child instanceof GameObject) {
                            child.setColor(kItemColor);
                        }
                    }
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
//        this.subtitlesLayer.showText("hello subtitles!", this.circle, 2.0);
    },

    reset:function() {

    },

    heroInterractWith:function(other) {
        other.isActive = false;
        if (other.type == GameObject.type_triangle) {
            other.runAction(
                cc.FadeTo.create(1.0, 0)
            );
        }
        else if (other.type == GameObject.type_circle) {
            other.runAction(
                cc.FadeTo.create(1.0, 0)
            );
        }
        else {
            cc.log("holy sh*t!");
        }
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

        for (var i = 0; i < this.getChildrenCount(); i++) {
            var child = this.getChildren()[i];
            if (child == this.hero) {
                continue;
            }

            const maxVisibilityDistance = 372.0;
            const fullVisibilityDistance = 256.0;
            if (child instanceof GameObject && child.isActive) {
                var distance = cc.pLength(cc.pSub(this.hero.getPosition(), child.getPosition()));
                if (distance - fullVisibilityDistance >= maxVisibilityDistance) {
                    child.setOpacity(0);
                }
                else if (distance > fullVisibilityDistance) {
                    var k = (distance - fullVisibilityDistance)/(maxVisibilityDistance);
                    k = k <= 1 ? k : 1;
                    child.setOpacity((1 - k)*255);
                }
                else {
                    child.setOpacity(255);
                    this.heroInterractWith(child);
                }
            }
        }

        var shift = 128.0;
        var cameraPosition = cc.pMult(this.getPosition(), -1);
        var center = kScreenCenter;
        var heroPos = cc.pSub(this.hero.getPosition(), cameraPosition);
        var dt = cc.p(0, 0);

        if (heroPos.x > center.x + shift) {
            dt.x = (center.x + shift) - heroPos.x;
        }
        else
        if (heroPos.x < center.x - shift) {
            dt.x = (center.x - shift) - heroPos.x;
        }

        if (heroPos.y > center.y + shift) {
            dt.y = (center.y + shift) - heroPos.y;
        }
        else
        if (heroPos.y < center.y - shift) {
            dt.y = (center.y - shift) - heroPos.y;
        }

//        var heroShiftFromCenter = cc.pSub(cc.pSub(this.hero.getPosition(), cameraPosition), kScreenCenter);
//        var heroMaxShiftFromCenter = cc.pMult(cc.pNormalize(heroShiftFromCenter), 128.0);
//        if (cc.pLength(heroMaxShiftFromCenter) < cc.pLength(heroShiftFromCenter)) {
//            this.setPosition(cc.pSub(this.getPosition(), cc.pSub(heroShiftFromCenter, heroMaxShiftFromCenter)));
//        }
        this.setPosition(cc.pAdd(this.getPosition(), dt));
        this.background.setPosition(cc.pMult(this.getPosition(), -1));
        this.subtitlesLayer.setPosition(cc.pMult(this.getPosition(), -1));
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