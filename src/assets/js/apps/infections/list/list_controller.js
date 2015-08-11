HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(criterion){
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
          collection: filteredInfections
        });
        var hospitalShowView = new HospitalCheckup.InfectionsApp.Show.Hospital({model: filteredInfections.models[0]});

        infectionsListLayout.on("show", function(){
          infectionsListLayout.menuRegion.show(infectionsMenuView);
          infectionsListLayout.listRegion.show(infectionsListView);
          infectionsListLayout.hospitalRegion.show(hospitalShowView);
        });

        infectionsListView.on("childview:infection:show", function(childView, args){
          //HospitalCheckup.trigger("infection:show", args.model.get("id"));
          hospitalShowView.model = args.model;
          hospitalShowView.render();
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