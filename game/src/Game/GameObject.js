/**
 * Created with JetBrains WebStorm.
 * User: hmmvot
 * Date: 27.04.13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */

var GameObject;
GameObject = cc.Node.extend({
    black:null,
    white:null,
    color:null,

    init:function() {
        var black = cc.Sprite.create(s_foursquare_black);
        this.addChild(black);
        this.black = black;

        var white = cc.Sprite.create(s_foursquare_white);
        this.addChild(white);
        this.white = white;

        this.setColor(kColorWhite);
    },

    setColor:function(color) {
        if (color == kColorBlack) {
            this.black.setVisible(true);
            this.white.setVisible(false);
        }
        else if (color == kColorWhite) {
            this.black.setVisible(false);
            this.white.setVisible(true);
        }
        else {
            cc.Assert(null, "");
        }

        this.color = color;
    },

    setOpacity:function(opacity) {
        this.black.setOpacity(opacity);
        this.white.setOpacity(opacity);
    },

    invert:function() {
        if (this.color == kColorBlack) {
            this.setColor(kColorWhite);
        }
        else if (this.color == kColorWhite) {
            this.setColor(kColorBlack);
        }
        else {
            cc.Assert(null, "");
        }
    }
});

GameObject.create = function() {
    var obj = new GameObject();
    obj.init();
    return obj;
}
