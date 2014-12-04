module.exports = function(grunt) {
    'use strict';

    var exports = {};

    /**
     * Gets GitHub repository path in :owner/:repo format.
     * @param  {Object} pkg Parsed package.json.
     * @return {string}     Repository path in :owner/:repo format.
     * @throws Will throw an error if GitHub repository is not defined.
     */
    exports.getRepositoryShortPath = function(pkg) {
        var url = pkg.repository && pkg.repository.url,
            found;

        if (!url) {
            grunt.fail.warn(new Error(
                'Repository URL not found in package.json, please define it.'));
        }

        found = url.match(/.*github\.com[\/:]([^\.]*)(?:\.git)?/i);
        found = found && found[1];
        if (!found) {
            grunt.fail.warn(new Error(
                'Failed to parse repository URL from package.json. ' +
                'GitHub URL via HTTPS or SSH expected.'));
        }

        return found;
    };

    return exports;
};
