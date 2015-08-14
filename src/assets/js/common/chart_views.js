HospitalCheckup.module("Common.Charts", function(Charts, HospitalCheckup, Backbone, Marionette, $, _){
  Charts.Bar = ChartBaseView.extend({
    constructor: function() {
      ChartBaseView.apply(this, arguments);
      this.$chart_container.attr('id', 'infections-chart-container');
      return this;
    },
    draw: function() {
      /*var chart = this;
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
            .html(function(d) { return '<span>' + d.display_name + '</span>'; });*/
      this.get_scales();
      this.create_axes();
      this.create_svg();
      this.draw_bars();
    },
    get_scales: function() {
      var chart = this;

      chart.yScale = d3.scale.ordinal()
        .rangeBands([chart.dimensions.height, 0], 0.4, 0.01);

      chart.xScale = d3.scale.linear()
        .range([0, chart.dimensions.width]);

      var xMax = d3.max(chart.data, function(d) { return d.infections[d.measure].upper });

      //set x and y scale values to map to the svg size
      //chart.xScale.domain([0, chart.options.x_scale_max]);
      chart.xScale.domain([0, xMax]);
      chart.yScale.domain();_.map(chart.data, function(d) { return d.yr; })
    },

    create_axes: function() {
      var chart = this;

      chart.xAxis = d3.svg.axis()
        .scale(chart.xScale)
        /*.tickFormat(function(d) {
          if ( d > 1990 && d !== 1995 && d !== 2000 && d !== 2005 && d !== 2010 )
            return chart.formatNumber(d).replace(/^(19|20)/g, "'");
          return chart.formatNumber(d);
        })*/
        .orient("bottom");

      /*if ($(chart.el).width() <= 550)
        chart.xAxis.tickValues([1995, 2000, 2005, 2010]);*/

      chart.yAxis = d3.svg.axis()
        .scale(chart.yScale)
        .tickSize(chart.dimensions.wrapperWidth)
        .ticks(( $(chart.el).width() <= 550 )? 5:9 )
        .orient("right");

      /*chart.yAxis.tickFormat(function(d) {
        return "$" + chart.formatCommas(d);
      });*/
    },

    create_svg: function() {
      var chart = this;
      //create new svg for the bar chart
      chart.svg = d3.select(chart.el).append("svg")
        .attr("width", chart.dimensions.wrapperWidth)
        .attr("height", chart.dimensions.wrapperHeight)
        .attr("class", "chart")
      .append("g")
        .attr("transform", "translate(" + chart.options.margin.left + ", 20)");

      //create and set x axis position
      chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.dimensions.height + ")")
        .attr("text-anchor", "middle")
        .call(chart.xAxis);

      //create and set y axis positions
      var gy = chart.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-50, 0)")
        .attr("y", 6)
        .call(chart.yAxis);

      gy.selectAll("g")
        .filter(function(d) { return d; })
        .classed("minor", true);

      gy.selectAll("text")
        .attr("x", 4)
        .attr("dy", -4);

    },

    draw_bars: function() {
      var chart = this;
      //console.log(this);
      chart.svg.selectAll("rect")
       .data(chart.data)
         .enter()
         .append("rect")
           .attr("class", "bar")
           .attr("text-anchor", "middle")
           .attr("x", function(d) {
             return chart.xScale(d.infections[d.measure].upper);
           })
           .attr("y", function(d) {
             return chart.yScale(d.display_name);
           })
           .attr("width", chart.xScale.range[1])
           .attr("height", function(d) {
             return chart.dimensions.wrapperHeight / 5
             //return chart.dimensions.height - chart.yScale(d[chart.options.y_key]) - 1;
           });
    }
  });
});