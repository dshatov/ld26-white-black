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

const levelScale = 512.0;

var Game;
Game = cc.Layer.extend({
    fadeLayer:null,
    background:null,
    hero:null,
    heroDirection:null,
    subtitlesLayer:null,
    controlsBlocked:false,

    init:function() {
        this._super();

        DynamicHell.createMap(64, 64);
        DynamicHell.generate(0, 0, 24, 3);
        //DynamicHell.getListOfSegments()

        this.setMouseEnabled(true);
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();

        this.controlsBlocked = false;

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
        hero.setPosition(0, 0);
        this.addChild(hero, zOrder.hero);
        this.hero = hero;

        var circle = GameObject.create(GameObject.type_circle);
        circle.setColor(kItemColor);
        circle.setPosition(kScreenCenter);
        this.addChild(circle);
        this.circle = circle;

        this.initMapDebugDraw();
        this.initSmallMapDebugDraw();

        return true;
    },

    initMapDebugDraw:function() {
        var gridNode = new cc.Node.create();
        this.addChild(gridNode, 10);

        gridNode.draw = function(ctx) {
            var context = ctx != null ? ctx : cc.renderContext;
            context.strokeStyle = "rgba(255,0,0,255)";
            context.lineWidth = 2;
//            context.globalAlpha = 0.25;

            var segments = DynamicHell.getListOfSegments();
            for (var i = 0; i < segments.length; i++) {
                var seg = segments[i];
                cc.drawingUtil.drawLine(cc.p(seg.first.x*levelScale, seg.first.y*levelScale),
                                        cc.p(seg.last.x*levelScale, seg.last.y*levelScale));
            }

//            context.globalAlpha = 1.0;
        }
    },

    initSmallMapDebugDraw:function() {
        var smallmap = new cc.Node.create();
        smallmap.setPosition(0, kScreenHeight/2);
        this.addChild(smallmap, 10);

        smallmap.draw = function(ctx) {
            var context = ctx != null ? ctx : cc.renderContext;
            context.strokeStyle = "rgba(0,0,255,255)";
            context.lineWidth = 2;
//            context.globalAlpha = 0.25;

            var segments = DynamicHell.getListOfSegments();
            for (var i = 0; i < segments.length; i++) {
                var seg = segments[i];
                cc.drawingUtil.drawLine(cc.p(seg.first.x*8, seg.first.y*8),
                    cc.p(seg.last.x*8, seg.last.y*8));
            }

//            context.globalAlpha = 1.0;
        }

        this.smallmap = smallmap;
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
        this.controlsBlocked = true;
        if (other.type == GameObject.type_triangle) {
            other.runAction(
                cc.FadeTo.create(1.0, 0)
            );
            this.controlsBlocked = false;
        }
        else if (other.type == GameObject.type_circle) {
            var _this = this;
            var makeReply = function(text, gameobject, time) {
                return function() {
                    _this.subtitlesLayer.showText(text, gameobject, time);
                }
            };

            const replyTime = 2.0;
            this.runAction(
                cc.Sequence.create(
                    cc.CallFunc.create(makeReply("(blablabla, Mr. Freeman)", other, replyTime), this),
                    cc.DelayTime.create(replyTime),
                    cc.CallFunc.create(makeReply("(what the f*ck?!)", this.hero, replyTime), this),
                    cc.DelayTime.create(replyTime),
                    cc.CallFunc.create(function() {
                        other.runAction(cc.FadeTo.create(1.0, 0));
                    }),
                    cc.CallFunc.create(function() {
                        this.controlsBlocked = false;
                    }, this)
                )
            );
        }
        else {
            cc.log("holy sh*t!");
            this.controlsBlocked = false;
        }
    },

    update:function(dt) {
        const heroSpeed = 320.0;

        if (this.controlsBlocked == false) {
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
        this.fadeLayer.setPosition(cc.pMult(this.getPosition(), -1));
        this.subtitlesLayer.setPosition(cc.pMult(this.getPosition(), -1));
        this.smallmap.setPosition(cc.pAdd(cc.pMult(this.getPosition(), -1), cc.p(0, kScreenHeight/2)));
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