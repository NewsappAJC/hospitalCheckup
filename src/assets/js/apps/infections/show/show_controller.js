HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showInfection: function(id){
      var infections = HospitalCheckup.request("infection:entities");
      var model = infections.get(id);
      var infectionView;
      if(model !== undefined){
        infectionView = new Show.Infection({
          model: model
        });
      } else {
        infectionView = new Show.MissingHospital();
      }

      HospitalCheckup.regions.main.show(infectionView);
    }
  }
});