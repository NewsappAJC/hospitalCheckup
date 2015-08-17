HospitalCheckup.module("Common.Chart", function(Chart, HospitalCheckup, Backbone, Marionette, $, _){
  Chart.BarBase = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      this.options.bar_padding = options.bar_padding || 4;
      this.$chart_container.attr('id', 'infections-chart-container');
      return this;
    },
    draw: function() {
      this.get_scales();
      this.create_axes();
      this.create_svg();
      this.draw_bars();
      this.draw_axes();//needs to be on top of bars
    },

    get_xMax: function(){
      var chart = this;
      return d3.max(chart.data, function(d) { return d.infections[chart.options.measure].upper });
    },

    get_scales: function() {
      var chart = this;
      

      chart.yScale = d3.scale.ordinal()
        .rangeBands([0, chart.dimensions.height])
        .domain(_.map(chart.data, function(d) { return d.display_name; }));

      chart.xScale = d3.scale.linear()
        .rangeRound([0, chart.dimensions.width])
        .domain([0, chart.get_xMax()])
        .nice(); //extend bounds to nearest round value
    },

    create_axes: function() {
      var chart = this;

      chart.xAxis = d3.svg.axis()
        .scale(chart.xScale)
        .orient("bottom");

      chart.yAxis = d3.svg.axis()
        .scale(chart.yScale)
        //.ticks(( $(chart.el).width() <= 550 )? 5:9 )
        .orient("left");
    },

    create_svg: function() {
      var chart = this;

      //create new svg for the bar chart
      chart.svg = d3.select(chart.el).append("svg")
        .attr("width", chart.dimensions.wrapperWidth)
        .attr("height", chart.dimensions.wrapperHeight)
        .attr("class", "chart")
      .append("g")
        .attr("transform", "translate(" + chart.options.margin.left + ", " + chart.options.margin.top + ")");
    },

    draw_bars: function() {
      var chart = this;

      chart.svg.selectAll("rect")
        .data(chart.data)
          .enter()
          .append("rect")
            .attr("class", "base bar")
            //.attr("text-anchor", "middle")
            /*.attr("x", function(d) {
              return chart.xScale(d.infections[d.measure].upper);
            })*/
            .attr("y", function(d) {
              return chart.yScale(d.display_name);
            })
            .attr("width", chart.dimensions.width)
            .attr("height", function(d) {
              return (chart.dimensions.wrapperHeight / chart.data.length) - chart.options.bar_padding; //-4 for padding between bars
              //return chart.dimensions.height - chart.yScale(d[chart.options.y_key]) - 1;
            })
    },

    draw_axes: function() {
      var chart = this;

      //create and set x axis position
      chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.dimensions.height + ")")
        //.attr("text-anchor", "middle")
        .call(chart.xAxis);

      //create and set y axis positions
      var gy = chart.svg.append("g")
        .attr("class", "y axis")
        .attr("y", 6)
        .call(chart.yAxis);
    },

    onUpdateChart: function(criterion){
      var chart = this;

      chart.options.measure = criterion;
      chart.xScale.domain([0, chart.get_xMax()]).nice();
      chart.xAxis.scale(chart.xScale);
      
      chart.svg.selectAll(".x.axis")
        .transition().duration(500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(chart.xAxis);
    }
  });
});