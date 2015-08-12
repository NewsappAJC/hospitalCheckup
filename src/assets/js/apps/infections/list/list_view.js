HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Layout = Marionette.LayoutView.extend({
    template: "#infections-list-layout",

    regions: {
      menuRegion: "#infections-menu-region",
      listRegion: "#infections-list-region",
      hospitalRegion: "#hospital-show-region"
    },
    onRender: function(){
      console.log("RENDER LAYOUT");
    }
  });

  List.Menu = Marionette.ItemView.extend({
    template: "#infections-menu-template",

    events: {
      //TODO I read something about IE8 not really firing change event http://www.bentedder.com/backbone-change-events-on-select-menus/
      "change #js-infections-filter-criterion": "filterInfections" //looks like this broke the menu's display updating
    },

    ui: {
      criterion: "#js-infections-filter-criterion"
    },

    filterInfections: function(e){
      e.preventDefault();
      var criterion = $(e.currentTarget).val();
      this.trigger("infections:filter", criterion);
    },

    onSetFilterCriterion: function(criterion){
      var el = this.ui.criterion; //in case no filter has been selected yet we'll need the default
      el.val(criterion || el.val());
    }

  });

  List.Infection = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#infection-list-item",
    triggers: {
      "click td .js-show": "infection:change"
    }
  });

  List.Infections = Marionette.CompositeView.extend({
    tagName: "table",
    className: "columns",
    template: "#infection-list",
    childView: List.Infection,
    childViewContainer: "tbody"
  });
});