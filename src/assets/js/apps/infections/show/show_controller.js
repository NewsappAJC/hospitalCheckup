HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showInfection: function(id){
      var fetchingInfection = HospitalCheckup.request("infection:entity", id);
      $.when(fetchingInfection).done(function(infection){
        var infectionView;
        if(infection !== undefined){
          infectionView = new Show.Infection({
            model: infection
          });
        } else {
          infectionView = new Show.MissingHospital();
        }
        HospitalCheckup.regions.main.show(infectionView);
      });
    }
  }
});