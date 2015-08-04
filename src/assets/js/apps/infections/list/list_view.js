HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Infection = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#infection-list-item",

      events: {
        "click .js-show": "showClicked"
      },
      showClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger("infection:show", this.model);
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