HospitalCheckup.module("InfectionsApp.Show", function(Show, HospitalCheckup, Backbone, Marionette, $, _){

  Show.HospitalLayout = Marionette.LayoutView.extend({
    template: "#hospital-layout",
    className: "large-12 columns",
    regions: {
      topRegion: "#hospital-top-region",
      legendRegion: "#hospital-region-1",
      chartRegion: "#hospital-region-2"
    }
  });

  Show.Hospital = Marionette.ItemView.extend({
    template: "#hospital-info-view",
    className: "hospital-info"
  });

  Show.Legend = Marionette.ItemView.extend({
    template: "#hospital-legend-template",
    className: "hospital-info"
  });

  Show.HospitalItem = Marionette.ItemView.extend({
    template: "#hospital-item-template",
    className: "hospital-list-item",
    onShow: function(){
      if(!this.model.get("na")){
        var detail = new HospitalCheckup.Common.Chart.HospitalDetail({
          el: "#"+this.model.get("measure")+"-chart",
          data: this.model.toJSON(),
          margin: {left: 15, right: 15, bottom: 25, top: 30},
          base_height: 70
        }).render();
      } else {
        this.$el.addClass("not-available");
      }
    }
  });

  Show.HospitalItemList = Marionette.CollectionView.extend({
    template: "#empty-template",
    className: "hospital-list",
    childView: Show.HospitalItem,
    initialize: function(options){ //TODO may or may not actually need this function outside infections app
      this.options = options; //expecting `section` and `labelArr`
    },
    get_hospital_models: function(data){
      var dataArr = [];
      var options = this.options;
      //we need unnamed, top-level objects for the collection
      _.each(data.get(options.section), function(values, key, collection){ //TODO do this on the model instead
        values.label = HospitalCheckup.Entities[options.labelArr+"Labels"].findWhere({ key: key }).get("label"); //look up the display name for the current infection
        values.measure = key; //TODO need the full name
        dataArr.push(values);
      });
      return dataArr;
    }
  });
});