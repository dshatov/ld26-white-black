/**
 * Created with JetBrains WebStorm.
 * User: shatty
 * Date: 27.04.13
 * Time: 13:35
 * To change this template use File | Settings | File Templates.
 */

var DynamicHell = {

    _map: null,
    _width: 0,
    _height: 0,
    _mainLength: 0,
    _maxLineLength: 0,
    _trianglePoint: null,
    _segments: null,

    copyMap: function(src) {
        var dest = [];
        for(var i = 0; i < this._width; i++) {
            dest.push([]);
            for(var j = 0; j < this._height; j++) {
                dest[i].push([]);
            }
        }

        for(var i = 0; i < this._width; i++)
            for(var j = 0; j < this._height; j++) {
                if(src[i][j].length > 0)
                    for(var k = 0; k < src[i][j].length; k++)
                        dest[i][j].push(src[i][j][k]);
            }

        return dest;
    },

    generateSubBranch: function(xS, yS, len, lineLen) {
        //xS, yS - точка, откуда строить траекторию
        //len - максимальная длина траектории

        var trying = 5;
        do{
            var tmp = this.copyMap(this._map);

            this._mainLength = len;
            this._maxLineLength = lineLen;

            if((xS >= 0) && (yS >= 0) && (xS < this._width) && (yS < this._height)){
                this._doWave(xS, yS);
            }
            if(this._mainLength > 0){
                this._map = this.copyMap(tmp);
                trying--;
            }
        }
        while((this._mainLength > 0) && (trying > 0))

        if(this._mainLength == 0)
            return true;
        else
            return false;
    },

    generate: function(xS, yS, len, lineLen) {
        //xS, yS - точка, откуда строить траекторию
        //len - максимальная длина траектории

        var sbcount = 15;

        do{
            this.createMap(null, null);

            this._mainLength = len;
            this._maxLineLength = lineLen;

            if((xS >= 0) && (yS >= 0) && (xS < this._width) && (yS < this._height)){
                this._doWave(xS, yS);
                //return false;
            }
        } while(this._mainLength > 0)

        for(; sbcount>0; sbcount--) {
            var succ = false;
            var vert = this.getListOfVertex();
            do {
                var i = Math.floor(Math.random() * vert.length);
                succ = this.generateSubBranch(vert[i].x, vert[i].y, Math.floor(len / 4) + 1, lineLen)
            }
            while(succ)
        }
        this.generateListOfSegments();
    },

    getTrianglePoint: function(){
        return this._trianglePoint;
    },

    addWasFlagToSegment: function(first, last) {
        cc.log("was method started");
        for(var i = 0; i < this._segments.length; i++) {
            var seg = this._segments[i];

            if(((seg.first.x == first.x && seg.first.y == first.y) &&
                    (seg.last.x == last.x && seg.last.y == last.y)) ||
                ((seg.first.x == last.x && seg.first.y == last.y) &&
                    (seg.last.x == first.x && seg.last.y == first.y))) {
                this._segments[i].was = true;
                cc.log("seg was: " + first.x + " " + first.y + "; " + last.x + " " + last.y);
                return;
            }
        }
    },

    getListOfVertex: function(){
        var result = [];
        for(var i = 0; i < this._width; i++)
            for(var j = 0; j < this._height; j++)
                if(this._map[i][j].length > 0)
                    result.push({
                        x: i,
                        y: j
                    });
        return result;
    },

    getListOfNoWays: function(){
        var result = [];
        for(var i = 0; i < this._width; i++)
            for(var j = 0; j < this._height; j++)
                if(this._map[i][j].length == 1)
                    result.push({
                        x: i,
                        y: j
                    });
        return result;
    },

    getListOfSegments: function() {
        return this._segments;
    },

    generateListOfSegments: function(){
        if(this._map == null) {
            this._segments = null;
            return;
        }

        this._segments = [];
        for(var i = 0; i < this._width; i++)
            for(var j = 0; j < this._height; j++)
                for(var k = 0; k < this._map[i][j].length; k++)
                    if((i <= this._map[i][j][k].x) && (j <= this._map[i][j][k].y))
                    {
                        this._segments.push({
                            first: {x: i, y: j},
                            last: {x: this._map[i][j][k].x, y: this._map[i][j][k].y},
                            was: false
                        });
                    }
    },

    lineLength: function(xF, yF, xL, yL) {
        var result = 1;
        var vec = {
            x: xF - xL,
            y: yF - yL
        };
        var x = xF;
        var y = yF;
        while (true) {
            x += vec.x;
            y += vec.y;
            if((x >= 0) && (x < this._width) && (y >= 0) && (y < this._height)) {
                var hasPrev = false;
                for(var i = 0; i < this._map[x][y].length; i++) {
                    if((this._map[x][y][i].x == x - vec.x) && (this._map[x][y][i].x == x - vec.x))
                        hasPrev = true;
                }
                if(hasPrev)
                    result++;
                else
                    break;
            }
            else
                break;
        }
        return result;
    },

    _doWave: function(xF, yF) {
        if(this._mainLength == 0)
        {
            this._trianglePoint = {
                x: xF,
                y: yF
            };
            return false;
        }
        this._mainLength--;
        var steps = [];
        if(xF+1 < this._width)
            if(this._map[xF+1][yF].length == 0)
                steps.push({x: xF + 1, y: yF});
        if(yF+1 < this._height)
            if(this._map[xF][yF+1].length == 0)
                steps.push({x: xF, y: yF + 1});
        if(xF > 0)
            if(this._map[xF-1][yF].length == 0)
                steps.push({x: xF - 1, y: yF});
        if(yF > 0)
            if(this._map[xF][yF-1].length == 0)
                steps.push({x: xF, y: yF - 1});
        if(steps.length > 0)
        {
            var rnd = 0;
            var trying = 0;
            do{
                rnd = Math.floor(Math.random() * steps.length);
                trying++;
            } while ((this.lineLength(xF, yF, steps[rnd].x, steps[rnd].y) > this._maxLineLength)
                && (trying < 10));

            if(trying >= 10)
                return true;

            this._map[xF][yF].push(steps[rnd]);
            this._map[steps[rnd].x][steps[rnd].y].push({x: xF, y: yF})
            this._doWave(steps[rnd].x, steps[rnd].y);
        }
    },

    createMap: function(w, h) {
        this._map = null;
        if((w != null) && (h != null)){
            this._width = w;
            this._height = h;
        }

        this._map = [];
        for(var i = 0; i < this._width; i++) {
            this._map.push([]);
                for(var j = 0; j < this._height; j++) {
                    this._map[i].push([]);
                }
        }
    }
}