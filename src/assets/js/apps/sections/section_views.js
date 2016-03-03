HospitalCheckup.module("SectionsApp.Section", function(Section, HospitalCheckup, Backbone, Marionette, $, _){

  Section.Layout = Marionette.LayoutView.extend({
    template: "#section-layout",
    regions: {
      headlineRegion: "#section-headline-region",
      introRegion: "#section-intro-region",
      menuRegion: "#filter-menu-region",
      legendRegion: "#legend-region",
      listRegion: "#main-chart-region",
      hospitalRegion: "#hospital-show-region",
      bottomRegion: "#bottom-region"
    },
    onShow: function(){
      $(".authentication-change").toggleClass("homepage", false); //css class to make it white on homepage
    }
  });

  Section.TextBlock = Marionette.ItemView.extend({
    template: "#text-block-template",
    initialize: function(options){
      this.text = this.buildHTML();
    },
    buildHTML: function(){
      var options = this.options;
      if(options.entityID === "ER"){
        var labels = HospitalCheckup.Entities[options.entityID + "Labels"],
        card_html = "<ul class='small-block-grid-1 medium-block-grid-1 large-block-grid-4' data-equalizer data-equalizer-mq='medium-up'>";
        labels.each(function(label){
          card_html += "<li><div class='small-card row' data-equalizer-watch><div class='small-2 medium-1 large-12 columns'><img src='assets/img/er_icons/" + label.get("key") + ".png' class='thumbnail' alt=''></div><div class='small-10 medium-11 large-12 columns'><p><strong>" + label.get("label") + "</strong>: " + label.get("full") + "</p></div></div></li>";
        })
        card_html += "</ul>";
        return options.text + card_html;
      }
      return options.text;
    },
    templateHelpers: function(){
      return {
        text: this.text
      }
    }
  });

  Section.Menu = Marionette.ItemView.extend({
    template: "#filter-menu-template",
    tagName: "select",
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

  Section.Legend = Marionette.ItemView.extend({
    template: "#main-legend",
    templateHelpers: function(){
      return {
        label: this.options.label,
        dot_label: this.options.dot
      }
    }
  });

  Section.MainChart = Marionette.ItemView.extend({
    template: "#main-chart-template",
    behaviors: {
      HospitalSelect:{
        event: "hospital:change"
      }
    }
  });

  Section.MobileRangeDotRow = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#mobile-rangedot-tr-template",
    templateHelpers: function () {
      return {
        format: function(num, stat){
          if(stat === "rate"){
            return d3.round(num, 2)+"%";
          }
          return d3.round(num, 2);
        },
        measure: this.options.measure,
        section: this.options.section,
        stat: this.options.stat
      };
    }
  });

  Section.MobileRangeDotList = Marionette.CompositeView.extend({
    tagName: "table",
    className: "columns",
    id: "mobile-list",
    template: "#mobile-rangedot-table-template",
    childView: Section.MobileRangeDotRow,
    childViewContainer: "tbody",
    childViewOptions: function(model, index) {
      //only the BarRangeDot charts actually need or know section and stat
      return { measure: this.options.measure, section: this.options.section, stat: this.options.stat }
    },
    filter: function(child, index, collection){
      //don't show items with null ratios
      if(this.options.section === "infections" || this.options.section === "surgery"){
        return !child.get(this.options.section)[this.options.measure].na
      }
      return !isNaN(child.get(this.options.measure));
    },
    onFilter: function(criterion){
      this.options.measure = criterion;
      this.children.each(function(view){
        view.model.set("measure", criterion);
      });
      this.render();
    },
    templateHelpers: function () {
      return {
        stat: this.options.stat
      }
    }
  });

  Section.MobileBarRow = Marionette.ItemView.extend({
    tagName: "tr",
    template: "#mobile-bar-tr-template",
    templateHelpers: function(){
      return {
        format: function(num, measure){ //TODO make a behavior out of this, using it in chart too
          var formatter;
          if(measure.indexOf("charge") >= 0){
            formatter = d3.format("$,")
          } else if (measure.indexOf("pct") >= 0){
            formatter = function(d){ return d + "%" } //the normal d3.format("%") will also multiply it by 100
          } else if (measure.indexOf("total") >= 0){
            formatter = d3.format(",");
          } else {
            formatter = function(string){ return string };
          }
          return formatter(num);
        },
        //recieved from childViewOptions, template needs it
        measure: this.options.measure
      }
    }
  });

  Section.MobileBarList = Section.MobileRangeDotList.extend({
    template: "#mobile-bar-table-template",
    childView: Section.MobileBarRow,
    templateHelpers: function () {
      return {
        measure: this.options.measure,
        entityID: this.options.entityID
      };
    }
  });
});