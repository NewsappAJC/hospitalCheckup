HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showHospital: function(id, view){ //received URL with ID parameter, or selected from viz

      var fetchingHospital = HospitalCheckup.request("hospital:entity", id);
      $.when(fetchingHospital).done(function(hospital){
        if(hospital !== undefined){
          view.model = hospital;
        } else {
           //we should only end up here if someone goes to a URL 
          //with an ID that none of our hospitals have (that shouldn't happen);
          view = new Show.MissingHospital();
        }

        view.render();
      });
    }
  }
});