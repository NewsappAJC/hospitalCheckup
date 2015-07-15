HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Infection = Marionette.ItemView.extend({
    template: "#infection-list-item",

      events: {
        "click": "highlightName",
        "click button.js-delete": "deleteClicked",
        "click .js-show": "showClicked"
      },

      highlightName: function(e){
        //e.preventDefault();
        this.$el.toggleClass("panel callout");
      },
      deleteClicked: function(e){
        e.stopPropagation();
        this.trigger("infection:delete", this.model);
      },
      showClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger("infection:show", this.model);
        //alert(this.model.escape("display_name"));
      },
      remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
          Marionette.ItemView.prototype.remove.call(self);
        });
      }
  });

  List.Infections = Marionette.CollectionView.extend({
    /*tagName: "li",
    className: "someClass",*/
    childView: List.Infection,
    /*onChildviewInfectionDelete: function(){
      this.$el.fadeOut(1000, function(){
        $(this).fadeIn(1000);
      })
    }*/
  });
});