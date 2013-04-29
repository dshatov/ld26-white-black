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
            if (gameobject.type == GameObject.type_triangle) {
                text = "< " + text + " >"
            } else if (gameobject.type == GameObject.type_circle) {
                text = "( " + text + " )"
            } else if (gameobject.type == GameObject.type_foursquare) {
                text = "[ " + text + " ]"
            }

            var replyText = "#^&!$%@";
            this.replyLabel.stopAllActions();
            this.replyLabel.setOpacity(0);
            this.replyLabel.setString(replyText);
            if (kItemColor == kColorBlack) {
                this.replyLabel.setColor(cc.c3b(50, 50, 50));
            }
            else {
                this.replyLabel.setColor(cc.c3b(205, 205, 205));
            }
            var gameobjectPos = cc.pAdd(gameobject.getPosition(), gameobject.getParent().getPosition());
            this.replyLabel.setPosition(gameobjectPos.x,
                gameobjectPos.y + gameobject.getContentSize().height/2 + this.replyLabel.getContentSize().height + 16.0);
            this.replyLabel.runAction(
                cc.Sequence.create(
                    cc.FadeTo.create(time*0.25, 255),
                    cc.DelayTime.create(time*0.5),
                    cc.FadeTo.create(time*0.25, 0)
                )
            );
        }

        this.subtitleLabel.stopAllActions();
        this.subtitleLabel.setOpacity(0);
        this.subtitleLabel.setString(text);
        if (kItemColor == kColorBlack) {
            this.subtitleLabel.setColor(cc.c3b(55, 55, 55));
        }
        else {
            this.subtitleLabel.setColor(cc.c3b(200, 200, 200));
        }
        this.subtitleLabel.runAction(
            cc.Sequence.create(
                cc.FadeTo.create(time*0.25, 255),
                cc.DelayTime.create(time*0.5),
                cc.FadeTo.create(time*0.25, 0)
            )
        );

        switch (gameobject.type)
        {
            case GameObject.type_foursquare: {
                var voice = window["e_voice_foursquare_" + randomIntBetween(0, 1)];
                cc.AudioEngine.getInstance().playEffect(voice);
            } break;

            case GameObject.type_circle: {
                cc.AudioEngine.getInstance().playEffect(e_voice_circle);
            } break;

            case GameObject.type_triangle: {
                cc.AudioEngine.getInstance().playEffect(e_voice_triangle);
            } break;
        }
    }
});

SubtitlesLayer.create = function() {
    var obj = new this();
    obj.init();
    return obj;
}
