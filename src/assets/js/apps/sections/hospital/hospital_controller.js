HospitalCheckup.module("SectionsApp.Hospital", function(Hospital, HospitalCheckup, Backbone, Marionette, $, _){
  Hospital.Controller = {
    showHospital: function(id, aboutView, measuresView, defaultModel){ //received URL with ID parameter

      if(id){
        if(!aboutView.model || aboutView.model.get("id") !== id){ //if the view is empty or the model has changed i.e. unless selected item clicked again
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
        if(measuresView.collection){
          measuresView.collection.reset(measuresView.get_hospital_models(model)); //collection will rerender itself when model is reset
        } else {
          measuresView.model = model;
          measuresView.render();
        }
        aboutView.render();
        Marionette.triggerMethodOn(HospitalCheckup.module("SectionsApp.Section.chartView"), "select:hospital", model.get("display_name")); //add active class to chart hospital label
      }
    }
  }
});