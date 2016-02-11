HospitalCheckup.module("Common.Chart", function(Chart, HospitalCheckup, Backbone, Marionette, $, _){

  //all the common elements that all list charts in hospital app will share
  Chart.BarBase = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      this.options.bar_padding = options.bar_padding || 4;
      this.options.section = options.section || "infections";
      this.options.stat = options.stat || "ratio";
      this.duration = 500;
      this.easing = "sin-in-out"; // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
      //this.bar_height = (this.dimensions.height / this.collection.length) - this.options.bar_padding;
      this.bar_height = 16; //TODO perinatal collection is much smaller and don't have a way to make it consistent right now
      this.$chart_container.attr('id', this.el.id+"-container");
      //set up axis and label formatters
      if(options.section === "surgery"){
        this.formatter = function(){ return function(d){ return d + "%" }; };
      } else if (options.chartType === "BarLeft"){
        this.formatter = function(isAxis){ return this.get_format(this.options.measure, isAxis); };
      }
      return this;
    },
    draw: function() {
      var data = this.filter_data(this.data);
      this.get_scales(data);
      this.create_axis("x", "bottom"); //super
      this.create_axis("y", "left"); //super
      this.create_svg(); //super
      this.create_svg_containers();
      this.draw_base_bars(data);
      this.draw_data(data);
      this.draw_axes(data); //needs to be on top of bars
    },

    //remove items with no data and sort by stat
    filter_data: function(){
      var chart = this,
      section = chart.options.section,
      measure = chart.options.measure,
      chartType = chart.options.chartType,
      stat = chart.options.stat;

      var filtered = chart.data.filter(function(d){
        if(chartType === "BarRangeDot"){
          return d[section][measure].na != 1;
        }
        return !isNaN(d[measure]);
      });
      filtered.sort(function(a,b){
        if(chartType === "BarRangeDot"){
          return d3.ascending(a[section][measure][stat], b[section][measure][stat]);
        }
        return d3.ascending(a[measure], b[measure]);
      });
      return filtered;
    },

    get_xMax: function(data){
      var chart = this;
      if(chart.options.measure.indexOf("pct") >= 0){
        return 100;
      }
      return d3.max(data, function(d) {
        if(chart.nested){ //check if data nested inside another array
          return d[chart.nested][chart.options.measure].upper
        }
        return d[chart.options.measure];
      });
    },

    get_currentHeight: function(data){
      return (this.options.bar_padding + this.bar_height) * data.length;
    },

    get_scales: function(data) {
      var chart = this;
      chart.yScale = d3.scale.ordinal()
        .rangeBands([0, chart.get_currentHeight(data)])
        .domain(_.map(data, function(d) { return d.display_name; }));

      chart.xScale = d3.scale.linear()
        .rangeRound([0, chart.dimensions.width])
        .domain([0, chart.get_xMax(data)])
        .nice(); //extend bounds to nearest round value
    },

    create_svg_containers: function(ids){
      var chart = this;

      for(var i=0; i<ids.length; i++){
        chart.svg.append("g").attr("id", ids[i]);
      }
    },

    draw_base_bars: function(data) {
      var chart = this;
      var bars = chart.svg.select("#baseBars").selectAll(".base.bar")
        .data(data);
        //.data(data, function(d){ return d.id; });

      bars.exit().transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 0).remove();

      bars.enter().append("rect")
        .attr("class", "base bar")
        .style("opacity", 0)
        .attr("y", function(d) {
          return chart.yScale(d.display_name);
        })
        .attr("width", chart.dimensions.width)
        .attr("height", chart.bar_height);

      bars.transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 1);

    },

    draw_axes: function(data) {
      var chart = this,
      section = chart.options.section;

      if(chart.formatter){
        var format = chart.formatter(true);
        chart.xAxis.tickFormat(function(d){ return format(d); });
      }

      //create and set x axis position
      chart.svg.select("#axes").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.get_currentHeight(data) + ")")
        .call(chart.xAxis);

      //create and set y axis positions
      var gy = chart.svg.select("#axes").append("g")
        .attr("class", "y axis")
        .attr("y", 6)
        .call(chart.yAxis);
    },

    draw_context_lines: function(data){
      var chart = this;

      chart.defs = d3.select(chart.el).select("svg").append('svg:defs');
      chart.linesToMark = [{ id: "average", scale: function(){ return HospitalCheckup.Entities.averages.get(chart.options.measure) }, label: "State avg.", anchorDefault: "start"}];
      if(chart.options.section === "infections"){ chart.linesToMark.push({ id: "national", scale: function(){ return 1 }, label: "Benchmark", anchorDefault: "end" }) }
      else if (chart.options.section === "surgery"){ chart.linesToMark.push({ id: "national", scale: function(){ return HospitalCheckup.Entities.averages.get("national")[chart.options.measure] }, label: "National avg.", anchorDefault: "end" })};

      chart.contextLines = chart.svg.select("#contextLines");

      chart.contextLines.selectAll("line")
      .data(chart.linesToMark)
      .enter()
      .append("line")
        .attr("y1", -15) //extend it up to the label
        .attr("id", function(d){ return d.id + "Line"; })
        .attr("marker-start", function(d){ return "url(#"+d.id+"Line_marker)"; });

      chart.contextLines.selectAll("text.chart-label")
        .data(chart.linesToMark)
        .enter()
        .append("text")
        .attr("class", "chart-label")
        .attr("id", function(d){ return d.id+"Txt"; });

      chart.markers = chart.defs.selectAll("marker")
        .data(chart.linesToMark)
        .enter()
        .append('svg:marker')
        .attr('id', function(d){ return d.id+"Line_marker"; })
        .attr('markerHeight', 3)
        .attr('markerWidth', 3)
        .attr('markerUnits', 'strokeWidth')
        .append('svg:path')
        .attr('d', "M0,5l2.5-5L5,5H0z");

      this.transition_context_lines(data);
    },

    transition_context_lines: function(data){
      var chart = this,
      height = chart.get_currentHeight(data),
      chartType = chart.options.chartType;
      if(chartType === "BarRangeDot"){
        var state = chart.linesToMark[0].scale(),
        national = chart.linesToMark[1].scale();
      }

      chart.contextLines.selectAll("line")
        .transition().duration(chart.duration)
        .attr("y2", height)
        .attr("x1", function(d){ return chart.xScale(d.scale()); })
        .attr("x2", function(d){ return chart.xScale(d.scale()); });

      chart.contextLines.selectAll("text.chart-label")
        .transition().duration(chart.duration)//.ease(chart.easing)
        .text(function(d){
          var label = d.label,
          val = d.scale();
          if(chart.formatter){
            var format = chart.formatter(false);
            val = format(val);
          }
          label = label + " ("+val+")";
          return label;
        })
        .attr("text-anchor", function(d){
          return get_text_anchor(d);
        })
        .attr("x", function(d){
          var plusminus = function(){ //which side of the anchor needs padding
            if(get_text_anchor(d) === "start"){
              return 1;
            }
            return -1;
          };
          return chart.xScale(d.scale())+(10*plusminus());
        })
        .attr("y", -7);

      chart.defs.selectAll("marker")
        .attr('orient', function(d, i){ //which direction should the arrow point
          if(get_text_anchor(d) === "start"){
            return 90;
          }
          return 270;
        })
        .attr('refX', function(d){ //this moves it up and down like it's y because of marker orientation
          if( get_text_anchor(d) === "start"){
            return 0;
          } 
          return 5;
        })
        .attr('refY', 5)
        .attr('viewBox', "0 0 5 5")
        .select("path")
          .attr("fill", function(d){ return $("#"+d.id+"Line").css("stroke"); });

      function get_text_anchor(d){
        if(national){
          if(state < national){
            if(d.anchorDefault === "start"){
              return "end";
            }
            return "start";
          } else if(d.anchorDefault === "start"){
            return "start";
          }
          return "end";
        }
        return d.anchorDefault;
      }
    },

    draw_data: function(data){
      return this;
    },

    onUpdateChart: function(filtered){
      var chart = this,
      height = chart.get_currentHeight(filtered);

      //update scales and axes
      chart.xScale.domain([0, chart.get_xMax(filtered)]).nice();
      chart.xAxis.scale(chart.xScale);

      chart.svg.select("#axes").selectAll(".x.axis")
        .transition().duration(chart.duration)
        .ease(chart.easing)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("transform", "translate(0," + height + ")")
        .call(chart.xAxis);

      chart.yScale.rangeBands([0, height]).domain(_.map(filtered, function(d) { return d.display_name; }));

      chart.svg.select("#axes").selectAll(".y.axis")
        .transition().duration(chart.duration)
        .ease(chart.easing)
        .call(chart.yAxis);

      chart.draw_base_bars(filtered);
      chart.onSelectHospital(chart.selected);
      chart.transition_context_lines(filtered);
    },

    onSelectHospital: function(label){
      d3.selectAll(".y.axis text").classed("active", function(d){
        return d === label;
      });
      this.selected = label; //store it so we can check for it when new labels enter
    },

    set_tooltip: function(chart, obj, measure){
      obj.on("mouseover", function(d) {
        chart.attach_tooltip(d, measure);
      })
      .on("mouseout", function() {
        $("#ttip").remove();
      });
    },

    attach_tooltip: function(data, measure) {
      if(this.options.chartType === "BarLeft"){
        if(data.measure !== measure){ //don't re-process it on subsequent hovers
          data.label = HospitalCheckup.Entities[this.options.entityID+"Labels"].findWhere({ key: measure }).get("label");
          var format = this.get_format(measure);
          data.formatted = format(data[measure]);
        }
      }
      data.measure = measure; //template needs access
      var tmpl = _.template($("#"+this.options.section+"-tooltip-template").html());
      var tt = $(tmpl(data));
      tt.css("top", (parseFloat(d3.event.layerY - 15)) + "px");
      tt.css("left", (parseFloat(d3.event.layerX + 25)) + "px");
      this.$el.append(tt);
    }
  });

  Chart.BarRangeDot = Chart.BarBase.extend({
    constructor: function(options) {
      this.nested = options.section; //data is nested inside this.section
      Chart.BarBase.apply(this, arguments);
      return this;
    },

    //create containers so that entering items stay layered at the correct depth
    create_svg_containers: function(ids){
      var ids = ["baseBars", "rangeBars", "axes", "contextLines", "statCircles"];

      Chart.BarBase.prototype.create_svg_containers.call(this, ids);
    },

    draw_data: function(data){
      this.draw_range_bars(data);
      this.draw_context_lines(data);
      this.draw_stat_circles(data);
    },

    draw_range_bars: function(data){
      var chart = this,
      measure = chart.options.measure,
      section = chart.options.section;

      var rangeBars = chart.svg.select("#rangeBars").selectAll(".range.bar")
        .data(data, function(d){ return d.id; });

      rangeBars.exit().transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 0).remove();

      rangeBars.enter()
      .append("rect")
      .attr("class", "range bar")
        .style("opacity", 0)
      .attr("x", function(d) {
        return chart.xScale(d[section][measure].lower);
      })
      .attr("y", function(d) {
        return chart.yScale(d.display_name);
      })
      .attr("width", function(d){
        return chart.xScale(d[section][measure].upper - d[section][measure].lower);
      })
      .attr("height", chart.bar_height);
      chart.set_tooltip(chart, rangeBars, measure);

      //update
      rangeBars.transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 1)
        .attr("x", function(d) {
          return chart.xScale(d[section][measure].lower);
        })
        .attr("y", function(d) {
          return chart.yScale(d.display_name);
        })
        .attr("width", function(d){
          return chart.xScale(d[section][measure].upper - d[section][measure].lower);
        })
        .each(function(d){
          var ratingClasses = {"normal": false, "good": false, "bad": false};
          ratingClasses[d[section][measure].ratingClass] = true;
          d3.select(this).classed(ratingClasses);
        });
    },

    draw_stat_circles: function(data){
      var chart = this,
      measure = chart.options.measure,
      section = chart.options.section,
      stat = chart.options.stat;

      var circles = chart.svg.select("#statCircles").selectAll(".stat-circle")
        .data(data, function(d){ return d.id; });

      circles.exit().transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 0).remove();

      circles.enter().append("circle")
        .style("opacity", 0)
        .attr("class", "stat-circle")
        .attr("cx", function(d) {
          return chart.xScale(d[section][measure][stat]);
        })
        .attr("cy", function(d) {
          return chart.yScale(d.display_name)+chart.bar_height/2;
        })
        .attr("r", 6);
        chart.set_tooltip(chart, circles, measure);

      //update
      circles.transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 1)
        .attr("cx", function(d) {
          return chart.xScale(d[section][measure][stat]);
        })
        .attr("cy", function(d) {
          return chart.yScale(d.display_name)+chart.bar_height/2;
        });
    },

    onUpdateChart: function(criterion){
      this.options.measure = criterion;
      var chart = this,
      filtered = chart.filter_data();

      Chart.BarBase.prototype.onUpdateChart.call(this, filtered); //am I doing this right?

      chart.draw_range_bars(filtered);
      chart.draw_stat_circles(filtered);
    }
  });

  Chart.BarLeft = Chart.BarBase.extend({
    constructor: function(options) {
      Chart.BarBase.apply(this, arguments);
      return this;
    },

    create_svg_containers: function(){
      var ids = ["baseBars", "bars", "axes", "contextLines"]

      Chart.BarBase.prototype.create_svg_containers.call(this, ids);
    },

    get_format: function(measure, isAxis){
      if(measure.indexOf("charge") >= 0){
        if(isAxis){
          return d3.format("$s");
        }
        return d3.format("$,");
      } else if (measure.indexOf("pct") >= 0){
        return function(d){ return d + "%" }; //the normal d3.format("%") will also multiply it by 100
      } else if (measure.indexOf("total") >= 0){
        if(isAxis){
          return d3.format("s");
        }
        return d3.format(",");
      } else {
        return function(string){ return string }
        console.log("no matching format");
      }
    },

    draw_data: function(data){
      this.draw_context_lines(data);
      this.draw_bars(data);
    },

    draw_bars: function(data){
      var chart = this,
      measure = chart.options.measure;

      var bars = chart.svg.select("#bars").selectAll(".bar")
        .data(data, function(d){ return d.id; });

      bars.exit().transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 0).remove();

      bars.enter()
      .append("rect")
      .attr("class", "bar normal")
        .style("opacity", 0)
      .attr("x", 0)
      .attr("y", function(d) {
        return chart.yScale(d.display_name);
      })
      .attr("width", function(d){
        return chart.xScale(d[measure]);
      })
      .attr("height", chart.bar_height);
      chart.set_tooltip(chart, bars, measure);

      //update
      bars.transition().duration(chart.duration)
        .ease(chart.easing)
        .style("opacity", 1)
        .attr("x", 0)
        .attr("y", function(d) {
          return chart.yScale(d.display_name);
        })
        .attr("width", function(d){
          return chart.xScale(d[measure]);
        });
    },

    onUpdateChart: function(criterion){
      this.options.measure = criterion;
      var chart = this,
      filtered = chart.filter_data();

      chart.xAxis.tickFormat(chart.get_format(criterion, true));
      Chart.BarBase.prototype.onUpdateChart.call(chart, filtered); //am I doing this right?

      chart.draw_bars(filtered);
    }
  });

  Chart.HospitalDetail = ChartBaseView.extend({
    constructor: function(options) {
      ChartBaseView.apply(this, arguments);
      return this;
    },
    draw: function(){
      this.get_scales(this.data);
      this.create_axis("x", "bottom"); //super
      this.create_svg(); //super
      this.draw_axes(this.data);
      this.draw_data();
    },

    get_scales: function(data) {
      this.xScale = d3.scale.linear()
        .rangeRound([0, this.dimensions.width])
      .domain([0, d3.max([data.predicted, data.observed])])
        .nice(); //extend bounds to nearest round value
    },

    draw_axes: function(data) {
      //create and set x axis position
      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.dimensions.height + ")")
        .call(this.xAxis);
    },

    draw_data: function(){
      this.draw_lines("predicted");
      this.draw_lines("observed");
    },

    draw_lines: function(str){
      var num = this.data[str],
      chart = this;

      this.svg.append("line")
        .attr("class", str)
        .attr("y1", 0)
        .attr("y2", this.dimensions.height)
        .attr("x1", this.xScale(num))
        .attr("x2", this.xScale(num));

      this.svg.append("text").text(d3.round(num, rounder(num)))
      .attr("class", str+" chart-label txt")
      .attr("text-anchor", "middle")
      .attr("x", this.xScale(num))
      .attr("y", function(){
        //if the lables might overlap, bump up the predicted one
        if(str==="observed" | Math.abs(chart.xScale(num) - chart.xScale(chart.data.observed)) >= 21){
          return -5;
        }
        return -18;
      });

      //round display text relative to its value
      function rounder(num){
        if (num > .1){
          return 1;
        } else if (num > .01){
          return 2;
        } else {
          return 3;
        }
      }
    }
  });
});