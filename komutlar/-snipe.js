const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {
 if (!message.member.roles.cache.has("YETKİLİ ID") && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL()({dynamic: true})).setColor(0xf5f5f5).addField("Yetersiz Yetki",`Bu Komutu Kullanmak içi Yeterli Yetkiniz Yok`)).then(m => m.delete({timeout: 7000}));
 
  
  const data = await db.fetch(`snipe.id.${message.guild.id}`)
    if(!data) {
    const snipe2 = new Discord.MessageEmbed()
  .setAuthor(client.user.username, client.user.avatarURL())
  .setDescription(`Hiç mesaj silinmemiş.`)
  .setColor(`#f3c7e1`)
    message.channel.send({embed: snipe2});
          } else {
  let kullanıcı = client.users.cache.get(data);
  const data2 = await db.fetch(`snipe.mesaj.${message.guild.id}`)
  const snipe = new Discord.MessageEmbed()
  .addField(`En son mesaj silen kişi :`, `${kullanıcı.username}`)
  .addField(`En son silinen mesaj :`, `${data2}`)

.setThumbnail(kullanıcı.avatarURL())
.setColor('f5f5f5')
  message.channel.send(snipe) }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
}

exports.help = {
 name: 'snipe',
 description: `Son silinen mesajı size gösterir.`,
 usage: 'snipe',
 kategori: '**EĞLENCE**',
 permLvl: '**HERKES KULLANABİLİR**'
};