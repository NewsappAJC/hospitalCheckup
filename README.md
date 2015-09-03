# Hospital Checkup
Explore hospital quality data for Atlanta area hospitals.

- Published: by Sept. 15!
- Lives here:
- Hosted here:

## Dependencies

 - [Node.js](https://nodejs.org/)
 - [Grunt CLI](http://gruntjs.com/getting-started)
 - [Bower](http://bower.io/)
 - [Sql-bakery](https://github.com/NewsappAJC/sql-bakery)
 
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
- Need to explain the benchmark is always 1

##Improvements on original hospital quality app
 - Active menu item is highlighted
 - filters have routes so you can bookmark a particular infection view
 - hospitals have routes too
 - nav sub-app to handle navigation and routes properly
 - infections have standardized attributes so you don't need to reset them to a hacky default
 - dropdown menu accurately reflects selected filter on refresh/navigate
 - state average no longer hard-coded into the view
 - Comma formatted patient days
 - selected hospital stays highlighted if it re-enters after exiting due to filters
 - Mobile hospital table much better looking!
 
## Todo
- [ ] Spell out infection names in infection bottom text
- [ ] Fix tooltips on tablets
- [ ] Figure out what's wrong with `processhtml` grunt task and add it back in
- [ ] trigger selection of cdiff rather than setting it as default all over the place
- [ ] fix filter URLs so you can provide multiple filter parameters (i.e. hospital and infection)
- [ ] If someone clicks on already active nav item it shouldn't reload the layout
- [ ] What if local storage is disabled?
- [ ] Option to keep hospitals in same order so you can compare how they rate across categories
- [ ] [Marionette.TemplateCache](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.templatecache.md) for faster rendering  using 

##How to update
- open the "hospital_compare" table on the interanet data server (add new data if necessary)
- To update:
  - upload new data to the database (Carrie or John usually does this)
  - make sure all views/tables specified in config/sql.json (should be "hospital_totals_web", "HAI_transposed", "hip_knee", "perinatal") are pointing to the updated dataset (parent table for hospital_totals_web definitely needs to be changed to reflect new date string) and queries referencing dates/years have been updated
  - run `grunt sql_bakery`
  - run py/organizeJSON.py to create the restructured JSON files

- Perinatal comes from AHQ database as well as hospital_compare. State level data is in AHQ and needs to be averaged manually.
