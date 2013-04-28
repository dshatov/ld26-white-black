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
    _heroOffset: 0,
    heroIntPosition: {
        x: 0,
        y: 0
    },
    subtitlesLayer:null,
    controlsBlocked:false,

    init:function() {
        this._super();

        DynamicHell.createMap(64, 64);
        DynamicHell.generate(0, 0, 24, 2);
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

        this.heroIntPosition.x = 0;
        this.heroIntPosition.y = 0;

        this.addChild(hero, zOrder.hero);
        this.hero = hero;

        var circle = GameObject.create(GameObject.type_circle);
        circle.setColor(kItemColor);
        circle.setPosition(kScreenCenter);
        this.addChild(circle);
//        this.circle = circle;

        this.initMapDebugDraw();
        this.initSmallMapDebugDraw();

        this.heroPulse();

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
        }
    },

    initSmallMapDebugDraw:function() {
        var smallmap = new cc.Node.create();
        smallmap.setPosition(0, kScreenHeight/2);
        this.addChild(smallmap, 10);

        var hero = this.hero;
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

            var x = Math.round((hero.getPosition().x/levelScale)*8.0);
            var y = Math.round((hero.getPosition().y/levelScale)*8.0);
            context.lineWidth = 4;
            context.strokeStyle = "rgba(255,0,0,255)";
            cc.drawingUtil.drawPoint(cc.p(x, y));


//            context.globalAlpha = 1.0;
        }

        this.smallmap = smallmap;
    },

    heroPulse:function() {
        var t = 2.0;
        this.hero.runAction(
            cc.Sequence.create(
                cc.ScaleTo.create(t/2, 1.2),
                cc.EaseBounceOut.create(cc.ScaleTo.create(t/2, 1.0)),
                cc.DelayTime.create(t/2),
                cc.CallFunc.create(this.heroPulse, this)
            )
        );

        this.hero.runAction(
            cc.Sequence.create(
                cc.DelayTime.create(t*0.75),
                cc.CallFunc.create(function () {
                    cc.AudioEngine.getInstance().playEffect(e_pulse);
                })
            )
        );
    },

    restart:function() {
        const t = 0.5;

        this.isPaused = true;

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

                    this.hero.setOpacity(255);

                    DynamicHell.generate(0, 0, 24, 2);
                    this.hero.setPosition(0, 0);
                }, this),
                cc.DelayTime.create(t/2),
                cc.FadeTo.create(t, 0),
                cc.CallFunc.create(function () {
                    this.isPaused = false;
                }, this)
            )
        );
    },

    die:function() {
        if (this.isDead) {
            return;
        }

        this.isDead = true;

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

                    this.hero.setOpacity(255);

                    DynamicHell.generate(0, 0, 24, 3);
                    this.hero.setPosition(0, 0);

                    // drop progress here
//                    this.isDead = false;
                }, this),
                cc.DelayTime.create(t/2),
                cc.FadeTo.create(t, 0),
                cc.CallFunc.create(function () {
                    this.isDead = false;
                }, this)
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

            case cc.KEY.r: { // restart
                this.restart();
            } break;

            case cc.KEY.q: { // exit to main menu
                ccDirector.replaceScene(
                    cc.TransitionFade.create(
                        1.0, MainMenu.create(), kBackgroundColor
                    )
                );
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
//        this.invert();
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

    calculateHeroOffset: function() {
        var nearPoints = DynamicHell._map[this.heroIntPosition.x][this.heroIntPosition.y];

        var result = Math.sqrt(Math.pow(this.heroIntPosition.x * levelScale - this.hero.getPositionX(), 2) +
            Math.pow(this.heroIntPosition.y * levelScale - this.hero.getPositionY(), 2));

        if(nearPoints.length == 0)
            return result;

        var minNear = 3 * levelScale;
        var nearI = -1;
        for(var i = 0; i < nearPoints.length; i++) {
            var curNear = Math.sqrt(Math.pow(nearPoints[i].x * levelScale - this.hero.getPositionX(), 2) +
                Math.pow(nearPoints[i].y * levelScale - this.hero.getPositionY(), 2));
            if(curNear < minNear) {
                minNear = curNear;
                nearI = i;
            }
        }

        if(nearPoints.length > 0 && nearI > -1)
        {
            if(nearPoints[nearI].x != this.heroIntPosition.x){
                var arr = [];
                arr.push(nearPoints[nearI].x * levelScale);
                arr.push(this.heroIntPosition.x * levelScale);
                if(Math.min(arr[0], arr[1]) <= this.hero.getPositionX())
                    if(Math.max(arr[0], arr[1]) >= this.hero.getPositionX())
                        result = Math.abs(this.heroIntPosition.y * levelScale - this.hero.getPositionY());
            }
            else if(nearPoints[nearI].y != this.heroIntPosition.y){
                var arr = [];
                arr.push(nearPoints[nearI].y * levelScale);
                arr.push(this.heroIntPosition.y * levelScale);
                if(Math.min(arr[0], arr[1]) <= this.hero.getPositionY())
                    if(Math.max(arr[0], arr[1]) >= this.hero.getPositionY())
                        result = Math.abs(this.heroIntPosition.x * levelScale - this.hero.getPositionX());
            }
        }
        return result;
    },

    update:function(dt) {
        const heroSpeed = 320.0;

        if (this.isDead || this.isPaused) {
            return;
        }

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
                this.heroIntPosition.x = Math.round(this.hero.getPositionX() / levelScale);
                this.heroIntPosition.y = Math.round(this.hero.getPositionY() / levelScale);
            }

            const maxDist = 128.0;
            var dist = this.calculateHeroOffset();
            if (dist >= maxDist) {
                this.hero.setOpacity(0);
                this.die();
            }
            else {
                this.hero.setOpacity((1 - (dist/maxDist)*0.9)*255);
            }
        }

        for (var i = 0; i < this.getChildrenCount(); i++) {
            var child = this.getChildren()[i];
            if (child == this.hero) {
                continue;
            }

            const maxVisibilityDistance = 372.0;
            const fullVisibilityDistance = 128.0;
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