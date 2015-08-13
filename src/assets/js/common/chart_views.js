HospitalCheckup.module("Common.Charts", function(Charts, HospitalCheckup, Backbone, Marionette, $, _){
  Charts.Bar = ChartView.extend({
    constructor: function() {
      ChartView.apply(this, arguments);
      this.$chart_container.attr('id', 'infections-chart-container');
      return this;
    },
    draw: function() {
      var chart = this;
      var xMax = d3.max(this.data, function(d){ return d.infections[d.measure].upper});
      var scale = d3.scale.linear()
        .domain([0, xMax])
        .range([0, this.dimensions.width]);

      d3.select(this.el)
        .attr('class', 'bar-chart')
          .selectAll('div')
            .data(this.data)
          .enter().append('div')
            .style('width', function(d) { return scale(d.infections[d.measure].upper) + 'px'; })
            .style('height', (this.dimensions.wrapperHeight / 5) + 'px')
            .html(function(d) { return '<span>' + d.display_name + '</span>'; });
    }
  });
});