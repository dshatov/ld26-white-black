/**
 * Created with JetBrains WebStorm.
 * User: hmmvot
 * Date: 05.04.13
 * Time: 21:01
 * To change this template use File | Settings | File Templates.
 */

const zOrder = {
    fadeLayer: 4,
    subtitlesLayer: 3,
    hero: 2,
    mapLayer: 1,
    background: 0
};

const Direction = {
    left:   cc.KEY.left,
    right:  cc.KEY.right,
    bottom: cc.KEY.up,
    top:    cc.KEY.down
};

const levelScale = 512.0;
const kGameObjectTag = 11;
const kHeroSpeed = 320.0;

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
    triangle:null,
    progress:0,
    timePerLevel:0,
    countdown:0,

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

        var hero = GameObject.create(GameObject.type_foursquare, 0);
        hero.setColor(kItemColor);
        hero.setPosition(0, 0);
        this.setPosition(cc.pMult(hero.getPosition(), -1));
        this.addChild(hero, zOrder.hero);
        this.hero = hero;

        this.heroIntPosition.x = 0;
        this.heroIntPosition.y = 0;

        var circle = GameObject.create(GameObject.type_circle);
        circle.setColor(kItemColor);
        circle.setPosition(kScreenCenter);
        this.addChild(circle);
//        this.circle = circle;

        var triangle = GameObject.create(GameObject.type_triangle);
        triangle.setColor(kItemColor);
        triangle.setPosition(kScreenCenter);
        this.addChild(triangle);
        this.triangle = triangle;

        DynamicHell.createMap(64, 64);
        this.generateLevel();

