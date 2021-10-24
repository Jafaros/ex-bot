const Discord = require("discord.js");
const bot = new Discord.Client();

const token = "Njk0ODQyMDc5OTAxMzg0NzM1.XouXVA.YIimsgsJ39FXKDfa0mx0j7g_zHI";
bot.login(token);

const command = new Discord.MessageEmbed();

//hlášky ke commandům
let help =
  "\n**RADIO** - Zapne rádio (Evropa 2, Impuls, Frekvence 1, Kroměříž, Kiss) `-radio Evropa2`\n**HELP** - Zobrazí všechny dostupné příkazy `-ohelp`\n**PLAY** - Zahraje vám co chcete `-oplay YoutubeVideoURL`\n**STOP** - Zastaví přehávání hudby `-ostop`\n**SKIP** Přeskočí písničku `-oskip`\n**DELETE** - Smaže zadaný počet zpráv(Jen pro ty co mají povolení [Správa zpráv]) `-odelete PočetZpráv`\n**LEAVE** - opustí voicechat `-oleave`";

//stav bota při zapnutí
bot.on("ready", () => {
  console.log("Bot je online");

  bot.user.setStatus("Online");

  bot.user.setActivity("Tvoji mámu", { type: "LISTENING" });
});

//ping pong
bot.on("message", (message) => {
  if (message.content == "-oping") {
    message.channel.send(
      `Tvůj ping je: **${
        Date.now() - message.createdTimestamp
      }ms**\nLatence API je:  **${Math.round(bot.ws.ping)}ms**`
    );
  }
});

//hlasování
bot.on("message", async (message) => {
  if (message.content.toLowerCase().startsWith("-ovote")) {
    let args = message.content.split("-ovote");

    if (message.channel.id) {
      let poolEmbed = new Discord.MessageEmbed()
        .setTitle("Hlasování")
        .setColor("#4287f5")
        .setDescription(args.join(" "));
      let poolMessage = await message.channel.send(poolEmbed);

      await poolMessage.react("✅");
      await poolMessage.react("❌");

      console.log(`${message.author.username} zahájil hlasování`);
      message.delete({ timeout: 1000 });

      const reactions = await poolMessage.awaitReactions(
        (reaction) =>
          reaction.emoji.name === "✔" || reaction.emoji.name === "❌",
        { time: 10000 }
      );

      try {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("Výsledky hlasování u " + "**" + args[1] + "**")
            .setColor("#fcdb03")
            .addField("✅ : " + `${reactions.cache.get("✔️").count - 1} hlasů`)
            .addField("❌ : " + `${reactions.cache.get("❌").count - 1} hlasů`)
        );
        poolMessage.delete(0);
      } catch (error) {
        console.log("Někde je chyba" + `${error}`);
      }
    }
  }
});

let inChannel = 0;
let url_fm = [
  "http://ice.actve.net/fm-evropa2-128",
  "http://icecast5.play.cz/impuls128.mp3",
  "http://ice.actve.net/web-e2-csweb",
  "http://icecast6.play.cz/radio-kromeriz128.mp3",
  "http://icecast1.play.cz/kiss128.mp3",
];

let radio_thumbnails = [
  "https://www.designportal.cz/wp-content/uploads/2015/03/evropa-2-logo-02.jpg",
  "https://eurozpravy.cz/pictures/photo/2015/02/04/impuls-1423045416-a89b38fd.jpg",
  "https://cdn-radiotime-logos.tunein.com/s2104g.png",
  "https://www.mediar.cz/s/2012/12/radio-kromeriz.png",
  "https://www.kiss.cz/data/download/Kiss_BeHappy.png",
];

function radioSelection(message, args) {
  let index = 5;
  let volume = 1;
  const streamOptions = {
    seek: 0,
    volume: volume,
  };

  if (message.member.voice.channel && inChannel == 0) {
    inChannel = 1;
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(
          "Připojuji se ke kanálu " +
            "`" +
            message.member.voice.channel.name +
            "`"
        )
        .setColor("#4287f5")
    );
  }

  if (message.member.voice.channel && inChannel == 1) {
    if (args == "Evropa2") {
      index = 0;
    } else if (args == "Impuls") {
      index = 1;
    } else if (args == "Frekvence1") {
      index = 2;
    } else if (args == "Kroměříž") {
      index = 3;
    } else if (args == "Kiss") {
      index = 4;
    } else {
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Neplatný název rádia")
          .setColor("#c90000")
      );
    }
  } else {
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle("Musíš být ve voicechatu!")
        .setColor("#c90000")
    );
  }

  if (index >= 0 && index <= 4) {
    const connection = message.member.voice.channel
      .join()
      .then((connection) => {
        const dispatcher = connection.play(url_fm[index], streamOptions);
        connection.voice.setSelfDeaf(true);
      });
  }
  message.channel.send(
    new Discord.MessageEmbed()
      .setColor("#4287f5")
      .setTitle("Spouštím rádio " + "`" + args + "`")
      .addFields(
        {
          name: "**Vyžádal**",
          value: `${message.author}`,
          inline: true,
        },
        {
          name: "**Hlasitost**",
          value: volume * 100 + "%",
          inline: true,
        }
      )
      .setThumbnail(radio_thumbnails[index])
  );
  console.log(
    "Zapnul jsem rádio " + args + " na žádost " + `${message.author.username}`
  );
}

//radio
bot.on("message", (message) => {
  const ytdl = require("ytdl-core");
  if (message.content.toLowerCase().startsWith("-radio")) {
    let args = message.content.split(" ");

    radioSelection(message, args[1]);
  }
});

