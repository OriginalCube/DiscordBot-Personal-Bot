require('dotenv').config();
var jsonData = require('./details.json');
const {Client, Intents, MessageEmbed} = require('discord.js');
const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const mongoose = require('mongoose');
const dbURI = process.env.dbURI; 
const schema = require('./schema.js');
const notificationSchema = require('./notificationSchema.js');

client.on('ready', ()=>{//Checks if the bot works
	console.log('Ready to use');
});


client.on('messageCreate', async (res)=>{//Reads message sent and reads the value if command is used
	const message = res.content; 	
	if(message[0]!=='$'){return;}
	const command = message.split(' ');
	//Register Account help 
	if(message==='$register help'){//Sends commands for help '$register'
		const fetchJson = jsonData.help;	
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(fetchJson.title)
			.setDescription(fetchJson.description)
			.setImage(fetchJson.image);
		res.channel.send({embeds: [embed]});
	}

	await mongoose.connect(//Connect to DB
		dbURI, {keepAlive : true}
	);	

	if(command[0]==='$account' && command[1] === 'create'){//Create account and sends it to db. (username and userid)
		if(command[2]!== null){
			await new schema ({username: command[2], userid: res.author.id}).save();
			res.author.send(`This is your account details: \n Username: ${command[2]} \n UserID: ${res.author.id}`)
				.then((res) => {//asd
					setTimeout(() => res.delete(),10000)
				}).catch(console.error)//send and delete message when successfull
		}
	}

	if(command[0]==='$account' && command[1]==='details'){//Reads data from db that has the accounts
		schema.findOne({userid: res.author.id})
			.then((response) => res.author.send(`Your username: ${response.username}` + 
				`\nYour userID: ${response.userid}` + 
			'\nThis message will delete itself take a screenshot if needed')
				.then((res)=>{setTimeout(()=> res.delete(), 10000)}));
	}

	if(command[0]==='$set' && command[1]==='help'){//Sends help command for '$set'
		fetchJson = jsonData.notes;	
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Command: set help')
			.setDescription(fetchJson.help)
			.setImage(fetchJson.image);
		res.channel.send({embeds: [embed]});
}

	if(command[0]==='$set' && command[1]==='note' && command[2]!==null){
		let title = '';
		let description = '';
		let notes = false;
		let noteid = 0;	
		for(let i=2; i<=command.length && notes===false; i++){
			noteid = i	
			command[i]!=='<>'? title += ' ' + command[i]: notes = true;	
		}
		for(let i=noteid+1; i!=command.length; i++){
			description += ' ' + command[i];
		}
		await new notificationSchema({title: title, details: description, userid: res.author.id }).save();
	  res.channel.send('Title of note:' + title + '\nDescription:' + description
		+ '\n auto delete 10s').then((res)=>setTimeout(()=>res.delete(), 10000));
	}

	if(command[0]==='$set' && command[1]==='view'){
 			notificationSchema.find({userid: res.author.id})
			.then((response) => response.map((info)=>res.author.send(`Title: ${info.title}\nDetails:${info.details}`))) 
	}

});
client.login(process.env.DISCORD_TOKEN);

