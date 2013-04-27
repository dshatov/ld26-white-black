/**
 * Created with JetBrains WebStorm.
 * User: hmmvot
 * Date: 27.04.13
 * Time: 16:18
 * To change this template use File | Settings | File Templates.
 */

var SubtitlesLayer;
SubtitlesLayer = cc.Layer.extend({
    subtitleLabelreplyLabel:null,
    subtitleLabel:null,

    init:function() {
        this._super();

        var replyLabel = cc.LabelTTF.create("", "Arial");//, 16);
        replyLabel.setColor(kItemColor);
        replyLabel.setOpacity(0);
        this.addChild(replyLabel);
        this.replyLabel = replyLabel;

        var subtitleLabel = cc.LabelTTF.create("", "Arial", 32);
        subtitleLabel.setColor(kItemColor);
        subtitleLabel.setOpacity(0);
        subtitleLabel.setPosition(kScreenWidth/2, 72.0);
        this.addChild(subtitleLabel);
        this.subtitleLabel = subtitleLabel;

        return true;
    },

    showText:function(text, gameobject, time) {
        if (gameobject != null) {
            this.replyLabel.setOpacity(0);
            this.replyLabel.setString("#^&!$%@");
            this.replyLabel.setColor(kItemColor);
            var gameobjectPos = cc.pAdd(gameobject.getPosition(), gameobject.getParent().getPosition());
            this.replyLabel.setPosition(gameobjectPos.x,
                gameobjectPos.y + gameobject.getContentSize().height/2 + this.replyLabel.getContentSize().height);
            this.replyLabel.runAction(
                cc.Sequence.create(
                    cc.FadeTo.create(time*0.25, 255),
                    cc.DelayTime.create(time*0.5),
                    cc.FadeTo.create(time*0.25, 0)
                )
            );
        }

        this.subtitleLabel.setOpacity(0);
        this.subtitleLabel.setString(text);
        this.subtitleLabel.setColor(kItemColor);
        this.subtitleLabel.runAction(
            cc.Sequence.create(
                cc.FadeTo.create(time*0.25, 255),
                cc.DelayTime.create(time*0.5),
                cc.FadeTo.create(time*0.25, 0)
            )
        );
    }
});

SubtitlesLayer.create = function() {
    var obj = new this();
    obj.init();
    return obj;
}
