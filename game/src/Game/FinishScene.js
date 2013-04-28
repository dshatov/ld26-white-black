/**
 * Created with JetBrains WebStorm.
 * User: hmmvot
 * Date: 28.04.13
 * Time: 12:48
 * To change this template use File | Settings | File Templates.
 */

var Finish = cc.Layer.extend({
    init:function() {
        var background = cc.LayerColor.create(kBackgroundColor);
        this.addChild(background);

        var s;
        s = cc.LayerColor.create(kItemColor, 64, 64);
        s.setAnchorPoint(0, 0);
        s.setPosition(kScreenCenter.x - (64*2.5)/2, kScreenCenter.y - (64*2.5)/2);
        s.setScale(2.5);
        this.addChild(s);

        var t = 3;
        s.runAction(
            cc.Sequence.create(
                cc.Spawn.create(
//                    cc.ScaleTo.create(t, kScreenSize.width/s.getContentSize().width),
                    cc.Sequence.create(
                        cc.DelayTime.create(t*2),
                        cc.CallFunc.create(function() {
                            var l = cc.LabelTTF.create("THE END", "Arial", 32);
                            l.setPosition(kScreenCenter);
                            l.setColor(kBackgroundColor);
                            this.addChild(l);
                        }, this),
                        cc.DelayTime.create(t),
                        cc.CallFunc.create(function() {
                            ccDirector.replaceScene(
                                cc.TransitionFade.create(t*2, MainMenuScene.create(), kBackgroundColor)
                            );
                        }, this)
                    )
                )
            )
        );
    }
});

var FinishScene = cc.Scene.extend({});
FinishScene.create = function() {
    var scene = new this();
    scene.init();

    var layer = new Finish();
    layer.init();
    scene.addChild(layer);

    return scene;
};
