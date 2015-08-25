HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){

  Show.MissingHospital = Marionette.ItemView.extend({
    template: "#missing-hospital-view"
  });

  Show.Hospital = Marionette.ItemView.extend({
    template: "#hospital-view",
    onDomRefresh: function(){ //render won't work because we need our parent template to render the #hospital-charts div
      //add hospital charts to Show.Hospital's child #hospital-charts
      var dataArr = [];

      //we need unnamed, top-level objects for the collection
      _.each(this.model.get("infections"), function(values, key, collection){
        values.measure = key; //TODO need the full name
        var detail = new Backbone.Model(values);
        dataArr.push(detail);
      });

      var chartCollection = new Backbone.Collection(dataArr);

      var charts = new Show.HospitalChartList({
        collection: chartCollection
      }).render();
    }
  });

  Show.HospitalChart = Marionette.ItemView.extend({
    template: "#hospital-chart-template"
  });

  Show.HospitalChartList = Marionette.CollectionView.extend({
    el: "#hospital-charts",
    childView: Show.HospitalChart
  })
});