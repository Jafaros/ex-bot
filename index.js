const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'Njk0ODQyMDc5OTAxMzg0NzM1.XouXVA.YIimsgsJ39FXKDfa0mx0j7g_zHI';
bot.login(token);

const command = new Discord.MessageEmbed();
	
//hlášky ke commandům
let help = "\n-radio - Zapne rádio, které zadáte(Evropa 2, Impuls, Frekvence 1, Kroměříž, Kiss)\n-help - Zobrazí všechny dostupné příkazy\n-play - Zahraje vám co chcete!\n-delete - Smaže zadaný počet zpráv(Jen pro ty co mají povolení [Správa zpráv])\n-leave - opustí voicechat";

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
	const ytdl = require("ytdl-core");
	let volume = 1;
	const streamOptions = {
		seek: 0,
		volume: volume
	}
	if(message.content.toLowerCase().startsWith("-radio")){
		let args = message.content.split(" ");
		let url_fm = ["http://ice.actve.net/fm-evropa2-128", "http://icecast5.play.cz/impuls128.mp3", "http://ice.actve.net/web-e2-csweb", "http://icecast6.play.cz/radio-kromeriz128.mp3", "http://icecast1.play.cz/kiss128.mp3"];
			if (message.member.voice.channel) {
				if(args[1] == "Evropa2"){
					const connection = message.member.voice.channel.join()
					.then(connection => {
					const dispatcher = connection.play(url_fm[0], streamOptions);
					message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
					message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle('Spouštím rádio ' + "`" + "Evropa 2" + "`").addFields(
						{ name: '**Vyžádal**', value: `${message.author}` },
						{ name: '**Hlasitost**', value: (volume * 100) + "%" },
					));
					bot.user.setActivity("Evropu 2",{type: "LISTENING"});
					console.log('Zapnul jsem rádio Evropu 2 na žádost ' + `${message.author.username}`);
					})
				} 
				else if(args[1] == "Impuls"){
					const connection = message.member.voice.channel.join()
					.then(connection => {
					const dispatcher = connection.play(url_fm[1], streamOptions);
					message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
					message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle('Spouštím rádio ' + "`" + args[1] + "`").addFields(
						{ name: '**Vyžádal**', value: `${message.author}` },
						{ name: '**Hlasitost**', value: (volume * 100) + "%" },
					));
					bot.user.setActivity("Rádio Impuls",{type: "LISTENING"});
					console.log('Zapnul jsem rádio Impuls na žádost ' + `${message.author.username}`);
					})
				}
				else if(args[1] == "Frekvence1"){
					const connection = message.member.voice.channel.join()
					.then(connection => {
					const dispatcher = connection.play(url_fm[2], streamOptions);
					message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
					message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle('Spouštím rádio ' + "`" + "Frekvence 1" + "`").addFields(
						{ name: '**Vyžádal**', value: `${message.author}` },
						{ name: '**Hlasitost**', value: (volume * 100) + "%" },
					));
					bot.user.setActivity("Frekvenci 1",{type: "LISTENING"});
					console.log('Zapnul jsem rádio Frekvence 1 na žádost ' + `${message.author.username}`);
					})
				}
				else if(args[1] == "Kroměříž"){
					const connection = message.member.voice.channel.join()
					.then(connection => {
					const dispatcher = connection.play(url_fm[3], streamOptions);
					message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
					message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle('Spouštím rádio ' + "`" + args[1] + "`").addFields(
						{ name: '**Vyžádal**', value: `${message.author}` },
						{ name: '**Hlasitost**', value: (volume * 100) + "%" },
					));
					bot.user.setActivity("Rádio Kroměříž",{type: "LISTENING"});
					console.log('Zapnul jsem rádio Kroměříž na žádost ' + `${message.author.username}`);
					})
				}
				else if(args[1] == "Kiss"){
					const connection = message.member.voice.channel.join()
					.then(connection => {
					const dispatcher = connection.play(url_fm[4], streamOptions);
					message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
					message.channel.send(new Discord.MessageEmbed().setColor('#4287f5').setTitle('Spouštím rádio ' + "`" + args[1] + "`").addFields(
						{ name: '**Vyžádal**', value: `${message.author}` },
						{ name: '**Hlasitost**', value: (volume * 100) + "%" },
					));
					bot.user.setActivity("Rádio Kiss",{type: "LISTENING"});
					console.log('Zapnul jsem rádio Kiss na žádost ' + `${message.author.username}`);
					})
				}
				else{
					message.channel.send(new Discord.MessageEmbed().setTitle('Neplatný název rádia').setColor('#c90000'));
				}
			}
			else {
				message.channel.send(new Discord.MessageEmbed().setTitle('Musíš být ve voicechatu!').setColor('#c90000'));
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
			message.channel.send(new Discord.MessageEmbed().setColor('#c90000').setTitle("Hlasitost nemůže přesáhnout 100%"));
		}
		else if(volume < 0){
			message.channel.send(new Discord.MessageEmbed().setColor('#c90000').setTitle("Hlasitost nemůže být nižší než 0%"));
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
	  message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
    } else {
      message.channel.send(new Discord.MessageEmbed().setDescription('Musíš být ve voicechatu!').setColor('#c90000'));
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
	  message.channel.send(new Discord.MessageEmbed().setTitle('Odpojuji se od kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
    } 
	else {
      message.channel.send(new Discord.MessageEmbed().setTitle('Musíš být ve voicechatu!').setColor('#c90000'));
    }
  }
});

