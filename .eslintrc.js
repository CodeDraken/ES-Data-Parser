module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "single",
            {
              "allowTemplateLiterals": true
            }
        ],
        "semi": [
            "warn",
            "always"
        ],
        "no-console": 0,
        "no-unused-vars": "off",
        "eqeqeq": 1,
        "no-fallthrough": 1,
        "default-case": 1,
        "no-redeclare": 1,
        "no-self-assign": 1,
        "no-empty": 1,
        "wrap-iife": [
          "warn",
          "inside"
        ]
    }
};
