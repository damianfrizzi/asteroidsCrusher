var fs = require('fs'),
    path = require('path'),
    directory = __dirname + path.sep,
    rjs = __dirname + path.sep + 'vendor' + path.sep + 'r.js' + path.sep + 'dist' + path.sep + 'r.js',
    requirejs = require(rjs);

fs.readFile(directory + 'main.js', 'utf8', function(err, data) {
    if (err) {
        console.log('Error: ' + err);
        return
    } else {
        var data = data.substr(data.indexOf('{'), data.indexOf('}')),
            data = data.substr(0, data.indexOf('}') + 1),
            paths = JSON.parse(data);

        createBuilt(paths);
    }
});

function createBuilt(paths) {

    console.log('Started build proccess');

    var config = {
        baseUrl: __dirname,
        paths: paths,
        name: 'main',
        out: 'main-built.js',
        preserveLicenseComments: false,
        findNestedDependencies: true,
        removeCombined: true
    };

    requirejs.optimize(config, function(buildResponse) {
        var contents = fs.readFileSync(config.out, 'utf8');
        console.log('Created main-built.js');
    }, function(err) {
        console.log('Error: ' + err);
        return;
    });
}
