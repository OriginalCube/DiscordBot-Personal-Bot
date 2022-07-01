const mongoose = require('mongoose');

const notifactionSchema = new mongoose.Schema({
	title : {
		type: String,
		required: true
	},	
	details : {
		type: String,
		required: true
	},
	userid : {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('notifications', notifactionSchema);
