HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){
  Entities.Header = Backbone.Model.extend({
    initialize: function(){
      Backbone.Select.Me.applyTo(this);
    }
  });

  Entities.HeaderCollection = Backbone.Collection.extend({
    model: Entities.Header,

    initialize: function(models, options){
      Backbone.Select.One.applyTo(this, models, options);
    }
  });

  var initializeHeaders = function(){
    Entities.headers = new Entities.HeaderCollection([
      {name: "Home", url: "", navigationTrigger: "home:show"},
      {name: "Infections", url: "infections", navigationTrigger: "infections:list", icon: "infection.svg"},
      {name: "Hip & Knee Surgery", url: "surgery", navigationTrigger: "surgeries:list", icon: "surgery.svg"},
      {name: "Labor & Delivery", url: "perinatal", navigationTrigger: "perinatal:list", icon: "perinatal.svg"},
      {name: "ER wait times", url: "er", navigationTrigger: "er:list", icon: "er.png"}
    ]);
  };

  var API = {
    getHeaders: function(){
      if(Entities.headers === undefined){
        initializeHeaders();
      }
      return Entities.headers;
    }
  };

  HospitalCheckup.reqres.setHandler("header:entities", function(){
    return API.getHeaders();
  });
});