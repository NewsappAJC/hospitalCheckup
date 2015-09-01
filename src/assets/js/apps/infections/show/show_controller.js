HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showHospital: function(id, aboutView, chartsView, defaultModel){ //received URL with ID parameter

      if(id){
        if(!aboutView.model || aboutView.model.get("id") !== id){ //if the view is empty or the model has changed
          var fetchingHospital = HospitalCheckup.request("hospital:entity", id);
          $.when(fetchingHospital).done(function(hospital){
            if(hospital !== undefined){
              changeHospital(hospital);
            } else { //if we were passed an invalid hospital ID through the URL
              changeHospital(defaultModel);
            }
          });
        }
      } else { //no hospital ID URL parameter
        changeHospital(defaultModel);
      }

      function changeHospital(model){
        aboutView.model = model;
        chartsView.collection.reset(chartsView.get_hospital_models(model)); //collection will rerender itself when model is reset
        aboutView.render();
        Marionette.triggerMethodOn(HospitalCheckup.module("InfectionsApp.List.infectionsChartView"), "select:hospital", model.get("display_name")); //add active class to chart label
      }
    }
  }
});