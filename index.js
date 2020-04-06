const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'Njk0ODQyMDc5OTAxMzg0NzM1.XouXVA.YIimsgsJ39FXKDfa0mx0j7g_zHI';
bot.login(token);

const command = new Discord.MessageEmbed();
	
//hlášky ke commandům
let radio = "Zapínám rádio...";
let stop = "Tato funkce prozatím není přidána";
let help = "\n-radio - Zapne rádio Evropy 2\n-help - Zobrazí všechny dostupné příkazy\n-play - Zahraje vám co chcete!\n-delete - Smaže zadaný počet zpráv(Jen pro Adminy)";
let url_validate = "Chybí URL adresa nebo je chybná!";

//stav bota při zapnutí
bot.on('ready', () =>{
	console.log('Bot je online');
	
	bot.user.setStatus("Online");
	
	bot.user.setActivity("Server",{type: "WATCHING"});
});

//ping pong
bot.on('message', message => {
  if (message.content === '-ping') {
    message.channel.send('pong');
  }
});

//hlasování
bot.on('message', message => {
  if (message.channel.id === "696813777013833729") {
	  let poolEmbed = new Discord.MessageEmbed()
	  .setTitle("Hlasování")
	  .setDescription("")
  }
});


//radio
bot.on('message', message => {
	const radio_fm = require("ytdl-core");
	const streamOptions = {
		seek: 0,
		volume: 1
	}
	if(message.content.toLowerCase() === "-radio"){
		let url_fm = "http://ice.actve.net/fm-evropa2-128";
			if (message.member.voice.channel) {
				const connection = message.member.voice.channel.join()
				.then(connection => {
				const dispatcher = connection.play(url_fm, streamOptions);
				message.channel.send(command.setColor('#028de3').setTitle("RÁDIO").setDescription(radio));
				bot.user.setActivity("Evropu 2",{type: "LISTENING"});
					})
				} 
			else {
				message.channel.send('Musíš být ve voicechatu!');
		}
}});


bot.on('message', msg => {
	if(msg.content === "-help"){
		msg.channel.send(command.setColor('#028de3').setTitle("HELP").setDescription(help));
	}
});


//join discord voicechat server
bot.on('message', async message => {
  if (!message.guild) return;

  if (message.content === '-join') {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.channel.send('Musíš být ve voicechatu!');
    }
  }
});

//disconect discord voicechat server
bot.on('message', async message => {
  if (!message.guild) 
	  return;

  if (message.content === '-leave') {
    if (message.member.voice.channel) {
      const disconnect = await message.member.voice.channel.leave();
	  bot.user.setActivity("Server", {type: "WATCHING"});
    } 
	else {
      message.channel.send('BOT se odpojil!');
    }
  }
});

//play music
bot.on('message', message => {
	const ytdl = require("ytdl-core");
	const streamOptions = {
		seek: 0,
		volume: 1
	}
	if(message.content.toLowerCase().startsWith("-play") || message.content.toLowerCase().startsWith("-šuldohraj")  || message.content.toLowerCase().startsWith("-zmrdehraj")){
		let args = message.content.split(" ");
		let url = args[1];
			if (message.member.voice.channel) {
				if (url == null){
					message.channel.send(command.setColor('#9c1111').setTitle("CHYBA").setDescription(url_validate));
				}
				else{
					const connection = message.member.voice.channel.join()
					.then(connection => {
						const stream = ytdl(url, {filter: 'audioonly'});
						const dispatcher = connection.play(stream, streamOptions) 
						.on("end",()=>{
							console.log("Písnička skončila"),
							voice.channel.leave()
						});
					})
				}
			} 
			else {
				message.channel.send('Musíš být ve voicechatu!');
		}
	}
});

//adolfeen play necum na me song
bot.on('message', message => {
	const ytdl = require("ytdl-core");
	const streamOptions = {
		seek: 0,
		volume: 1
	}
	if(message.content.toLowerCase().startsWith("-adolfeen")){
		let adolfeen_url = "https://www.youtube.com/watch?v=OuMbeT12Ccc";
			if (message.member.voice.channel) {
					const connection = message.member.voice.channel.join()
					.then(connection => {
						const stream = ytdl(adolfeen_url, {filter: 'audioonly'});
						const dispatcher = connection.play(stream, streamOptions) 
						.on("end",()=>{
							console.log("Písnička skončila"),
							voice.channel.leave()
						});
					})
				} 
			else {
				message.channel.send('Musíš být ve voicechatu!');
		}
	}
});

//hlášky
bot.on('message', message => {
	if(message.content === "~TenJont"){
			let zpravy_tenjont = ["Jé hele to je Ten Joint!", "Už ho furt nezmiňuj, chudáka, otravuješ ho furt oznámením...", "Ha, TenJont!", "Zdar Piškot!"];
			const zprava = new Discord.MessageEmbed()
				.setColor('#3cb5e8')
				.setTitle(message.content)
				.setDescription('Prostě joint')
				.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/6/63/Ingress_Logo.png')
				.setImage('https://upload.wikimedia.org/wikipedia/commons/6/63/Ingress_Logo.png')
				.setTimestamp()
				.setFooter('By Jafaros 02.04.2020');
			
			message.channel.send(zpravy_tenjont[Math.floor(Math.random() * zpravy_tenjont.length)]);
			message.channel.send(zprava);
	}
});

//mazání zpráv
bot.on('message', message =>{
	let prefix = '-delete';
	let msg = message.content.toLowerCase();
	let sender = message.author;
	let cont = message.content.slice(prefix.length).split(" ");
	let count = cont.slice(1);
	
	if(msg.startsWith(prefix)){
		if(message.member.roles.cache.some(r => r.name === "👑ADMIN") || message.member.roles.cache.some(m => m.name === "🔊MODERÁTOR")){
		async function purge(){
			message.delete();
			
			if(!message.member.roles.cache.some(r => r.name === "👑ADMIN") || !message.member.roles.cache.some(r => r.name === "🔊MODERÁTOR")){
				message.channel.send("Nemáš dostatečná oprávnění pro použití tohoto příkazu");
			}
		
			const fetched = await message.channel.messages.fetch({limit: count[0]});
			console.log(fetched.size + ' zpráv nalezeno, probíhá mazání...\nTato akce může trvat několik sekund...');
			
			message.channel.bulkDelete(fetched)
			.catch(error => message.channel.send("CHYBA: ${error}"));
		}
		
		purge();
		}
		else{
			message.channel.send("Nemáš dostatečná oprávnění pro použití tohoto příkazu");
		}
	}
})