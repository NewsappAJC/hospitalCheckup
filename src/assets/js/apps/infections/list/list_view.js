HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Layout = Marionette.LayoutView.extend({
    template: "#section-layout",
    className: "large-12 columns",
    regions: {
      introRegion: "#section-intro-region",
      menuRegion: "#filter-menu-region",
      listRegion: "#main-chart-region",
      hospitalRegion: "#hospital-show-region"
    },
    onRender: function(){
      console.log("RENDER LAYOUT");
    }
  });

  List.Intro = Marionette.ItemView.extend({
    template: "#section-intro-template",
    initialize: function(options){
      var options = options || {};
      this.headline = options.headline || "Headline",
      this.intro_text = options.intro_text || "intro text"
    },

    serializeData: function(){
      return {
        headline: this.headline,
        intro_text: this.intro_text
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

  List.InfectionsChart = Marionette.ItemView.extend({
    template: "#main-chart-template",
    behaviors: {
      HospitalSelect:{
        event: "hospital:change"
      }
    }
  });
});