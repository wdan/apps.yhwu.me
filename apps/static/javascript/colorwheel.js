function drawOriginal() {
    var width = 600,
        height = 600,
        radius = Math.min(width, height) / 2;
    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);
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
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)) + 0.0025);
        })
        .innerRadius(270)
        .outerRadius(280);
    var data = {'name': 'name', 'children': []};
    for (var i = 0; i < 360; i++) {
        data['children'].push({'name': 'name'});
    }
    var partitioned = partition.nodes(data);
    var path = svg.selectAll('path')
        .data(partitioned)
        .enter().append('path')
        .attr('d', arc)
        .attr('stroke', 'none')
        .style('fill', function(d, i) {
            if (i == 0) {
                return 'white';
            } else {
                return 'hsl(' + i + ', 100%, 50%)';
            }
        });
}
function drawColorWheel(cwData) {
    d3.select('#colorwheel').remove();
    var width = 600,
        height = 600,
        radius = Math.min(width, height) / 2;
    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);
    var svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'colorwheel')
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
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)) + 0.0025);
        })
        .innerRadius(70)
        .outerRadius(function(d) {
            return 70 + 180 * (d.cnt) / (cwData.max);
        });
    var data = {'name': 'name', 'children': []};
    for (var i = 0; i < 360; i++) {
        data['children'].push({
            'name': 'name',
            'cnt': cwData.cnt[i],
            'h': i,
            's': cwData.s[i],
            'l': cwData.l[i]});
    }
    var partitioned = partition.nodes(data);
    var path = svg.selectAll('.shaft')
        .data(partitioned)
        .enter().append('path')
        .attr('attr', 'shaft')
        .attr('d', arc)
        .attr('stroke', 'none')
        .style('fill', function(d, i) {
            if (i == 0) {
                return 'white';
            } else {
                return 'hsl(' + d.h + ', ' + d.s + '%, ' + d.l + '%)';
            }
        });
}

function processImageData(imgData) {
    var imgColor = {};
    imgColor.h = [];
    imgColor.s = [];
    imgColor.l = [];
    var cnt = 0;
    for (var i = 0; i < imgData.data.length; i += 4) {
        var r = imgData.data[i];
        var g = imgData.data[i + 1];
        var b = imgData.data[i + 2];
        if (r == g && g == b)
            continue;
        var tHSL = rgb2hsl(r, g, b);
        imgColor.h[cnt] = tHSL[0];
        imgColor.s[cnt] = tHSL[1];
        imgColor.l[cnt] = tHSL[2];
        cnt++;
    }
    cwData = {};
    cwData.cnt = [];
    cwData.s = [];
    cwData.l = [];
    for (var i = 0; i < 360; i++) {
        cwData.cnt[i] = 0;
        cwData.s[i] = 0;
        cwData.l[i] = 0;
    }
    for (var i = 0; i < cnt; i++) {
        h = Math.round(imgColor.h[i]);
        if (h >= 360) {
            h = 0;
        }
        cwData.cnt[h] += 1;
        cwData.s[h] += imgColor.s[i];
        cwData.l[h] += imgColor.l[i];
    }
    var max = 0;
    for (var i = 0; i < 360; i++) {
        if (cwData.cnt[i] > max) {
            max = cwData.cnt[i];
        }
        cwData.s[i] = Math.round(cwData.s[i] / cwData.cnt[i] * 100);
        cwData.l[i] = Math.round(cwData.l[i] / cwData.cnt[i] * 100);
    }
    cwData.max = max;
    drawColorWheel(cwData);
}

function rgb2hsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

function loadImage(data) {
    var image = new Image();
    image.addEventListener('load', function() {
        var canvas = document.getElementById('image');
        canvas.width = canvas.width;
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        processImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }, false);
    image.src = data.target.result;
}

//drawOriginal();

$('#pic-button').change(function(src) {
    var f = src.target.files[0];
    var fr = new FileReader();
    fr.onload = loadImage;
    fr.readAsDataURL(f);
});
