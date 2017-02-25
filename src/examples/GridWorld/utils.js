export let calcCoords = function(x, y, height, width) {
    // the 6 numbers that define the coordinates of 5 points in side each
    // square, useful for e.g. drawing triagles corresponding to Q values at
    // each state
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
    // based on the value, calculate the corresponding RGB color
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

    return {red: r, green: g, blue: b};
}

export let genRGBColorString = function(val) {
    let rgbColor = calcRGBColor(val);
    return 'rgb(' +
        Math.floor(rgbColor.red) + ',' +
        Math.floor(rgbColor.green) + ',' +
        Math.floor(rgbColor.blue) + ')';
}