//        this.initMapDebugDraw();
        this.initSmallMapDebugDraw();

        this.updateObjects();
        this.updateLayersPosition();
        this.onStart();

        this.heroPulse();
        cc.AudioEngine.getInstance().playEffect(e_born);

        return true;
    },

    onStart:function() {
        this.isPaused = true;

        var _this = this;
        this.runAction(
            cc.Sequence.create(
                cc.DelayTime.create(2.0),
                cc.CallFunc.create(this.makeReply("where am i?", this.hero, 2.0), this),
                cc.DelayTime.create(3.0),
                cc.CallFunc.create(this.makeReply("i feel", this.hero, 2.0), this),
                cc.DelayTime.create(2.0),
                cc.CallFunc.create(this.makeReply("emptiness inside", this.hero, 3.0), this),
                cc.DelayTime.create(3.0),
                cc.CallFunc.create(function () {
                    _this.isPaused = false;
                })
            )
        );
    },

    generateLevel:function() {
        var i;
        for (i = 0; i < this.getChildrenCount(); i++) {
            var child = this._children[i];
            if (child == this.hero
                || child == this.triangle
                || (!(child instanceof GameObject)
                && child.tag != kGameObjectTag))
            {
                continue;
            }

            this.removeChild(child);
        }

        DynamicHell.generate(0, 0, 4, 2);
        var tp = DynamicHell.getTrianglePoint();
        tp = cc.p(tp.x*levelScale, tp.y*levelScale);
        this.triangle.setPosition(tp);

        for(var i = 0; i < this.getChildrenCount(); i++) {
            var child = this._children[i];
            if (child instanceof GameObject) {
                child.isActive = true;
            }
        }

        this.timePerLevel = (DynamicHell.getListOfSegments().length*levelScale/kHeroSpeed)*1.5;
        cc.log("time per level: " + this.timePerLevel);
        this.countdown = this.timePerLevel;
    },

    initMapDebugDraw:function() {
        var gridNode = new cc.Node.create();
        this.addChild(gridNode, zOrder.mapLayer);

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
        smallmap.setPosition(16.0, kScreenHeight/2);
        this.addChild(smallmap, zOrder.mapLayer);

        var _this = this;
        smallmap.draw = function(ctx) {
            var context = ctx != null ? ctx : cc.renderContext;
            context.strokeStyle = "rgba(" + kItemColor.r + "," + kItemColor.g + "," + kItemColor.b + ",255)";
            context.lineWidth = 2;
//            context.globalAlpha = 0.25;

            var segments = DynamicHell.getListOfSegments();
            for (var i = 0; i < segments.length; i++) {
                var seg = segments[i];
                cc.drawingUtil.drawLine(cc.p(seg.first.x*16, seg.first.y*16),
                    cc.p(seg.last.x*16, seg.last.y*16));
            }

            var x = Math.round((_this.hero.getPosition().x/levelScale)*16.0);
            var y = Math.round((_this.hero.getPosition().y/levelScale)*16.0);
            context.lineWidth = 4;
            context.fillStyle =  "rgba(255,0,0,255)";
            cc.drawingUtil.drawPoint(cc.p(x, y), 4);


//            context.globalAlpha = 1.0;
        }

        this.smallmap = smallmap;
    },

    heroPulse:function() {
        const maxT = 2.0;
        const minT = 0.5;
        var t = maxT;
        var d = 40.0;
        if (this.countdown < d) {
            if (this.countdown > 20) {
                t = minT + (maxT - minT)*((this.countdown - 20)/20);
            }
            else {
                t = minT;
            }
        }

//        cc.log(t);

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

    nextLevel:function() {
        const t = 0.5;

        this.isPaused = true;
        this.progress += 1;

        if (this.progress >= 4) {
            invertColors();
            ccDirector.replaceScene(
                cc.TransitionFade.create(3.0, FinishScene.create(), kBackgroundColor)
            );

            return;
        }

        this.fadeLayer.setColor(kItemColor);
        this.fadeLayer.runAction(
            cc.Sequence.create(
                cc.FadeTo.create(t, 255),
                cc.CallFunc.create(function() {
                    invertColors();

                    this.removeChild(this.hero);
                    this.hero = GameObject.create(GameObject.type_foursquare, this.progress);
                    this.addChild(this.hero);
                    this.heroPulse();

                    this.background.setColor(kBackgroundColor);
                    for (var i = 0; i < this.getChildrenCount(); i++) {
                        var child = this.getChildren()[i];
                        if (child instanceof GameObject) {
                            child.setColor(kItemColor);
                        }
                    }

                    this.generateLevel();

                    this.hero.setPosition(0, 0);
                    this.hero.setOpacity(255);
                    this.heroIntPosition.x = 0;
                    this.heroIntPosition.y = 0;
                    this.updateObjects();
                    this.updateLayersPosition();
                }, this),
                cc.DelayTime.create(t/2),
                cc.CallFunc.create(function() {
                    cc.AudioEngine.getInstance().playEffect(e_born);
                }),
                cc.FadeTo.create(t, 0),
                cc.CallFunc.create(function () {
                    const replyTime = 2.0;
                    var _this = this;
                    this.runAction(
                        cc.Sequence.create(
                            cc.CallFunc.create(this.makeReply("i feel me better!", this.hero, replyTime), this),
                            cc.DelayTime.create(replyTime),
                            cc.CallFunc.create(function() {
                                _this.isPaused = false;
                            })
                        )
                    );
                }, this)
            )
        );
    },

    die:function() {
        if (this.isDead) {
            return;
        }
        cc.AudioEngine.getInstance().playEffect(e_death);

        this.isDead = true;
        this.progress = 0;

        const t = 0.5;

        this.fadeLayer.setColor(kItemColor);
        this.fadeLayer.runAction(
            cc.Sequence.create(
                cc.FadeTo.create(t, 255),
                cc.CallFunc.create(function() {
                    invertColors();

                    this.removeChild(this.hero);
                    this.hero = GameObject.create(GameObject.type_foursquare, this.progress);
                    this.addChild(this.hero);
                    this.heroPulse();

                    this.background.setColor(kBackgroundColor);
                    for (var i = 0; i < this.getChildrenCount(); i++) {
                        var child = this.getChildren()[i];
                        if (child instanceof GameObject) {
                            child.setColor(kItemColor);
                        }
                    }

                    this.generateLevel();
                    this.hero.setPosition(0, 0);
                    this.hero.setOpacity(255);
                    this.heroIntPosition.x = 0;
                    this.heroIntPosition.y = 0;
                    this.updateObjects();
                    this.updateLayersPosition();

                    // drop progress here
                }, this),
                cc.DelayTime.create(t/2),
                cc.CallFunc.create(function() {
                    cc.AudioEngine.getInstance().playEffect(e_born);
                }),
                cc.FadeTo.create(t, 0),
                cc.CallFunc.create(function () {
                    this.isDead = false;
                }, this)
            )
        );
    },

    onKeyDown:function(evt) {
        if (this.isDead || this.isPaused) {
            return;
        }

        switch (evt)
        {
            case cc.KEY.left:
            case cc.KEY.right:
            case cc.KEY.up:
            case cc.KEY.down: {
                this.heroDirection = evt;
            } break;

            case cc.KEY.r: { // restart
                this.nextLevel();
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
//        if (this.isDead || this.isPaused) {
//            return;
//        }

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
        if (this.isDead || this.isPaused) {
            return;
        }

//        var location = mouse.getLocation();
//        this.invert();
//        this.subtitlesLayer.showText("hello subtitles!", this.circle, 2.0);
    },

    reset:function() {

    },

    makeReply:function(text, gameobject, replyTime) {
        var _this = this;
        return function() {
            _this.subtitlesLayer.showText(text, gameobject, replyTime);
        }
    },

    heroInteractWith:function(other) {
        other.isActive = false;
        this.isPaused = true;

        const replyTime = 3.0;
        var _this = this;
        if (other.type == GameObject.type_triangle) {
            this.runAction(
                cc.Sequence.create(
                    cc.CallFunc.create(this.makeReply("i feel small and helpless", other, replyTime), this),
                    cc.DelayTime.create(replyTime),
                    cc.CallFunc.create(this.makeReply("maybe you can protect me?", other, replyTime), this),
                    cc.DelayTime.create(replyTime),
                    cc.CallFunc.create(this.makeReply("please take me with you!", other, replyTime), this),
                    cc.DelayTime.create(replyTime),
                    cc.CallFunc.create(function() {
                        _this.nextLevel();
                    })
                )
            );
        }
        else if (other.type == GameObject.type_circle) {
            this.runAction(
                cc.Sequence.create(
                    cc.CallFunc.create(this.makeReply("blablabla, Mr. Freeman", other, replyTime), this),
                    cc.DelayTime.create(replyTime),
                    cc.CallFunc.create(this.makeReply("?!", this.hero, replyTime), this),
                    cc.DelayTime.create(replyTime),
                    cc.CallFunc.create(function() {
                        other.runAction(cc.FadeTo.create(1.0, 0));
                    }),
                    cc.DelayTime.create(1.0),
                    cc.CallFunc.create(function() {
                        this.isPaused = false;
                    }, this)
                )
            );
        }
        else {
            cc.log("holy sh*t!");
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

    updateLayersPosition:function() {
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

        this.setPosition(cc.pAdd(this.getPosition(), dt));

        this.background.setPosition(cc.pMult(this.getPosition(), -1));
        this.fadeLayer.setPosition(cc.pMult(this.getPosition(), -1));
        this.subtitlesLayer.setPosition(cc.pMult(this.getPosition(), -1));
        this.smallmap.setPosition(cc.pAdd(cc.pMult(this.getPosition(), -1), cc.p(16.0, kScreenHeight/2)));
    },

    updateObjects:function() {
        for (var i = 0; i < this.getChildrenCount(); i++) {
            var child = this.getChildren()[i];
            if (child == this.hero) {
                continue;
            }

            if ((!(child instanceof GameObject)) && (child.tag != kGameObjectTag)) {
                continue;
            }

            const maxVisibilityDistance = 372.0;
            const fullVisibilityDistance = 128.0;
            var distance = cc.pLength(cc.pSub(this.hero.getPosition(), child.getPosition()));
            if (distance - fullVisibilityDistance >= maxVisibilityDistance) {
                if (child.setOpacity) {
                    child.setOpacity(0);
                }
            }
            else if (distance > fullVisibilityDistance) {
                var k = (distance - fullVisibilityDistance)/(maxVisibilityDistance);
                k = k <= 1 ? k : 1;
                if (child.setOpacity) {
                    child.setOpacity((1 - k)*255);
                }
            }
            else {
                if (child.setOpacity) {
                    child.setOpacity(255);
                }
                if (child instanceof GameObject && child.isActive) {
                    this.heroInteractWith(child);
                }
            }
        }
    },

    update:function(dt) {
        if (this.isDead || this.isPaused) {
            return;
        }

        this.countdown -= dt;
        if (this.countdown <= 0) {
            this.die();

            return;
        }

        var d = kHeroSpeed*dt;
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
            cc.log("so far: " + dist);
            this.hero.setOpacity(0);
            this.die();
        }
        else {
            this.hero.setOpacity((1 - (dist/maxDist)*0.9)*255);
        }

        this.updateObjects();
        this.updateLayersPosition();
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