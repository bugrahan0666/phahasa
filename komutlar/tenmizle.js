const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json')
const db = require('quick.db')

module.exports.run = async (client, message, args) => {
 if (!message.member.roles.cache.has("YETKİLİ ID") && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL()({dynamic: true})).setColor(0xf5f5f5).addField("Yetersiz Yetki",`Bu Komutu Kullanmak içi Yeterli Yetkiniz Yok`)).then(m => m.delete({timeout: 7000}));
 
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`Bu komutu kullanabilmek için "MESAJLARI YÖNET" iznine sahip olmalısın!`);
  if (!args[0] || isNaN(args[0])) return message.reply(`Temizlenecek mesaj miktarını belirtmelisin! (İstediğin kadar)`);
  message.delete();
  let sayi = Number(args[0]);
  let silinen = 0;
  for (var i = 0; i < (Math.floor(sayi/100)); i++) {
   message.channel.bulkDelete(100).then(r => silinen+=r.size);
    sayi = sayi-100;
  };
  if (sayi > 0)  message.channel.bulkDelete(sayi).then(r => silinen+=r.size);
  message.channel.send(`**\`\`${args[0]}\`\` Adet Mesaj Silindi.**`).then(x => x.delete({timeout: 3000}));
 
          
    }

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

module.exports.help = {
  name: 'sil',
  description: 'Botta bulunan tüm komutları gösterir',
  usage: 'komutlar'
};