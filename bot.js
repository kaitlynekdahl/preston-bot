const Discord = require('discord.js');
const constants = require('./constants.json');
const auth = require('./auth.json');
const fs = require('fs');

var playing = false;

const client = new Discord.Client();
client.login(auth.token);

client.on('ready', e => {
  console.log('Bot online!');
  client.channels.fetch(constants.general).then(general => {
    //general.send("Papa preston is online");
  });
});

client.on('error', e => {
  console.log('Bot error:');
  console.log(e);
});

client.on('message', async message => {
  if (!message.guild) return;

  if (message.content.substring(0, 1) == '!') {
    var args = message.content.substring(1).split(/ (.+)/);
    var cmd = args[0].toLowerCase();

    //args = args.splice(1);
    console.log(`${message.author.username} issued \"${cmd}\" with \"${args[1]}\"`);
    switch (cmd) {
      //handle cases for strings following '!'
      case 'preston':
        if (message.member.voice.channel && !playing) {
          playing = true;

          let path = constants.defaultAudioDirectory;
          if (message.author.id == constants.christian || message.author.id == constants.cherry) {
            path = constants.angryAudioDirectory;
          } else if (message.author.id == constants.kaitlyn) {
            path = constants.loveAudioDirectory;
          }

          let files = fs.readdirSync(path);
          let connection = await message.member.voice.channel.join();
          let dispatch = connection.play(`${path}${files[Math.floor((Math.random() * files.length))]}`, {
            volume: constants.volume
          });

          dispatch.on('finish', () => {
            dispatch.destroy();
            connection.disconnect();
            playing = false;
          });
        }
        break;
      case 'perston':
        playSound(message, './audio/perston.mp3');
        break;
      case 'prestondisagree':
        playSound(message, './audio/disagree.mp3');
        break;
      case 'eels':
        playSound(message, './audio/eels.mp3');
        break;
      case 'prestonsad': {
        let path = constants.angryAudioDirectory;
        let files = fs.readdirSync(path);
        let connection = await message.member.voice.channel.join();
        let dispatch = connection.play(`${path}${files[Math.floor((Math.random() * files.length))]}`, {
          volume: constants.volume
        });

        dispatch.on('finish', () => {
          dispatch.destroy();
          connection.disconnect();
          playing = false;
        });
        break;
      }
      case 'spongecase': {
        message.channel.send(spongeCase(args[1]));
        break;
      }
      case 'prestonlove': {
        let path = constants.loveAudioDirectory
        let files = fs.readdirSync(path);
        let connection = await message.member.voice.channel.join();
        let dispatch = connection.play(`${path}${files[Math.floor((Math.random() * files.length))]}`, {
          volume: constants.volume
        });

        dispatch.on('finish', () => {
          dispatch.destroy();
          connection.disconnect();
          playing = false;
        });
        break;
      }
    }
  } else {//the message isn't a command, so check for keyword to react to
    Object.keys(constants.reactions).forEach(e => {
      if (message.content.toLowerCase().includes(e)) {
        message.react(constants.reactions[e]);
      }
    });
  }
});

async function playSound(msg, path) {
  if (msg.member.voice.channel && !playing) {
    playing = true;

    let connection = await msg.member.voice.channel.join();
    let dispatch = connection.play(path, {
      volume: constants.volume
    });

    dispatch.on('finish', () => {
      dispatch.destroy();
      connection.disconnect();
      playing = false;
    });
  }
}

function spongeCase(s) {
  var chars = s.toLowerCase().split("");
  for (var i = 0; i < chars.length; i += 2) {
    chars[i] = chars[i].toUpperCase();
  }
  return chars.join("");
};