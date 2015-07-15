HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(){
      var infections = HospitalCheckup.request("infection:entities");

      var infectionsListView = new List.Infections({
        collection: infections
      });

      HospitalCheckup.regions.main.show(infectionsListView);
    }
  }

});