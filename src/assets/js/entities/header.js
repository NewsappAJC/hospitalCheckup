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
      {name: "Home", url: ""},
      {name: "Infections", url: "infections"},
      {name: "Surgery", url: "hipsknees"},
      {name: "Labor and Delivery", url: "perinatal"}
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