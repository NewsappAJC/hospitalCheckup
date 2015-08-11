# Hospital Checkup
Explore hospital quality data for Atlanta area hospitals.

- Published: by Sept. 1!
- Lives here:
- Hosted here:

## Dependencies

 - [Node.js](https://nodejs.org/)
 - [Grunt CLI](http://gruntjs.com/getting-started)
 - [Bower](http://bower.io/)
 
##Plugins
 - [underscore]()
 - [backbone]()
 - [backbone.marionette]()
 - [backbone.select](https://github.com/hashchange/backbone.select) for keeping the nav selections updated
 - [backbone.localstorage](https://github.com/jeromegn/Backbone.localStorage) to utilize local storage
 - [spin.js](http://spin.js.org/) for loading spinner

## Notes
- [ ] Rate == Ratio

## Todo

- [ ] Range (popup) is the confidence interval
- [ ] Add commas to number displays that may have a thousands place
- [ ] As of e8182fc it doesn't load the hospital view page from the direct URL unless it's already stored in web storage... how to fix?
- [ ] Figure out what's wrong with `processhtml` grunt task and add it back in
- [ ] ssihyst uses procedures instead of patient days, fix it
- [ ] trigger selection of cdiff rather than setting it as default all over the place
