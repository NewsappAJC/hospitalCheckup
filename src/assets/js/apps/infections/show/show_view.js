HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){
  Show.Infection = Marionette.ItemView.extend({
    template: "#infection-view"
  });
});