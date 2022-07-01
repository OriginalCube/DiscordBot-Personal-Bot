const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	username : {
		type: String,
		required: true
	},
	userid :{
		type: String,
		required: true
	}
})

module.exports = mongoose.model('account', schema);
