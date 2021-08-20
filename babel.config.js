module.exports = function (api) {
    api.cache(false);
    const presets = [
        ["@babel/preset-typescript"],
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "entry",
                "targets": {
                    "ie": "11"
                }
            }
        ]
    ];
    const plugins = [
        ['@babel/plugin-transform-shorthand-properties'],
        ['@babel/plugin-transform-arrow-functions'],
        ["@babel/plugin-proposal-decorators",{"decoratorsBeforeExport":true}],
        ["@babel/plugin-proposal-class-properties"],
        ["@babel/transform-runtime"]];
    return {
        presets,
        plugins
    };
};