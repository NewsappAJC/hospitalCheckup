HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Layout = Marionette.LayoutView.extend({
    template: "#section-layout",
    className: "large-12 columns",
    regions: {
      headlineRegion: "#section-headline-region",
      introRegion: "#section-intro-region",
      menuRegion: "#filter-menu-region",
      legendRegion: "#legend-region",
      listRegion: "#main-chart-region",
      hospitalRegion: "#hospital-show-region",
      bottomRegion: "#bottom-region"
    },
    onRender: function(){
      console.log("RENDER LAYOUT");
    }
  });

  List.TextBlock = Marionette.ItemView.extend({
    template: "#text-block-template",
    initialize: function(options){
      var options = options || {};
      this.text = options.text
    },

    serializeData: function(){
      return {
        text: this.text
      }
    }
  });

  List.Menu = Marionette.ItemView.extend({
    template: "#filter-menu-template",
    tagName: "select",
    initialize: function(options){
      this.options = options; //expecting `section`
    },
    id: "js-filter-criterion",

    events: {
      //TODO I read something about IE8 not really firing change event http://www.bentedder.com/backbone-change-events-on-select-menus/
      "change": "filterList" //looks like this broke the menu's display updating
    },

    filterList: function(e){
      e.preventDefault();
      var criterion = $(e.currentTarget).val();
      this.trigger(this.options.section+":filter", criterion);
    },

    onSetFilterCriterion: function(criterion){
      this.$el.val(criterion || this.$el.val());
    }
  });

  List.Legend = Marionette.ItemView.extend({
    template: "#main-legend"
  });

  List.MainChart = Marionette.ItemView.extend({
    template: "#main-chart-template",
    behaviors: {
      HospitalSelect:{
        event: "hospital:change"
      }
    }
  });

  List.MobileRow = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#mobile-tr-template",
    initialize: function(options){
      //recieved from childViewOptions, template needs it
      this.model.set("measure", options.measure);
    },
    templateHelpers: function () {
      return {
        clip: function(num){
          return d3.round(num, 2);
        }
      };
    }
  });

  List.MobileList = Marionette.CompositeView.extend({
    tagName: "table",
    className: "columns",
    id: "mobile-list",
    template: "#mobile-table-template",
    childView: List.MobileRow,
    childViewContainer: "tbody",
    initialize: function(options){
      this.measure = options.measure;
    },
    childViewOptions: function(model, index) {
      return { measure: this.measure }
    },
    filter: function(child, index, collection){
      //don't show items will null ratios
      return !child.get("infections")[this.measure].na
    },
    onFilter: function(criterion){//TODO update naming
      this.measure = criterion;
      this.children.each(function(view){
        view.model.set("measure", criterion);
      });
      this.render();
    }
  });
});