HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){
  Entities.FilteredCollection = function(options){
    //this is based on the Filtering Contacts exercise on p.247 of Backbone Marionette: A Gentle Introduction by David Sulc
    var original = options.collection;
    var filtered = new original.constructor();
    filtered.add(original.models);
    filtered.filterFunction = options.filterFunction;

    var applyFilter = function(filterCriterion, filterStrategy, collection){
      var collection = collection || original;
      var criterion = filterCriterion;
      var filterFunction = filtered.filterFunction(criterion);
      var items = collection.filter(filterFunction);

      //store current criterion
      filtered._currentCriterion = criterion;

      return items
    };

    filtered.filter = function(filterCriterion){
      filtered._currentFilter = "filter";
      var items = applyFilter(filterCriterion, "filter");

      //reset the filtered collection with the new items
      filtered.reset(items);
      return filtered;
    };

    filtered.where = function(filterCriterion){
      filtered._currentFilter = "where";
      var items = applyFilter(filterCriterion, "where");

      //reset the filtered collection with the new items
      filtered.reset(items);
      return filtered;
    };

    //if the original collection is reset, the filtered collection
    //will re-filter itself and end up with the new filtered result set
    original.on("reset", function(){
      var items = applyFilter(filtered._currentCriterion, filtered._currentFilter);
      //reset the filtered collection with the new items
      filtered.reset(items);
    });

    return filtered;
  };
});