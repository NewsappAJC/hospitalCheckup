HospitalCheckup.module("LoadingApp.Spin", function(Spin, HospitalCheckup, Backbone, Marionette, $, _){
  Spin.Spinner = Marionette.ItemView.extend({
    template: "#loading-template",
    id: 'spinner'
  });
});