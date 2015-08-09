HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(criterion){
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingInfections = HospitalCheckup.request("infection:entities", criterion);

      var infectionsListLayout = new List.Layout();
      var infectionsMenuView = new List.Menu();

      $.when(fetchingInfections).done(function(infections, criterion){
        var infectionsListView = new List.Infections({
          collection: infections
        });

        infectionsListLayout.on("show", function(){
          infectionsListLayout.menuRegion.show(infectionsMenuView);
          infectionsListLayout.listRegion.show(infectionsListView);
        });

        infectionsListView.on("childview:infection:show", function(childView, args){
          HospitalCheckup.trigger("infection:show", args.model.get("id"));
        });

        infectionsMenuView.on("infections:filter", function(filterCriterion){
          HospitalCheckup.trigger("infections:filter", filterCriterion); 
        });

        HospitalCheckup.regions.main.show(infectionsListLayout);
      });
    }
  }
});