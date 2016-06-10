// Description:
//   Keeps track of your favorite restaurants as best it can!
//
// Dependencies:
//   lodash
//
// Configuration:
//   none
//
// Commands:
//   hubot restaurant list - list known restaurants and menus
//   hubot restaurant menu for {restaurant} - show the menu for a particular restaurant
//   hubot restaurant random - picks a random restaurant
//   hubot restaurant add "{restaurant}" [{menu link}] - adds a restaurant with optional menu
//   hubot restaurant update "{restaurant}" {menu link} - updates a restaurant's menu
//   hubot restaurant delete "{restaurant}" - deletes a restaurant
//
// Notes:
//   Quotes around the restaurant name for mutative commands
//
// Tags:
//   restaurants
//
// Examples:
//   hubot restaurant list - list the restaurants that the bot knows
//   hubot restaurant menu for [restaurant] - link the restaurant's menu
//   hubot restaurant random - pick a random restaurant from the list
//
// Author:
//   mentalspike
'use strict';
var _ = require('lodash');

var defaultRestaurants = _.sortBy([
  { name: 'Dibella\'s', menu: 'http://www.dibellas.com/menu#submarines' },
  { name: 'Donnelly\'s', menu: 'http://www.donnellysph.com/' },
  { name: 'Mac\'s Philly Steaks', menu: 'http://www.macsphillysteaks.com/menu/' },
  { name: 'Mesa Grande', menu: 'http://mesagrandetaqueria.com/menus-fairport/' },
  { name: 'Mulconry\'s', menu: 'http://mulconrys.com/main-menu/2586196' },
  { name: 'Papa C\'s', menu: 'http://papacsfairport.com/menu.php' },
  { name: 'Salvatores', menu: 'http://www.salvatores.com/#!pizza/ywcnj' },
  { name: 'Towpath Cafe', menu: 'http://towpathcafe.com/menu' }
], 'name');

function formatRestaurant(r) {
  var entry = r.name;
  if (r.menu) {
    entry += ': ' + r.menu;
  }
  return entry;
}

function restaurantName(r){
  return r.name;
}

var storageKey = 'restaurantBot.list';

function restaurantBot(robot) {

  var getRestaurants = function getRestaurants() {
    var result = robot.brain.get(storageKey) || null;
    if (!result || !result.length) {
      robot.brain.set(storageKey, defaultRestaurants);
      result = defaultRestaurants;
    }
    return result;
  };

  var getRestaurant = function getRestaurant(name) {
    return _.find(getRestaurants(), { name: name });
  };

  var addRestaurant = function addRestaurant(name, menu) {
    if (name) {
      var restaurants = getRestaurants();
      var restaurant = getRestaurant(name);
      if (!restaurant) {
        restaurants.push({ name: name, menu: menu });
        robot.brain.set(storageKey, _.sortBy(restaurants, 'name'));
        return true;
      }
    }
    return false;
  };

  var updateRestaurant = function updateRestaurant(name, menu) {
    if (name && menu) {
      var restaurants = getRestaurants();
      var r = _.find(restaurants, { name: name });
      if (r) {
        r.menu = menu;
        robot.brain.set(storageKey, restaurants);
        return true;
      }
    }
    return false;
  };

  var deleteRestaurant = function deleteRestaurant(name) {
    if (name) {
      var restaurants = getRestaurants();
      var r = _.find(restaurants, { name: name });
      if (r) {
        _.remove(restaurants, { name: name });
        robot.brain.set(storageKey, restaurants);
        return true;
      }
    }
    return false;
  };

  robot.respond(/restaurant list/, function (res) {
    var results = _.map(getRestaurants(), restaurantName).join('\r\n');
    res.send(results);
  });

  robot.respond(/restaurant random/, function (res) {
    var list = getRestaurants();

    //random seems to repeat itself a lot. Let it repeat itself quietly
    var primer = new Date().getTime() % 10;
    for (var jk = 0; jk < primer; jk++) {
      Math.random();
    }

    var restaurant = list[Math.floor(Math.random() * list.length)];
    res.send(formatRestaurant(restaurant));
  });

  robot.respond(/restaurant menu for ["]?([^"]+)/, function (res) {
    var name = res.match[1];
    var r = getRestaurant(name);
    if (r) {
      res.send(r.menu || 'Nobody ever told me where to find the menu for ' + name);
    } else {
      res.send('Sorry, I don\'t know about a restaurant named ' + name);
    }
  });

  robot.respond(/restaurant add "([^"]+)"(?:\s*(http.*))?/, function (res) {
    var name = res.match[1];
    var menu = res.match[2];
    if (addRestaurant(name, menu)) {
      res.send('I\'ve added ' + name + ' to the restaurant list!');
    } else {
      res.send('Seems like we already have ' + name + ' in the list.');
    }
  });

  robot.respond(/restaurant update "([^"]+)"\s*(http.*)?/, function (res) {
    var name = res.match[1];
    var menu = res.match[2];
    if (updateRestaurant(name, menu)) {
      res.send('I\'ve updated the menu for ' + name);
    } else {
      res.send('Sorry, I couldn\'t update the menu for ' + name);
    }
  });

  robot.respond(/restaurant delete "(.*)"/, function (res) {
    var name = res.match[1];
    if (name) {
      if (deleteRestaurant(name)) {
        res.send('I\'ve removed ' + name + ' from the restaurant list.');
      } else {
        res.reply('Sorry, I couldn\'t remove that for some reason.');
      }
    } else {
      res.reply('Tell me which restaurant to remove.');
    }
  });
}

module.exports = restaurantBot;