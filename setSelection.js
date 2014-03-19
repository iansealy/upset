function plotSetSelection() {
    var cellDistance = 20;
    var cellSize = 18;
    var w = 120;
    var headerHeight = 40;
    var setHeight = sets.length * cellDistance
    var h = setHeight + headerHeight;

    var truncateAfter = 25;

    d3.select('#setSelect').select('svg').remove();
    var svg = d3.select('#setSelect').append('svg').attr('width', w)
        .attr('height', h);

    svg.append('text').text('Choose Sets').attr({
        transform: 'translate(0, 20)'
    });

    var setRowScale = d3.scale.ordinal().rangeRoundBands([ headerHeight, h ], 0);
    setRowScale.domain(sets.map(function (d) {
        return d.id;
    }));

    var setGrp = svg.selectAll('.setRow')
        .data(sets)
        .enter()
        .append('g')
        .attr({transform: function (d, i) {
            return 'translate(0, ' + setRowScale(d.id) + ')';
            //  return 'translate(0, ' + ( cellDistance * (i)) + ')';
        },
            class: 'setRow'});

    setGrp.append('rect').attr({
        class: 'setSelectBackground',
        width: w,
        height: cellSize,
        fill: function (d) {
            if (d.isSelected)
                return '#d3d3d3';
            else
                return '#ffffff';
        }


//            transform: function (d, i) {
//                return 'translate(' + (cellDistance * (i ) + cellDistance / 2) + ',' + (setMatrixHeight + textHeight - textSpacing) + ')rotate(270)';
//            }

    }).on('click', setClicked);

    setGrp.append('text').text(
        function (d) {
            return d.elementName.substring(0, truncateAfter);
        }).attr({
            class: 'groupLabel',
            id: function (d) {
                return d.elementName.substring(0, truncateAfter);
            },

            y: cellSize - 3,
            x: 3,
            'font-size': cellSize - 4

//            transform: function (d, i) {
//                return 'translate(' + (cellDistance * (i ) + cellDistance / 2) + ',' + (setMatrixHeight + textHeight - textSpacing) + ')rotate(270)';
//            }

        }).on('click', setClicked);

    function setClicked(d) {
        console.log(d);
        updateSetContainment(d);        
        console.log(d.elementName + ": " + d.isSelected);
    }
}

