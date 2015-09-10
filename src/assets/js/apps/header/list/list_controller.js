HospitalCheckup.module("HeaderApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){
  List.Controller = {
    listHeader: function(){
      var links = HospitalCheckup.request("header:entities");
      List.headers = new List.Headers({collection: links});

      List.headers.on("childview:navigate", function(childView, model){
        var trigger = model.get("navigationTrigger");
        HospitalCheckup.trigger(trigger);
      });

      //for mobile menu functionality
      List.headers.on("show", function(){$(document).foundation('topbar', 'reflow');})

      HospitalCheckup.regions.header.show(List.headers);
    },

    setActiveHeader: function(headerUrl){
      var links = HospitalCheckup.request("header:entities");
      var headerToSelect = links.find(function(header){
        return header.get("url") === headerUrl;
      });
      headerToSelect.select();
      links.trigger("reset");
    }
  };
});