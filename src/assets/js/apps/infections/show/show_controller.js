HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Controller = {
    showHospital: function(id, view){ //received URL with ID parameter

      var fetchingInfection = HospitalCheckup.request("infection:entity", id);
      $.when(fetchingInfection).done(function(infection){
        if(infection !== undefined){
          view.model = infection;
        } else {
           //we should only end up here if someone goes to a URL 
          //with an ID that none of our hospitals have (that shouldn't happen);
          view = new Show.MissingHospital();
        }

        view.render();
      });
    },

    changeHospital: function(model, view){ //hospitalSelected
      view.model = model;
      view.render();
    }
  }
});