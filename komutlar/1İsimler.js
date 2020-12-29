const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async (client, message, args) => {
   message.react('✅')
  if (!message.member.roles.cache.has("YETKİLİ ID") && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(0xf5f5f5).addField("Yetersiz Yetki",`Bu Komutu Kullanmak içi Yeterli Yetkiniz Yok`)).then(m => m.delete({timeout: 7000}));
 
  let member = message.mentions.users.first();
    if(!member) return message.channel.send('Bir kişiyi etiketlemelisin')
    let codeariuseski = await db.fetch(`eskiad_${member.id}`) || 'Eski ismi yok'
    let toplamik = await db.fetch(`toplamik_${member.id}`) || '0'
    let kayıtlılar = new Discord.MessageEmbed()
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .setColor('f5f5f5') 
      .setAuthor(`${member.tag}`, member.avatarURL())
      .setDescription(`Bu üyenin toplamda \`${toplamik}\` isim kayıtı bulundu:

\`${codeariuseski.join('\n')}\``)


 .setFooter(message.author.username,
message.author.avatarURL( { dynamic : true } ))
  .setTimestamp()
    message.channel.send(kayıtlılar).then(x => x.delete({timeout: 9000}))
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
}
exports.help = {
  name: 'isimler',
  description: "kişinin eski isimlerini gösterir",
  usage: 'isimler @kişi'
}