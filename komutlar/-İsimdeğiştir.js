const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json')
exports.run = (client ,message ,args) => {
	let sunucuadı = 'Deneme' // buraya sunucu adınızı yazın
    if(!message.member.roles.cache.has(" kayıtcı rol ıd") && !message.member.hasPermission('ADMİNİSTRATOR')) 
        return message.channel.send(
          new Discord.MessageEmbed()
            .addField(`${tag} ${sunucuadı}` , `Bu Komutu kullanmak için yeterli yetkiye sahip degilsin!!`)
            .setColor('RED')
			)
let kullanıcı = message.mentions.members.first()
		if(!kullanıcı)	
			return message.channel.send(`Lutfen Bir Kullanıcı Belirtin`)
	let isim = args[1]
	let yaş = args[2]
	let tag = 'る' //tagınız varsa başa koyar yok ise boş birakiniz.
	if(!isim)
		return message.channel.send(
			new Discord.MessageEmbed()
			.addField(`Bilgi` , `Lutfen Bir İsimi Belirtin !!`)
			.setColor('RED')
		)
	if(!yaş)
		return message.channel.send(
			new Discord.MessageEmbed()
			.addField(`Bilgi` , `Lutfen Bir yaş Belirtin !!`)
			.setColor('RED')
		)
kullanıcı.setNickname(`${tag} ${isim} | ${yaş}`)

const neria = new Discord.MessageEmbed()
.setColor("BLACK")
.setTitle("• Kullanıcının takma adı değiştirildi.")
.setDescription(`
**Değiştirilen Kullanıcı :** ${kullanıcı}
**Düzenlenmiş Kullanıcı Adı :** \`${tag} ${isim} | ${yaş}\`

`)

  .setThumbnail(kullanıcı.user.avatarURL({dynamic: true}))
 .setFooter(message.author.username,
message.author.avatarURL( { dynamic : true } ))
  .setTimestamp()
message.channel.send(neria)
};
exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['nick'],
	permLevel: 0
}

exports.help = {
	name: 'isim',
}