function plotSetOverview() {

    var majorPadding = 5;
    var minorPadding = 2;
    var cellDistance = 20;
    var cellSize = cellDistance;// - minorPadding;
    var setCellDistance = 12;
    var setCellSize = 10;
    var textHeight = 60;

    d3.selectAll(".visOverview").remove();

    var overview = d3.select('#vis').select('svg').append("g").attr({
        class: "visOverview",
        "transform": "translate(" + 0 + "," + 0 + ")"
    })

/*
    overview.append('rect')
        .attr({
            class: 'overviewBackground',
            width:700,
            height:200
          });
*/
    overview.on('mouseover', function(d, i) {

          if(d3.selectAll(".bulkCheck")[0].length>0)
            return;

            usedSets.filter(function(d, ii) {

              d3.select('#vis').select('svg')
                .append("foreignObject")
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "bulkCheck")
                .attr("y", 40)
                .attr("x", function(d, i) {
                  return cellDistance * (ii);
                })
                .html("<form><input type=checkbox id=check checked/></form>")
                .on("click", function(d, i){
                    console.log(svg.select("#check").node().checked);
                });

            })

             unusedSets.filter(function(d, ii) {

              d3.select('#vis').select('svg')
                .append("foreignObject")
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "bulkCheck")
                .attr("y", 40)
                .attr("x", function(d, i) {
                  return cellDistance * (ii) + usedSets.length * cellDistance;
                })
                .html("<form><input type=checkbox id=check/></form>")
                .on("click", function(d, i){
                    console.log(svg.select("#check").node().checked);
                });

            })

             d3.select('svg')
                .append("foreignObject")
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "bulkCheck")
                .attr("y", 40)
                .attr("x", function(d, i) {
                  return (unusedSets.length + usedSets.length) * cellDistance;
                })
                .html("<form><input type=button value=update /></form>")
                .on("click", function(d, i){
                    console.log(svg.select("#check").node().checked);
                });
        })
        .on('mouseout', function(d, i) {
            mouseoutColumn(d, i);
            d3.selectAll(".bulkCheck").transition().duration(1500).remove();
        })

    var formLabels = overview.append("g").attr("class", "usedSets");

    var usedSetsLabels = overview.append("g").attr("class", "usedSets").selectAll('.setLabel')
        .data(usedSets)
        .enter();

    // ------------------- set size bars --------------------

    // scale for the size of the subSets, also used for the sets
    var setSizeScale = d3.scale.linear().domain([0, d3.max(sets, function (d) {
        return d.setSize;
    })]).nice().range([0, textHeight]);

    usedSetsLabels
        .append('rect')
        .attr({
            class: 'setSizeBackground',
            transform: function (d, i) {
                return 'translate(' + (cellDistance * (i )) + ', 60)'
            }, // ' + (textHeight - 5) + ')'
            height: textHeight,
            width: cellSize//setRowScale.rangeBand()
        })
        .on('click', setClicked)
        .on('mouseover', function(d, i) {
            mouseoverColumn(d, i);

        })
        .on('mouseout', function(d, i) {
            mouseoutColumn(d, i);
        })


    // background bar
    usedSetsLabels
        .append('rect')
        .attr({
            class: 'setSize',
            transform: function (d, i) {
                return 'translate(' + (cellDistance * (i )) + ', ' + ( textHeight - minorPadding - setSizeScale(d.setSize) + 60) + ')'
            }, // ' + (textHeight - 5) + ')'
            height: function (d) {
                return setSizeScale(d.setSize);
            },
            width: cellSize//setRowScale.rangeBand()
        })
      //  .attr("transform", "skewX(45)")
        .on('mouseover', mouseoverColumn)
        .on('mouseout', mouseoutColumn)
        .on('click', setClicked)

    var unusedSets = sets.filter(function(n) {
        return usedSets.indexOf(n) == -1
    });

    var truncateAfter = 15;

    var xScale = d3.scale.ordinal()
        .domain(d3.range(unusedSets.length))
        .rangeRoundBands([0, unusedSets.length+cellSize], 0.05); 

    var sortSets = function (a, b) {
        return b.setSize - a.setSize;
    };

        
    var unusedSetsLabels =  overview.append("foreignObject")
        .attr("width", 710)
        .attr("height", 200)
        .attr("x", usedSets.length*cellSize)
      .append("xhtml:div")
        .style("overflow-x", "scroll")
        .append("svg")
        .attr({
            height: textHeight*2,
            width: unusedSets.length*cellSize
        })
        .append("g")
        .attr("class", "unusedSets")
        .selectAll('.unsedSetsLabel')
        .data(unusedSets)
        .enter();

    unusedSetsLabels
            .append('rect')
            .sort(sortSets)
            .attr({
                class: 'unusedSetSizeBackground',
                transform: function (d, i) {
                    return 'translate(' + (cellDistance * (i )) + ', 60)'
                },
                height: textHeight,
                width: cellSize
            })
            .on('click', setClicked)

    // background bar
    unusedSetsLabels
        .append('rect')
        .sort(sortSets)
        .attr({
            class: 'unusedSetSize',
            transform: function (d, i) {
                return 'translate(' + (cellDistance * i) + ', ' + ( textHeight - minorPadding - setSizeScale(d.setSize) + 60) + ')'
            }, // ' + (textHeight - 5) + ')'
            height: function (d) {
                return setSizeScale(d.setSize);
            },
            width: cellSize
        })
       // .on('mouseover', mouseoverColumn)
       // .on('mouseout', mouseoutColumn)
        .on('click', setClicked)

    unusedSetsLabels
        .append('text').text(
          function (d) {
              return d.elementName.substring(0, truncateAfter);
          })
        .sort(sortSets)
        .attr({
            class: 'setLabel',
            id: function (d) {
                return d.elementName.substring(0, truncateAfter);
            },
                transform: function (d, i) {
                    return 'translate(' + (cellDistance * (i + 1) + 5) + ', 115) rotate(90)'
                },
            y: cellSize - 3,
            x: 3,
            'text-anchor': 'end'

//            transform: function (d, i) {
//                return 'translate(' + (cellDistance * (i ) + cellDistance / 2) + ',' + (setMatrixHeight + textHeight - textSpacing) + ')rotate(270)';
//            }
      })
      .on('click', setClicked)

    function setClicked(d, i) {
        updateSetContainment(d);        
        console.log(d.elementName + ": " + d.isSelected);
        d3.selectAll(".bulkCheck").filter(function(dd, ii) {
          if(ii==i)
            return d;
        }).attr('checked', d.isSelected);
    }


}