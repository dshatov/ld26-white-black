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
    type:null,
    isActive:null,

    init:function(type, progress) {
        cc.Assert(type == GameObject.type_foursquare
                  || type == GameObject.type_triangle
                  || type == GameObject.type_circle,
                  "Unknown type");

        this.type = type;
        this.isActive = true;

        var s_black = null;
        var s_white = null;
        var animation_b = null;
        var animation_w = null;
        switch (this.type)
        {
            case GameObject.type_foursquare: {
                progress = progress != null ? progress : 0;
                s_black = window["s_foursquare_black_" + progress];
                s_white = window["s_foursquare_white_" + progress];
            } break;

            case GameObject.type_triangle: {
                s_black = s_triangle_black;
                s_white = s_triangle_white;;

                var t = 0.5;
                animation_b = cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.ScaleTo.create(t/2, 0.8, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.0),
                        cc.ScaleTo.create(t/2, 0.8, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.0)
                    )
                );
                animation_w = cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.ScaleTo.create(t/2, 0.8, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.0),
                        cc.ScaleTo.create(t/2, 0.8, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.0)
                    )
                );
            } break;

            case GameObject.type_circle: {
                s_black = s_cirlce_black;
                s_white = s_circle_white;

                var t = 1.0;
                animation_b = cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.ScaleTo.create(t, 1.2, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.2),
                        cc.ScaleTo.create(t, 1.0, 1.0)
                    )
                );
                animation_w = cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.ScaleTo.create(t, 1.2, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.0),
                        cc.ScaleTo.create(t, 1.0, 1.2),
                        cc.ScaleTo.create(t, 1.0, 1.0)
                    )
                );
            } break;

            default:
                cc.Assert(null, "");
                break;
        }

        var black = cc.Sprite.create(s_black);
        this.addChild(black);
        this.black = black;

        var white = cc.Sprite.create(s_white);
        this.addChild(white);
        this.white = white;

        this.setContentSize(this.white.getContentSize());

        this.setColor(kColorWhite);

        if (animation_b || animation_w) {
            this.white.runAction(animation_b);
            this.black.runAction(animation_w);
        }
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

    getOpacity:function() {
        return this.color == kColorBlack
               ? this.black.getOpacity()
               : this.white.getOpacity();
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

GameObject.create = function(type, progress) {
    var obj = new GameObject();
    obj.init(type, progress);
    return obj;
}

GameObject.type_foursquare  = 0;
GameObject.type_triangle    = 1;
GameObject.type_circle      = 2;
