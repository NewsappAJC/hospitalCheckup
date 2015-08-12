HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(id, criterion){
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingInfections = HospitalCheckup.request("infection:entities");

      var infectionsListLayout = new List.Layout();
      var infectionsMenuView = new List.Menu();

      $.when(fetchingInfections).done(function(infections){
        var filteredInfections = HospitalCheckup.Entities.FilteredCollection({
          collection: infections,
          filterFunction: function(criterion){
            return function(infection){
              infection.set({measure:criterion || "cdiff"}); //TODO better way to set default before menu renders?
              return infection;
            }
          }
        });
        var infectionsListView = new List.Infections({
          collection: filteredInfections.filter(criterion)
        });
        var hospitalShowView = new HospitalCheckup.InfectionsApp.Show.Hospital();

        if(id){ //if we were passed a hospital ID through the URL (i.e. bookmark)
          HospitalCheckup.trigger("hospital:show", id, hospitalShowView);
        } else { //use the first model in the list as a default
          hospitalShowView.model = filteredInfections.models[0];
          hospitalShowView.render();
        }

        infectionsListLayout.on("show", function(){
          infectionsListLayout.menuRegion.show(infectionsMenuView);
          infectionsListLayout.listRegion.show(infectionsListView);
          infectionsListLayout.hospitalRegion.show(hospitalShowView);
        });

        infectionsListView.on("childview:hospital:change", function(childview, args){
          HospitalCheckup.trigger("hospital:change", args.model, hospitalShowView);
        });

        infectionsMenuView.on("infections:filter", function(filterCriterion){
          HospitalCheckup.trigger("infections:filter", filterCriterion); //update routes
          filteredInfections.filter(filterCriterion); //update collection
        });

        infectionsMenuView.once("show", function(){ //TODO we only need to do this manually when user enters the page via a filter URL
          infectionsMenuView.triggerMethod("set:filter:criterion", criterion);
        });

        HospitalCheckup.regions.main.show(infectionsListLayout);
      });
    }
  }
});