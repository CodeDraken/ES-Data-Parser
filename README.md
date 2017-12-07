[![PayPal][paypal-img]][paypal-url]

[paypal-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KV78TWKWKKK3S
[paypal-img]: https://img.shields.io/badge/donate-PayPal-blue.svg?style=flat-square

# ES-Data-Parser
A scraper / game parser for the game "Endless Sky" that generates JSON from the game's data files.

This branch is deprecated. Use the V2 branch for latest updates.

## Fetching Data
You can use GitHub's API to fetch data using a url like this:

```
https://api.github.com/repos/CodeDraken/ES-Data-Parser/contents/json/map/map-systems.json?ref=v2
```

Explanation:
```js
'https://api.github.com/repos/CodeDraken/ES-Data-Parser' // the repo name
'/contents/' // tell GitHub you want to get the contents of a file
'json/map/map-systems.json' // the file path inside the repo
'?ref=v2' // the branch, currently the latest data is on the v2 branch
```
