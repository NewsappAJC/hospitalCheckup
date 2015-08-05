HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Layout = Marionette.LayoutView.extend({
    template: "#infections-list-layout",

    regions: {
      menuRegion: "#infections-menu-region",
      listRegion: "#infections-list-region"
    }
  });

  List.Menu = Marionette.ItemView.extend({
    template: "#infections-menu-template",

    events: {
      //TODO I read something about IE8 not really firing change event http://www.bentedder.com/backbone-change-events-on-select-menus/
      "change #js-infections-filter-criterion": "filterInfections"
    },

    filterInfections: function(e){
      e.preventDefault();
      var criterion = $(e.currentTarget).val();
      this.trigger("infections:filter", criterion);
    }

  });

  List.Infection = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#infection-list-item",
    triggers: {
      "click td .js-show": "infection:show"
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