HospitalCheckup.module("LoadingApp", function(LoadingApp, HospitalCheckup, Backbone, Marionette, $, _){
  LoadingApp.Controller = {
    createSpinner: function() {
      HospitalCheckup.loadingView = new LoadingApp.Spin.Spinner();
      HospitalCheckup.regions.loadingRegion.show(HospitalCheckup.loadingView);
    },
    showSpinner: function() {
      HospitalCheckup.loadingView.$el.show();
    },
    hideSpinner: function() {
      HospitalCheckup.loadingView.$el.hide();
    }
  }
});