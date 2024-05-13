const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { token, validUsers } = require("./secret.json");
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

var commands = [];
const prefix = "!";
const dir = "comandos"; //donde están tus comandos

client.on('ready', () => { // Cuando arranca el bot
	console.log("Conectado como ", chalk.blue(client.user.displayName));
  const commandFiles = fs.readdirSync(path.join(__dirname, dir)); //capturamos todos los archivos de la carpeta

  for (let commandFile in commandFiles) { 
  	let commandName = commandFiles[commandFile];  // el nombre del comando que se está leyendo
  	const c = require(path.join(__dirname, dir, commandName)); // importa el comando
    let { testing } = c;
  	commands.push(c); // añadir a la lista de comandos

   	testing = testing ? chalk.yellow("[TESTING]") : ""; // loguea en la consola si un comando está en prueba

    console.log( 
      "Cargado: "
      + chalk.blue(`["${c.alias.join("\", \"")}"] `) 
      + testing); // loguea cada comando cargado
  }
});

client.on('messageCreate', async (_message) => { // Cada que se manda un mensaje
	if (message.author.bot) { return }; // Si el autor es un bot rechaza el mensaje

	let args = message.content.trim().split(/\s+/); //elimina espacios en blancos [/\s+/]

  for (const commandOptions of commands) {
    let _command = args[0]; // toma el primer "token" del mensaje.
    if (!_command.startsWith(prefix)) break; // chequea si el prefijo es valido
    _command = _command.slice(prefix.length);  // extrae el nombre del comando, sin el prefijo

  	let {
      alias,
      testing = false,
      callback
  	} = commandOptions; // extrae lo necesario del comando

  	for (const _alias of alias) { // un comando puede tener varios nombres
  		if (_command.toLowerCase() != _alias) continue; 

  		args.shift(); // depura la lista de argumentos
  		/* 
				pasa de "!comando arg1 arg2" a "arg1 arg2" no mas
  		*/


	    if (checkForTesting(testing)) { // si un comando tiene la bandera de testing retorna un error
	      message.reply("Este comando está restringido. Disculpas...");
	      return;
	    }

  		try {
  			testing = testing ? chalk.yellow("[WIP]") : "";
  			console.log(chalk.blue(`[${client.user.displayName}] `) + chalk.green("Corriendo: ") + "[" + _alias + "] " + testing);
  			/*
					# loguea que comando se está utilizando
  			*/


  			await callback(args, message, client).catch(e => console.log(e));
  			// ejecuta el comando

  		} catch (err) {
  			console.log(err);
  		}
  		return;
  	}
  }
});
client.login(token);

function checkForTesting(_testing) {
  return _testing && validUsers.indexOf(message.author.id) == -1;
}