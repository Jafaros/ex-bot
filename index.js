const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'Njk0ODQyMDc5OTAxMzg0NzM1.XouXVA.YIimsgsJ39FXKDfa0mx0j7g_zHI';
bot.login(token);

const command = new Discord.MessageEmbed();
	
//hlášky ke commandům
let radio = "Zapínám rádio Evropy 2...";
let stop = "Tato funkce prozatím není přidána";
let help = "\n-radio - Zapne rádio Evropy 2\n-help - Zobrazí všechny dostupné příkazy\n-play - Zahraje vám co chcete!\n-delete - Smaže zadaný počet zpráv(Jen pro Adminy)\n-leave - opustí voicechat";
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
bot.on('message', async message => {
	if(message.content.toLowerCase().startsWith("-vote")){
		let argy = message.content.split("-vote");
		
		if (message.channel.id === "696813777013833729" || message.channel.id === "683418675172212819") {
			let poolEmbed = new Discord.MessageEmbed()
			.setTitle("Hlasování")
			.setColor("#4287f5")
			.setDescription(argy.join(" "))
			let poolMessage = await message.channel.send(poolEmbed);
	  
			await poolMessage.react("✅");
			await poolMessage.react("❌");
			
			message.delete({timeout: 1000});
	  
			const reactions = await message.awaitReactions(reaction =>  reaction.emoji.name === "✔" || reaction.emoji.name === "❌", {time: 10000});

			let resultsEmdeb = new Discord.MessageEmbed()
				.setTitle("Výsledky hlasování")
				.addField("✅: ", `${reactions.get("✅").count - 1} hlasů`)	
				.addField("❌: ", `${reactions.get("❌").count - 1} hlasů`)

		message.channel.send(resultsEmbed);
		poolMessage.delete(0);
		}
	}
});


//radio
bot.on('message', message => {
	const radio_fm = require("ytdl-core");
	let volume = 1;
	const streamOptions = {
		seek: 0,
		volume: volume
	}
	if(message.content.toLowerCase() === "-radio"){
		let url_fm = "http://ice.actve.net/fm-evropa2-128";
			if (message.member.voice.channel) {
				const connection = message.member.voice.channel.join()
				.then(connection => {
				const dispatcher = connection.play(url_fm, streamOptions);
				message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
				message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle(radio).addFields(
					{ name: '**Vyžádal**', value: `${message.author}` },
					{ name: '**Hlasitost**', value: (volume * 100) + "%" },
				));
				bot.user.setActivity("Evropu 2",{type: "LISTENING"});
				console.log('Zapnul jsem rádio');
				})
			} 
			else {
				message.channel.send(new Discord.MessageEmbed().setTitle('Musíš být ve voicechatu!').setColor('#4287f5'));
		}
}});


bot.on('message', msg => {
	if(msg.content === "-help"){
		msg.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle("HELP").setDescription(help));
	}
});

bot.on('message', message => {
	if(message.content.toLowerCase().startsWith("-volume")){
		let args = message.content.split(" ");
		let volume = args[1];

		if(volume > 100){
			message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle("Hlasitost nemůže přesáhnout 100%"));
		}
		else if(volume < 0){
			message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle("Hlasitost nemůže být nižší než 0%"));
		}
		else{
			message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle("Hlasitost úspěšně nastavena na " + "`" + volume + "%`"));
		}
	}
});


//join discord voicechat server
bot.on('message', async message => {
  if (!message.guild) return;

  if (message.content === '-join') {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.channel.send(new Discord.MessageEmbed().setDescription('Musíš být ve voicechatu!').setColor('#4287f5'));
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
      message.channel.send(new Discord.MessageEmbed().setTitle('Musíš být ve voicechatu!').setColor('#4287f5'));
    }
  }
});

//play music
bot.on('message', message => {
	const ytdl = require("ytdl-core");
	let volume = 100;
	const streamOptions = {
		seek: 0,
		volume: volume
	}
	if(message.content.toLowerCase().startsWith("-play") || message.content.toLowerCase().startsWith("-šuldohraj")  || message.content.toLowerCase().startsWith("-zmrdehraj")){
		let args = message.content.split(" ");
		let url = args[1];
			if (message.member.voice.channel) {
				if (url == null){
					message.channel.send(new Discord.MessageEmbed().setColor('#9c1111').setTitle("CHYBA").setDescription(url_validate));
				}
				else{
					const connection = message.member.voice.channel.join()
					.then(connection => {
						message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
						message.channel.send(new Discord.MessageEmbed().setTitle('Přehrávám hudbu...').setColor('#4287f5').addFields(
							{ name: '**Vyžádal**', value: `${message.author}` },
							{ name: '**Hlasitost**', value: volume + "%" }
						));
						const stream = ytdl(url, {filter: 'audioonly'});
						const dispatcher = connection.play(stream, streamOptions)
						.on("end",()=>{
							console.log("Písnička skončila"),
							message.member.voice.channel.leave();
						});
					})
				}
			} 
			else {
				message.channel.send(new Discord.MessageEmbed().setTitle('Musíš být ve voicechatu!').setColor('#4287f5'));
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
				.setDescription('Prostě joint\nVyžádal: ' + message.author.username)
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
		if(message.member.roles.cache.some(r => r.name === "ADMIN") || message.member.roles.cache.some(m => m.name === "MODERÁTOR")){
		async function purge(){
			message.delete();
			
			if(!message.member.roles.cache.some(r => r.name === "ADMIN" || r.name === "MODERÁTOR")){
				message.channel.send("Nemáš dostatečná oprávnění pro použití tohoto příkazu");
			}
		
			const fetched = await message.channel.messages.fetch({limit: count[0]});
			console.log(fetched.size + ' zpráv nalezeno, probíhá mazání...\nTato akce může trvat několik sekund...');
			
			message.channel.bulkDelete(fetched)
			.catch(error => message.channel.send("CHYBA: " `${error}`));
		}
		
		purge();
		}
		else{
			message.channel.send(command.setTitle("Nemáš dostatečná oprávnění pro použití tohoto příkazu").setColor('#4287f5').addFields().setDescription(""));
		}
	}
});