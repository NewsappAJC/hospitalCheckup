HospitalCheckup.module("HeaderApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){
  List.Header = Marionette.ItemView.extend({
    template: "#header-link",
    tagName: "li"
  });

  List.Headers = Marionette.CompositeView.extend({
    template: "#header-template",
    //className: "",
    childView: List.Header,
    childViewContainer: "ul#nav"
  });
});