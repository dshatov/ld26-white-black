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
        menu.setPosition({x: 150, y: 150});
        this.addChild(menu);

        this.renderDevelopers();

        var backButton = cc.MenuItemFont.create("BACK", this.mainMenu, this);
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
    renderDevelopers: function() {
       var sp = {x: 470, y: 400}, cursopposition, that = this;

        var label = cc.LabelTTF.create("Game about existential suffering of foursquare.");
        label.setColor(kItemColor);
        label.setPosition(sp);
        label.setFontSize(30);
        label.setFontName('Arial');
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