import * as d3 from 'd3';


export let genRGBColorString = function(val) {
        let rgbColor = this.calcRGBColor(val);
        return 'rgb(' +
               Math.floor(rgbColor.red) + ',' +
               Math.floor(rgbColor.green) + ',' +
               Math.floor(rgbColor.blue) + ')';
}


export let calcCoords = function(x, y, height, width) {
    /* the 6 numbers that define the coordinates of 5 points in side each
       square, useful for e.g. drawing triagles corresponding to Q values at
       each state */
    let xmin = x * width;
    let ymin = y * height;
    let xmax = (x + 1) * width;
    let ymax = (y + 1) * height;
    let xmid = (x + 0.5) * width;
    let ymid = (y + 0.5) * height;
    return {xmin:xmin, ymin:ymin,
            xmid:xmid, ymid:ymid,
            xmax:xmax, ymax:ymax};
}


export let calcRGBColor = function(val) {
    /* based on the value, calculate the corresponding RGB color */

    let scaler = 1000;
    let r, g, b;
    if (val > 0) {
        r = 255 - val * scaler;
        g = 255;
        b = 255 - val * scaler;
    } else if (val === 0) {
        r = 255;
        g = 255;
        b = 255;
    }
    if (val < 0) {
        r = 255;
        g = 255 + val * scaler;
        b = 255 + val * scaler;
    }

    /* console.debug(r, g, b);*/
    return {red: r, green: g, blue: b};
}


export let highlightState = function(context, state,
                   {fillColor=null, fillOpacity=1, strokeColor='black', strokeWidth=0}={}) {
        let coords = state.coords;
        let line = d3.svg.line()
                     .x(function(d) { return d[0]; })
                     .y(function(d) { return d[1]; });

        let that = this;
        context.append('path')
               .attr("d", line([
                   [coords.xmin, coords.ymin],
                   [coords.xmax, coords.ymin],
                   [coords.xmax, coords.ymax],
                   [coords.xmin, coords.ymax],
                   [coords.xmin, coords.ymin]
               ]))
               .style('class', 'highlightFrame')
               .style('stroke', strokeColor)
               .style('stroke-width', strokeWidth)
               .style('fill', fillColor)
               .style('fill-opacity', fillOpacity)
               .style('cursor', 'pointer')
               .on('click', function() {
                   that.handleMouseClick(this, state);
               });
}

