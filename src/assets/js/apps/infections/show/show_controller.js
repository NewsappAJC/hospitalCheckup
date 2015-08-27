HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showHospital: function(id, aboutView, chartsView){ //received URL with ID parameter, or selected from viz

      var fetchingHospital = HospitalCheckup.request("hospital:entity", id);
      $.when(fetchingHospital).done(function(hospital){
        if(hospital !== undefined){
          aboutView.model = hospital;
          chartsView.collection.reset(chartsView.get_hospital_models(hospital));
        } else {
           //we should only end up here if someone goes to a URL 
          //with an ID that none of our hospitals have (that shouldn't happen);
          aboutView = new Show.MissingHospital();
        }

        aboutView.render();
        chartsView.render();
      });
    }
  }
});