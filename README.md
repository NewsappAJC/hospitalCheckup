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
- Rate == Ratio
- Range (popup) is the confidence interval
- "State Average" - I calculated national average (by state)... that's what we want right?

##Improvements on original hospital quality app
 - Active menu item is highlighted
 - filters have routes so you can bookmark a particular infection view
 - hospitals have routes too
 - nav sub-app to handle navigation and routes properly
 - infections have standardized attributes so you don't need to reset them to a hacky default
 - dropdown menu accurately reflects selected filter on refresh/navigate
 - state average no longer hard-coded into the view
 
## Todo
- [ ] Clear local storage on first load in case there's new stuff
- [ ] Add commas to number displays that may have a thousands place
- [ ] Figure out what's wrong with `processhtml` grunt task and add it back in
- [ ] ssihyst uses procedures instead of patient days, fix it
- [ ] trigger selection of cdiff rather than setting it as default all over the place
- [ ] fix filter URLs so you can provide multiple filter parameters (i.e. hospital and infection)
- [ ] If someone clicks on already active nav item it shouldn't reload the layout

##How to update
- open the "hospital_compare" table on the interanet data server (add new data if necessary)
- To update state totals, run `grunt sql_bakery`, which runs this query:
  `CREATE VIEW hospital_totals_web AS
  SELECT measure,AVG(score) FROM hai_state_20140523
  WHERE measure LIKE "HAI_%_SIR" AND score > 0
  GROUP BY measure`
- TODO add view for main data sets

