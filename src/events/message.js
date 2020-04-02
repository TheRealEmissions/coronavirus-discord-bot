module.exports = async (head, client, message) => {
   if (message.channel.type == "dm") {
      let prefix = head.auth.dev_mode == true ? ".." : ".";
      if (message.content.toString().startsWith(prefix)) {
         if (
            message.content.split(" ")[0].slice(prefix.length) == "newsletter"
         ) {
            let cmd = head.commandHandler.getCommand("newsletter");
            if (!cmd) return;
            try {
               cmd.run(head, client, message, []);
            } catch (E) {
               return head.error(E);
            }
         }
      }
      return;
   }
   if (message.channel.type != "text") return;
   if (message.author.id == client.user.id) return;
   if (message.author.bot) return;
   const prefix = await head.functions
      .getPrefix(head, client, message.guild)
      .catch(err => head.error(err));
   let p = head.auth.dev_mode === true ? ".." : prefix;
   if (message.content.toString().startsWith(p)) {
      let args = message.content.split(" ");
      let command = args[0];
      let cmd = head.commandHandler.getCommand(command.slice(p.length));
      if (!cmd) return;
      try {
         cmd.run(head, client, message, args);
      } catch (e) {
         head.error(e);
      }
   }
};
