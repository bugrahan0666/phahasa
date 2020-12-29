const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require("quick.db")
var prefix = ayarlar.prefix;
const fs = require('fs');
let yazı = JSON.parse(fs.readFileSync("./database.json", "utf8"));
exports.run = async (client, message, args) => {
  if(message.author.bot || message.channel.type === "dm") return;
   if (!message.member.roles.cache.has("YETKİLİ ID") && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(0xf5f5f5).addField("Yetersiz Yetki",`Bu Komutu Kullanmak içi Yeterli Yetkiniz Yok`)).then(m => m.delete({timeout: 7000}));
 
  
  var user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

  var Vip   = message.guild.roles.cache.get("756857869000769598")
  
if(!user) return message.reply ("Lütfen bir kullanıcı etiketleyiniz").then(x => x.delete({timeout: 5000}));

  
        if(!Vip) return message.channel.send ("Vip Rolü Yok").then(x => x.delete({timeout: 5000}));


  if(!user.roles.cache.has(Vip.id)){
  
    await (user.roles.add(Vip.id))
    
  
   message.react('✅')
    let embed = new Discord.MessageEmbed()
    .setColor(Vip.color)
    .setDescription(`${user.user} Kullanıcısına <@&${Vip.id}> Rolü Verildi.`)
    .setFooter(`${message.author.tag}` , `${message.author.displayAvatarURL()}`)
  .setTimestamp()  
    message.channel.send(embed).then(x => x.delete({timeout: 5000}));



  }
  else {
    
    await (user.roles.remove(Vip.id));
    
 

    
    message.react('✅')
     let embed0= new Discord.MessageEmbed()
    .setColor(Vip.color)
    .setDescription(`${user.user} Kullanıcısına <@&${Vip.id}> Rolü Alındı.`)
   .setFooter(`${message.author.tag}` , `${message.author.displayAvatarURL()}`)
  .setTimestamp()  
    message.channel.send(embed0).then(x => x.delete({timeout: 5000}));

    
  }
 
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'vip',
  description: 'designer rolü verir.',
  usage: 'a!designer'
};