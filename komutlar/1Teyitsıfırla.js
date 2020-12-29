const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {

    if(!message.member.roles.cache.some(r => ["", ""].includes(r.id)) && (!message.member.hasPermission("ADMINISTRATOR")))
    return message.reply("Bu Komutu Kullanmaya Yetkin Yok.")
 
 let member = message.mentions.users.first()
     if(!member) message.channel.send(`birini etiketle`)
  if (member) {
 message.channel.send(`${member} kişisinin teyit bilgileri sıfırlandı!`)
 
db.delete(`kayıte_${member.id}`)
db.delete(`kayıtk_${member.id}`)  
db.delete(`toplamkayit_${member.id}`)
 
  .setThumbnail(member.user.avatarURL({dynamic: true}))
 .setFooter(message.author.username,
message.author.avatarURL( { dynamic : true } ))
  .setTimestamp()
    
  }
};
  
 

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLvl: 0,
}
  
exports.help = {  
  name: "teyitsıfırla"
}