//play, skip, stop

const ytdl = require("ytdl-core");
const queue = new Map();

bot.on("message", async message => {

	if (message.author.bot) return;

	const serverQueue = queue.get(message.guild.id);
  
	if (message.content.startsWith(`-play`)) {
	  execute(message, serverQueue);
	  return;
	} else if (message.content.startsWith(`-skip`)) {
	  skip(message, serverQueue);
	  return;
	} else if (message.content.startsWith(`-stop`)) {
	  stop(message, serverQueue);
	  return;
	}
  
  async function execute(message, serverQueue) {
	const args = message.content.split(" ");
  
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel)
	  return message.channel.send(new Discord.MessageEmbed().setTitle("Musíš být ve voice chatu abys mohl přehrávat hudbu!").setColor('#c90000'));
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
	  return message.channel.send(new Discord.MessageEmbed().setTitle("Nemám dostatečná oprávnění na to pouštět hudbu!").setColor('#c90000'));
	}
  
	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		  title: songInfo.videoDetails.title,
		  url: songInfo.videoDetails.video_url,
		  author: songInfo.videoDetails.author,
		  thumbnail: songInfo.videoDetails.thumbnails.thumbnail_url,
		  length: songInfo.videoDetails.lengthSeconds,
	 };
  
	if (!serverQueue) {
	  const queueContruct = {
		textChannel: message.channel,
		voiceChannel: voiceChannel,
		connection: null,
		songs: [],
		volume: 1,
		playing: true
	  };
  
	  queue.set(message.guild.id, queueContruct);
  
	  queueContruct.songs.push(song);
  
	  try {
		var connection = await voiceChannel.join();
		queueContruct.connection = connection;
		play(message.guild, queueContruct.songs[0]);
	  } catch (err) {
		console.log(err);
		queue.delete(message.guild.id);
		return message.channel.send(err);
	  }
	} else {
	  serverQueue.songs.push(song);
	  return message.channel.send(`**${song.title}** Byla přidána do queue`);
	}
  }
  
  function skip(message, serverQueue) {
	if (!message.member.voice.channel)
	  return message.channel.send(new Discord.MessageEmbed().setTitle("Musíš být ve voice channelu abys mohl překočit písničku!").setColor('#c90000'));

	if (!serverQueue)
	  return message.channel.send(new Discord.MessageEmbed().setTitle("Už není žádná písnička na přeskočení!").setColor('#c90000'));
	serverQueue.connection.dispatcher.end();

	message.channel.send(new Discord.MessageEmbed().setTitle("Přeskakuji písničku...").setColor('#4287f5'));
  }
  
  function stop(message, serverQueue) {
	if (!message.member.voice.channel)
	  return message.channel.send(new Discord.MessageEmbed().setTitle("Musíš být ve voice channelu abys mohl zastavit hudbu!").setColor('#c90000'));
	  
	if (!serverQueue)
	  return message.channel.send(new Discord.MessageEmbed().setTitle("Přehrávání skončilo!").setColor('#c90000'));
	  
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
	message.channel.send(new Discord.MessageEmbed().setTitle("Zastavuji přehrávání...").setColor('#4287f5'));
	message.channel.send(new Discord.MessageEmbed().setTitle('Odpojuji se od kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
	console.log("Hudba byla pozastavena");
  }
  
  function play(guild, song) {

	const serverQueue = queue.get(guild.id);

	if (!song) {
	  serverQueue.voiceChannel.leave();
	  queue.delete(guild.id);
	  return;
	}

	let videoLength;
	let seconds = song.length;

	if (!seconds) return '';
   
	let duration = seconds;
	let hours = duration / 3600;
	duration = duration % (3600);
   
	let min = parseInt(duration / 60);
	duration = duration % (60);
   
	let sec = parseInt(duration);
   
	if (sec < 10) {
		sec = `0${sec}`;
	}
	if (min < 10) {
		min = `0${min}`;
	}

	if (parseInt(hours, 10) > 0) {
		videoLength =  `${parseInt(hours, 10)}:${min}:${sec}`;
	}
	else if (min == 0) {
		videoLength = `0:0:${sec}`;
	}
	else {
		videoLength = `0:${min}:${sec}`;
	}
  
	const dispatcher = serverQueue.connection
	  .play(ytdl(song.url))
	  .on("finish", () => {
		serverQueue.songs.shift();
		play(guild, serverQueue.songs[0]);
	  })
	  .on("error", error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 1);
	message.channel.send(new Discord.MessageEmbed().setTitle('Připojuji se ke kanálu ' + "`" + message.member.voice.channel.name + "`").setColor('#4287f5'));
	console.log("Zapinam hudbu...");
	serverQueue.textChannel.send(new Discord.MessageEmbed().setTitle(`**${song.title}**`).setURL(`${song.url}`).setColor("#4287f5")
	.setAuthor("Přehrávám: ").addFields(
		{ name: '**Autor: **', value: `${song.author}` },
		{ name: '**Délka: **', value: "`" + videoLength + "`", inline: true },
		{ name: '**Vyžádal: **', value: `${message.author}`, inline: true },
	));
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
		if(message.member.hasPermission('MANAGE_MESSAGES')){
		async function purge(){
			message.delete();

			const fetched = await message.channel.messages.fetch({limit: count[0]});
			console.log(fetched.size + ' zpráv nalezeno, probíhá mazání na žádost' + `${message.author.username}` + '\nTato akce může trvat několik sekund...');
			
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