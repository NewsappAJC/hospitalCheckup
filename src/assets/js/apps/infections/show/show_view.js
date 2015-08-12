HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){

  Show.MissingHospital = Marionette.ItemView.extend({
    template: "#missing-hospital-view"
  });

  Show.Hospital = Marionette.ItemView.extend({
    template: "#hospital-view"
  });
});