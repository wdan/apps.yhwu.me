function create_colorwheel() {
    var width = 500,
        height = 500,
        radius = Math.min(width, height) / 3;

    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]);

    var color = d3.scale.category20c();

    var svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + (height / 2 + 10) + ')');

    var partition = d3.layout.partition()
        .sort(null)
        .value(function(d) { return 5.8 - d.depth; });

    var arc = d3.svg.arc()
        .startAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        })
        .endAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

    var data = {'name': 'name', 'children': []};
    for (var i = 0; i < 360; i++) {
        data['children'].push({'name': 'name', 'color': i});
    }
    var partitioned = partition.nodes(data);
    var path = svg.selectAll('path')
        .data(partitioned)
        .enter().append('path')
        .attr('d', arc)
        .style('fill', function(d, i) {
            if (i == 0) {
                return 'white';
            } else {
                return 'hsl(' + i + ', 100%, 50%)';
            }
        });
}

$('#pic-button').change(function(src) {
    var f = src.target.files[0];
    var fr = new FileReader();
    fr.onload = function(data) {
        console.dir(data);
        $('#image').attr('src', data.target.result);
    };
    fr.readAsDataURL(f);
});

create_colorwheel();
