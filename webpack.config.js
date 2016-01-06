module.exports = {
    entry: './app/client/js/main.js',
    output: {
        path: __dirname + 'public/js',
        filename: 'main.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
