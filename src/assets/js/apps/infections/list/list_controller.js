HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(){
      var infections = HospitalCheckup.request("infection:entities");

      var infectionsListView = new List.Infections({
        collection: infections
      });

      infectionsListView.on("childview:infection:delete", function(childView, model){
        infections.remove(model);
      });

      infectionsListView.on("childview:infection:show", function(childView, model){
        HospitalCheckup.trigger("infection:show", model.get("id"));
      });
      HospitalCheckup.regions.main.show(infectionsListView);
    }
  }

});