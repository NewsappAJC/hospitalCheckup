HospitalCheckup.module("SectionsApp.Hospital", function(Hospital, HospitalCheckup, Backbone, Marionette, $, _){

  Hospital.Layout = Marionette.LayoutView.extend({
    template: "#hospital-layout",
    className: "large-12 columns",
    regions: {
      topRegion: "#hospital-top-region",
      legendRegion: "#hospital-region-1",
      measuresRegion: "#hospital-region-2"
    }
  });

  Hospital.Info = Marionette.ItemView.extend({
    template: "#hospital-info-view",
    className: "hospital-info"
  });

  Hospital.InfectionLegend = Marionette.ItemView.extend({
    template: "#hospital-legend-template",
    className: "hospital-info"
  });

  Hospital.InfectionItem = Marionette.ItemView.extend({
    template: "#hospital-infection-item-template",
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

  Hospital.Infection = Marionette.CollectionView.extend({
    template: "#empty-template",
    className: "hospital-list",
    childView: Hospital.InfectionItem,
    get_hospital_models: function(data){
      var dataArr = [];
      //we need unnamed, top-level objects for the collection
      _.each(data.get("infections"), function(values, key, collection){ //TODO do this on the model instead
        values.label = HospitalCheckup.Entities.InfectionLabels.findWhere({ key: key }).get("label"); //look up the display name for the current infection
        values.measure = key;
        dataArr.push(values);
      });
      return dataArr;
    }
  });

  Hospital.SurgeryItem = Marionette.ItemView.extend({
    template: "#hospital-surgery-item-template",
    className: "hospital-list-item"
  });

  Hospital.Surgery = Marionette.CollectionView.extend({
    template: "#empty-template",
    className: "hospital-list",
    childView: Hospital.SurgeryItem,
    get_hospital_models: function(data){ //can this be a behavior? used by Hospital.Surgery and Hospital.Infection
      var dataArr = [];
      _.each(data.get("surgery"), function(values, key, collection){
        values.measure = key;
        dataArr.push(values);
      });
      return dataArr;
    }
  });

  Hospital.Perinatal = Marionette.ItemView.extend({
    template: "#hospital-perinatal-template",
    className: "hospital-list hospital-list-item",
    templateHelpers: function () {
      return {
        formatMoney: function(num){
          var format = d3.format("$,");
          return format(num);
        },
        formatCommas: function(num){
          var format = d3.format(",");
          return format(num);
        }
      };
    }
  });

  Hospital.ER = Marionette.ItemView.extend({
    template: "#hospital-er-template",
    className: "hospital-list hospital-list-item",
    onRender: function(){
      //when new hospital is selected the view resets and needs tooltips re-added
      HospitalCheckup.addTips();
    },
    templateHelpers: function(){
      return {
        //don't label string values with units (i.e. avoid "Not Available minutes")
        checkNaN: function(val, label){
          if(isNaN(val)){
            return val
          }
          return val + label
        },
        getLabels: function(){
          return HospitalCheckup.Entities["ERLabels"];
        }
      }
    }
  });
});