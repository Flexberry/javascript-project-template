/*! Flexberry-javascript-project-template - v1.0.0 - 2014-12-03 */
// Uses Node, AMD or browser globals to create a module.
(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Unicorn = factory();
    }
}(this, function() {
    'use strict';

    /**
     * Creates a new unicorn.
     * @param {string} name Unicorn name.
     * @constructor
     * @alias module:Unicorn
     */
    var Unicorn = function(name) {
        this._name = name;
    };

    /**
     * Gets unicorn name.
     * @returns {string} Unicorn name.
     */
    Unicorn.prototype.getName = function() {
        return this._name;
    };

    /**
     * Gets ASCII art with unicorn portrait.
     * @returns {string} Multiline string (LF eol) with a picture of a unicorn.
     */
    Unicorn.prototype.getArt = function() {
        var art =
            '        \\.                                      \n' +
            '         \\\'.      ;.                           \n' +
            '          \\ \'. ,--\'\'-.~-~-\'-,               \n' +
            '           \\,-\' ,-.   \'.~-~-~~,               \n' +
            '        ,-\'   (###)    \\-~\'~=-.               \n' +
            '     _,-\'       \'-\'      \\=~-"~~\',          \n' +
            '    /o                    \\~-""~=-,             \n' +
            '    \\__                    \\=-,~"-~,           \n' +
            '       """===-----.         \\~=-"~-.            \n' +
            '                   \\         \\*=~-"            \n' +
            '                    \\         "=====----        \n' +
            '                     \\                          \n' +
            '                      \\                         \n';

        return art;
    };

    return Unicorn;
}));
