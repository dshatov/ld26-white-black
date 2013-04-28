var developers = [
    'Alexander Sokolenko',
    'Dmitriy Shatov',
    'Senin Roman'
];

var musiceditor = [
    'Ilya Suhorukov'
];

var designer = [
    'Ilya Suhorukov'
];

var About = cc.Layer.extend({
    init: function() {
        this._super();

        var background = cc.LayerColor.create(kBackgroundColor);
        this.addChild(background);

        var menu = cc.Menu.create();
        menu.setPosition(kScreenCenter.x, 72.0);
        this.addChild(menu);

        this.createPage();

        var backButton = cc.MenuItemFont.create("back", this.mainMenu, this);
        backButton.setColor(kItemColor);
        menu.addChild(backButton);
    },

    mainMenu: function() {
        ccDirector.replaceScene(
            cc.TransitionFade.create(
                1.0, MainMenuScene.create(), kBackgroundColor
            )
        )
    },

    createPage: function() {
       var sp = {x: 470, y: 400}, cursopposition, that = this;

        var label = cc.LabelTTF.create("This is a game about existential suffering of foursquare.", "Arial", 32);
        label.setColor(kItemColor);
        label.setPosition(kScreenCenter);
        this.addChild(label);
        /*
        developers.forEach(function(el) {
            var developer = cc.LabelTTF.create(el);
            sp = {x: sp.x,y: sp.y-50};
            developer.setPosition(sp);
            developer.setColor(kItemColor);
            developer.setFontSize(30);
            that.addChild(developer);
        });
        */
    }
});

About.create = function() {
    var layer = new this();
    layer.init();
    return layer;
}

var AboutScene = cc.Scene.extend({});

AboutScene.create = function() {
    var about = new this();
    about.init();

    var layer = About.create();
    about.addChild(layer);

    return about;
}