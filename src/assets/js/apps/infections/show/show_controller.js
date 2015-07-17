HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showInfection: function(model){
      var infectionView = new Show.Infection({
        model: model
      });
      HospitalCheckup.regions.main.show(infectionView);
    }
  }
});