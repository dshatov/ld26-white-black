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

        var backButton = cc.MenuItemFont.create("main menu", this.mainMenu, this);
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
        var label = cc.LabelTTF.create("This is a game about foursquare and his existential suffering.", "Arial", 32);
        label.setColor(kItemColor);
        label.setPosition(kScreenCenter.x, kScreenHeight - 72.0);
        this.addChild(label);

        var howtoLabels = [
            cc.LabelTTF.create("Use arrows for moving foursquare.", "Arial", 32),
            cc.LabelTTF.create("If foursquare become transparent you will lose.", "Arial", 32),
            cc.LabelTTF.create("You should find a way to fill the foursquare.", "Arial", 32),
            cc.LabelTTF.create("Do be quick!", "Arial", 32),
            cc.LabelTTF.create(" ", "Arial", 32),
            cc.LabelTTF.create("(we recommend you to use headphones)", "Arial", 32),
        ];

        const spaceY = 8.0;
        const fullHeight = label.getContentSize().height*(howtoLabels.length) + spaceY*(howtoLabels.length - 1);
        for (var i = 0; i < howtoLabels.length; i++) {
            label = howtoLabels[i];
//            label.setAnchorPoint(0.5, 1);
            label.setColor(kItemColor);
            label.setPosition(kScreenCenter.x, kScreenCenter.y + fullHeight/2 - i*(label.getContentSize().height + spaceY));
            this.addChild(label);
        }
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