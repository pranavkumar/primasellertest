'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  username: String,
  seats: [Schema.Types.Mixed],
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Reservation', ReservationSchema);