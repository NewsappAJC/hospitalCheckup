HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(){
      var fetchingInfections = HospitalCheckup.request("infection:entities");

      $.when(fetchingInfections).done(function(infections){
        var infectionsListView = new List.Infections({
          collection: infections
        });

        infectionsListView.on("childview:infection:show", function(childView, model){
          HospitalCheckup.trigger("infection:show", model.get("id"));
        });

        HospitalCheckup.regions.main.show(infectionsListView);
      });
    }
  }
});