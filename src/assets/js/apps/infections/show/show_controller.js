HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showInfection: function(id){
      var infections = HospitalCheckup.request("infection:entities");
      var model = infections.get(id);
      var infectionView = new Show.Infection({
        model: model
      });

      HospitalCheckup.regions.main.show(infectionView);
    }
  }
});