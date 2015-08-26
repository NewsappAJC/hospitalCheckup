HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){

  Show.MissingHospital = Marionette.ItemView.extend({
    template: "#missing-hospital-view"
  });

  Show.Hospital = Marionette.ItemView.extend({
    template: "#hospital-view",
    initialize: function(){
      this.chartCollection = new Backbone.Collection();
      this.charts = new Show.HospitalChartList({
        collection: this.chartCollection
      });
    },
    onDomRefresh: function(){ //render won't work because we need our parent template to render the #hospital-charts div
      //add hospital charts to Show.Hospital's child #hospital-charts
      this.charts.setElement(this.$('#hospital-charts')).render(); //which child element to render view in
      this.chartCollection.reset(this.get_hospital_models(this.model), {silent: true}); //silent bc it was initializing view twice
    },
    get_hospital_models: function(model){
      var dataArr = [];

      //we need unnamed, top-level objects for the collection
      _.each(this.model.get("infections"), function(values, key, collection){
        values.measure = key; //TODO need the full name
        var detail = new Backbone.Model(values);
        dataArr.push(detail);
      });
      return dataArr;
    }
  });

  Show.HospitalChart = Marionette.ItemView.extend({
    template: "#hospital-chart-template"
  });

  Show.HospitalChartList = Marionette.CollectionView.extend({
    el: "#hospital-charts",
    childView: Show.HospitalChart
  });
});