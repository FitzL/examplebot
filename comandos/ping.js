module.exports = {
  alias: ["ping"], // es un array, puedes poner varios
  callback: async (args, message, client) => { 
  	message.reply("Pong!");
  }
}

/*
  # comando de ejemplo
*/