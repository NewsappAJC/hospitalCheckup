HospitalCheckup.module("HomeApp.Home", function(Home, HospitalCheckup, Backbone, Marionette, $, _){
  Home.HomeView = Backbone.Marionette.ItemView.extend({
    template: "#homepage-template"
  });
});