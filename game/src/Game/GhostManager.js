/**
 * Created with JetBrains WebStorm.
 * User: shatty
 * Date: 28.04.13
 * Time: 14:05
 * To change this template use File | Settings | File Templates.
 */

var GhostManager = {
    _ghosts: [],
    _distance: null,
    _ghostPosition: {
        x: 0,
        y: 0
    },

    addGhost: function(x, y) {
        if(this._distance == null)
            this._distance = levelScale / 4;
        if(Math.sqrt(Math.pow(x - this._ghostPosition.x, 2) + Math.pow(y - this._ghostPosition.y, 2)) > this._distance) {
            var nearGhost = false;
            for(var i = 0; i < this._ghosts.length; i++) {
                if (Math.sqrt(Math.pow(this._ghosts[i].x - this._ghostPosition.x, 2) +
                    Math.pow(this._ghosts[i].y - this._ghostPosition.y, 2)) <= this._distance){
                    nearGhost = true;
                }
            }
            if(!nearGhost) {
                var pos = {
                    x: this._ghostPosition.x,
                    y: this._ghostPosition.y
                };
                this._ghosts.push(pos);
                cc.log("Ghost added: " + this._ghostPosition.x + ", " + this._ghostPosition.y);
                this._ghostPosition.x = x;
                this._ghostPosition.y = y;
                return pos;
            }
        }
        return null;
    },

    removeGhost: function(ghost) {
        cc.ArrayRemoveObject(this._ghosts, ghost);
    },

    reset: function(distance) {
        this._distance = distance;
        this._ghosts = null;
        this._ghosts = [];
        this._ghostPosition.x = 0;
        this._ghostPosition.y = 0;
    }
}