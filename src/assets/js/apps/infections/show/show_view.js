HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){

  Show.MissingHospital = Marionette.ItemView.extend({
    template: "#missing-hospital-view"
  });

  Show.HospitalLayout = Marionette.LayoutView.extend({
    template: "#hospital-layout",
    className: "large-12 columns",
    regions: {
      topRegion: "#hospital-top-region",
      chartRegion: "#hospital-chart-region"
    }
  });

  Show.Hospital = Marionette.ItemView.extend({
    template: "#hospital-view"
  });

  Show.HospitalChart = Marionette.ItemView.extend({
    template: "#hospital-chart-template"
  });

  Show.HospitalChartList = Marionette.CollectionView.extend({
    template: "#hospital-chart-holder",
    childView: Show.HospitalChart,
    get_hospital_models: function(data){
      var dataArr = [];

      //we need unnamed, top-level objects for the collection
      _.each(data.get("infections"), function(values, key, collection){
        values.measure = key; //TODO need the full name
        var detail = new Backbone.Model(values);
        dataArr.push(detail);
      });
      return dataArr;
    }
  });
});