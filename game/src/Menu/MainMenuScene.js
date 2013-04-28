/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var MainMenu = cc.Layer.extend({
    init:function() {
        this._super();

        var background = cc.LayerColor.create(kBackgroundColor);
        this.addChild(background);

        var menu = cc.Menu.create();
        this.addChild(menu);

        var item = cc.MenuItemFont.create("PLAY", this.play, this);
        item.setColor(kItemColor);
        menu.addChild(item);

        this.setKeyboardEnabled(true);

        return true;
    },

    play:function() {
        ccDirector.replaceScene(
            cc.TransitionFade.create(
                1.0, GameScene.create(), kBackgroundColor
            )
        );
    },

    onKeyUp:function(evt) {
        if (evt == cc.KEY.space) {
            this.play();
        }
    },

    update:function(dt) {

    }
});

MainMenu.create = function() {
    var layer = new this();
    layer.init();
    return layer;
};

var MainMenuScene = cc.Scene.extend({});

MainMenuScene.create = function() {
    var scene = new this();
    scene.init();

    var layer = MainMenu.create();
    scene.addChild(layer);

    return scene;
};
