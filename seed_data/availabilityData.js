'use strict';

var today = new Date();
var dates = [];
for (var i = 0; i < 30; ++ i) {
  var d = new Date();
  d.setDate(today.getUTCDate() + i);
  var ds = `${d.getUTCFullYear()}-`;
  ds += d.getUTCMonth() + 1 < 10 ? `0${d.getUTCMonth() + 1}-` : `${d.getUTCMonth() + 1}-`;
  ds += d.getUTCDate() < 10 ? `0${d.getUTCDate()}` : `${d.getUTCDate()}`;
  dates.push(ds);
}

var availabilityData = {
  name: 'Availability',
  data: [
    // Freelancer 1
    { day : `${dates[0]}T00:00:00Z`, begin : `${dates[0]}T00:00:00Z`, end : `${dates[0]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[1]}T00:00:00Z`, begin : `${dates[1]}T00:00:00Z`, end : `${dates[1]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[2]}T00:00:00Z`, begin : `${dates[2]}T00:00:00Z`, end : `${dates[2]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[3]}T00:00:00Z`, begin : `${dates[3]}T00:00:00Z`, end : `${dates[3]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[4]}T00:00:00Z`, begin : `${dates[4]}T00:00:00Z`, end : `${dates[4]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[5]}T00:00:00Z`, begin : `${dates[5]}T00:00:00Z`, end : `${dates[5]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[6]}T00:00:00Z`, begin : `${dates[6]}T00:00:00Z`, end : `${dates[6]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[7]}T00:00:00Z`, begin : `${dates[7]}T00:00:00Z`, end : `${dates[7]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[8]}T00:00:00Z`, begin : `${dates[8]}T00:00:00Z`, end : `${dates[8]}T12:00:00Z`, location : `Acquarossa` },
    { day : `${dates[9]}T00:00:00Z`, begin : `${dates[9]}T00:00:00Z`, end : `${dates[9]}T12:00:00Z`, location : `Acquarossa` },
    // Freelancer 2
    { day : `${dates[0]}T00:00:00Z`, begin : `${dates[0]}T08:00:00Z`, end : `${dates[0]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[1]}T00:00:00Z`, begin : `${dates[1]}T08:00:00Z`, end : `${dates[1]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[2]}T00:00:00Z`, begin : `${dates[2]}T08:00:00Z`, end : `${dates[2]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[3]}T00:00:00Z`, begin : `${dates[3]}T08:00:00Z`, end : `${dates[3]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[4]}T00:00:00Z`, begin : `${dates[4]}T08:00:00Z`, end : `${dates[4]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[5]}T00:00:00Z`, begin : `${dates[5]}T08:00:00Z`, end : `${dates[5]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[6]}T00:00:00Z`, begin : `${dates[6]}T08:00:00Z`, end : `${dates[6]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[7]}T00:00:00Z`, begin : `${dates[7]}T08:00:00Z`, end : `${dates[7]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[8]}T00:00:00Z`, begin : `${dates[8]}T08:00:00Z`, end : `${dates[8]}T20:00:00Z`, location : `Bodio` },
    { day : `${dates[9]}T00:00:00Z`, begin : `${dates[9]}T08:00:00Z`, end : `${dates[9]}T20:00:00Z`, location : `Bodio` },
    // Freelancer 3
    { day : `${dates[0]}T00:00:00Z`, begin : `${dates[0]}T12:00:00Z`, end : `${dates[0]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[1]}T00:00:00Z`, begin : `${dates[1]}T12:00:00Z`, end : `${dates[1]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[2]}T00:00:00Z`, begin : `${dates[2]}T12:00:00Z`, end : `${dates[2]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[3]}T00:00:00Z`, begin : `${dates[3]}T12:00:00Z`, end : `${dates[3]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[4]}T00:00:00Z`, begin : `${dates[4]}T12:00:00Z`, end : `${dates[4]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[5]}T00:00:00Z`, begin : `${dates[5]}T12:00:00Z`, end : `${dates[5]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[6]}T00:00:00Z`, begin : `${dates[6]}T12:00:00Z`, end : `${dates[6]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[7]}T00:00:00Z`, begin : `${dates[7]}T12:00:00Z`, end : `${dates[7]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[8]}T00:00:00Z`, begin : `${dates[8]}T12:00:00Z`, end : `${dates[8]}T23:59:00Z`, location : `Sorengo` },
    { day : `${dates[9]}T00:00:00Z`, begin : `${dates[9]}T12:00:00Z`, end : `${dates[9]}T23:59:00Z`, location : `Sorengo` }
  ]
}
module.exports = availabilityData;
