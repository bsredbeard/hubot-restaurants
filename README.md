# hubot-restaurants
A hubot script to help you choose from your favorite restaurants. Stores your favorite restaurants in Hubot's brain and does not rely on an API, so it will never die.

## Installation

1. Install via NPM:  `npm i hubot-restaurants --save`

2. Add a line to your `external-scripts.json` for "hubot-restaurants"
3. Deploy your hubot

## Usage

```
@hubot restaurant list - list known restaurants and menus

@hubot restaurant menu for {restaurant} - show the menu for a particular restaurant, quotes around the restaurant are optional

@hubot restaurant random - picks a random restaurant

@hubot restaurant add "{restaurant}" [{menu link}] - adds a restaurant with optional menu

@hubot restaurant update "{restaurant}" {menu link} - updates a restaurant's menu

@hubot restaurant delete "{restaurant}" - deletes a restaurant
```

### Notes
* Restaurant names are currently case-sensitive.
* The restaurant list does not include menu links as a pile of links can cause bad behavior in some chat clients.

## Environment

There are no hard requirements, however restaurants are stored in Hubot's brain. If you have persistent storage setup for Hubot's brain, then your restaurants will persist. If not, you will get the default list of our favorite restaurants in Fairport, NY. YMMV.

## License

Licensed under the [MIT License](./LICENSE).