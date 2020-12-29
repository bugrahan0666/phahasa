const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {

    if(!message.member.roles.cache.some(r => ["765573385148432384", "765679116968001586"].includes(r.id)) && (!message.member.hasPermission("ADMINISTRATOR")))
    return message.reply("Bu Komutu Kullanmak İçin Yetkiniz Bulunmamakta.")
 
   let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
 let erkek = await db.fetch(`kayıte_${message.author.id}`) || '0'
    let kız = await db.fetch(`kayıtk_${message.author.id}`) || '0'
    let toplam = await db.fetch(`toplamkayit_${message.author.id}`) || '0'
    let kayitBilgi = `
    **Toplam Erkek Kayıt** **${erkek}** 
    **Toplam Kız Kayıt** **${kız}** 
    **Toplam** **${toplam}** 
    `
    let kayısay = new Discord.MessageEmbed()
   .setThumbnail(message.member.displayName, message.author.avatarURL({dynamic: true}))
    .setColor(0x000100)
    .setTitle('Teyit Bilgisi')
    .setFooter('Şahmeran')
    .setDescription(`${member} **Kullanıcısının Teyit İstatistikleri** 
    ${kayitBilgi} 
    
`)
      .setThumbnail(member.user.avatarURL({dynamic: true}))
 .setFooter(message.author.username,
message.author.avatarURL( { dynamic : true } ))
  .setTimestamp()
    
  message.channel.send(kayısay)
 

};
  
 

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["me"],
    permLvl: 0,
}
  
exports.help = {  
  name: "teyitsay"
}