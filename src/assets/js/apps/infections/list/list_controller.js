HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(){
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingInfections = HospitalCheckup.request("infection:entities");

      var infectionsListLayout = new List.Layout();
      var infectionsListMenu = new List.Menu();

      $.when(fetchingInfections).done(function(infections){
        var infectionsListView = new List.Infections({
          collection: infections
        });

        infectionsListLayout.on("show", function(){
          infectionsListLayout.menuRegion.show(infectionsListMenu);
          infectionsListLayout.listRegion.show(infectionsListView);
        });

        infectionsListView.on("childview:infection:show", function(childView, model){
          HospitalCheckup.trigger("infection:show", model.get("id"));
        });

        HospitalCheckup.regions.main.show(infectionsListLayout);
      });
    }
  }
});