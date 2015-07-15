HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Infection = Marionette.ItemView.extend({
    template: "#infection-list-item",

      events: {
        "click p": "alertDisplayName"
      },

      alertDisplayName: function(){
        alert(this.model.escape("display_name"));
      }
  });

  List.Infections = Marionette.CollectionView.extend({
    childView: List.Infection
  });
});