bot.on("message", (msg) => {
  if (msg.content == "-ohelp") {
    msg.delete({ timeout: 100 });
    msg.channel.send(
      new Discord.MessageEmbed()
        .setColor("#4287f5")
        .setTitle("Dostupné příkazy")
        .setDescription(help)
    );
  }
});

//join discord voicechat server
bot.on("message", async (message) => {
  if (!message.guild) return;

  if (message.content == "-ojoin") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.voice.setSelfDeaf(true);
      message.delete({ timeout: 1000 });
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(
            "Připojuji se ke kanálu " +
              "`" +
              message.member.voice.channel.name +
              "`"
          )
          .setColor("#4287f5")
      );
    } else {
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Musíš být ve voicechatu!")
          .setColor("#c90000")
      );
    }
  }
});

//disconect discord voicechat server
bot.on("message", async (message) => {
  if (!message.guild) return;

  if (message.content == "-oleave") {
    if (message.member.voice.channel) {
      const disconnect = await message.member.voice.channel.leave();
      message.delete({ timeout: 1000 });
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(
            "Odpojuji se od kanálu " +
              "`" +
              message.member.voice.channel.name +
              "`"
          )
          .setColor("#4287f5")
      );
    } else {
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Musíš být ve voicechatu!")
          .setColor("#c90000")
      );
    }
  }
});

//play, skip, stop

const ytdl = require("ytdl-core");
const queue = new Map();
let inChannelPlay = 0;

bot.on("message", async (message) => {
  if (message.author.bot) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`-oplay`)) {
    execute(message, serverQueue);
    if (inChannelPlay == 0) {
      inChannelPlay = 1;
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(
            "Připojuji se ke kanálu " +
              "`" +
              message.member.voice.channel.name +
              "`"
          )
          .setColor("#4287f5")
      );
    }
    return;
  } else if (message.content.startsWith(`-oskip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`-ostop`)) {
    stop(message, serverQueue);
    return;
  }

  async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Musíš být ve voicechatu abys mohl přehrávat hudbu!")
          .setColor("#c90000")
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Nemám dostatečná oprávnění na to pouštět hudbu!")
          .setColor("#c90000")
      );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      author: songInfo.videoDetails.author.name,
      thumbnail: songInfo.videoDetails.thumbnails,
      length: songInfo.videoDetails.lengthSeconds,
      videoId: songInfo.videoDetails.videoId,
    };

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 1,
        playing: true,
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        connection.voice.setSelfDeaf(true);
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(`**${song.title}** Byla přidána do queue`)
          .setColor("#4287f5")
      );
    }
  }

  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Musíš být ve voicechatu abys mohl překočit písničku")
          .setColor("#c90000")
      );

    if (serverQueue) return serverQueue.connection.dispatcher.end();

    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle("Přeskakuji písničku...")
        .setColor("#4287f5")
    );
  }

  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Musíš být ve voicechatu abys mohl zastavit hudbu")
          .setColor("#c90000")
      );

    if (!serverQueue)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Přehrávání skončilo!")
          .setColor("#c90000")
      );

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle("Zastavuji přehrávání...")
        .setColor("#4287f5")
    );
    console.log("Hudba byla pozastavena");
  }

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      inChannelPlay = 0;
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(
            "Odpojuji se od kanálu " +
              "`" +
              message.member.voice.channel.name +
              "`"
          )
          .setColor("#4287f5")
      );
      queue.delete(guild.id);

      return;
    }

    let videoLength;
    let seconds = song.length;

    if (!seconds) return "";

    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % 3600;

    let min = parseInt(duration / 60);
    duration = duration % 60;

    let sec = parseInt(duration);

    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }

    if (parseInt(hours, 10) > 0) {
      videoLength = `${parseInt(hours, 10)}:${min}:${sec}`;
    } else if (min == 0) {
      videoLength = `0:0:${sec}`;
    } else {
      videoLength = `0:${min}:${sec}`;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 1);
    console.log("Zapinam hudbu...");
    serverQueue.textChannel.send(
      new Discord.MessageEmbed()
        .setTitle(`**${song.title}**`)
        .setURL(`${song.url}`)
        .setThumbnail(
          "https://i.ytimg.com/vi/" + `${song.videoId}` + "/default.jpg"
        )
        .setColor("#4287f5")
        .setAuthor("Přehrávám: ")
        .addFields(
          { name: "**Autor: **", value: `${song.author}` },
          { name: "**Délka: **", value: "`" + videoLength + "`", inline: true },
          { name: "**Vyžádal: **", value: `${message.author}`, inline: true }
        )
    );
  }
});

//mazání zpráv
bot.on("message", (message) => {
  let prefix = "-odelete";
  let msg = message.content.toLowerCase();
  let sender = message.author;
  let cont = message.content.slice(prefix.length).split(" ");
  let count = cont.slice(1);

  if (msg.startsWith(prefix)) {
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
      async function purge() {
        message.delete();

        const fetched = await message.channel.messages.fetch({
          limit: count[0],
        });
        console.log(
          fetched.size +
            " zpráv nalezeno, probíhá mazání na žádost" +
            `${message.author.username}` +
            "\nTato akce může trvat několik sekund..."
        );

        message.channel
          .bulkDelete(fetched)
          .catch((error) => message.channel.send("CHYBA: "`${error}`));
      }

      purge();
    } else {
      message.channel.send(
        command
          .setTitle("Nemáš dostatečná oprávnění pro použití tohoto příkazu")
          .setColor("#4287f5")
          .addFields()
          .setDescription("")
      );
    }
  }
});
