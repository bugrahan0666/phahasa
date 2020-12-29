const Discord = require('discord.js');
const db = require('quick.db')
  
exports.run = async (client, message, args) => {
let kayityetkili = '792815893439709204'//REGİSTER YETKİLİSİNİN ID 
let erkek = '792815906978922556' //KIZ 1
let unregister = '792815908434870302' //KAYITSIZ ROL ID 
let isimön = '☆' //İsmin önüne gelecek simge,tag   

  if(!message.member.roles.cache.has(kayityetkili))
  return message.channel.send(`Bu Komutu Kullanmaya Yetkin Yok!!`).then(message => message.delete({timeout: 5000}));
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  let isim = args[1]
  let yaş = args[2]
  if (!member) return message.channel.send('Bir üye etiketlemelisin.').then(message => message.delete({timeout: 5000}));  
  if (!isim) return message.channel.send('Bir isim yazmalısın.').then(message => message.delete({timeout: 5000}));
  if (!yaş) return message.channel.send('Bir yaş yazmalısın.').then(message => message.delete({timeout: 5000}));
  if (isNaN(yaş)) return message.channel.send('Yaş sadece sayı olarak kabul edilir.').then(message => message.delete({timeout: 5000}));
   
  let toplamaisim = `${isimön} ${isim} | ${yaş}`
  let kayıtlımı = await db.fetch(`kayıtlıkişi_${member}`)
    db.set(`kayıtlıisim_${member}`, toplamaisim)
  db.push(`eskiad_${member.id}`, toplamaisim)
  db.add(`toplamik_${member.id}`, 1)
   if(kayıtlımı === 'evet'){

     
 }

    
    
  let caneskiisimler = await db.fetch(`eskiad_${member.id}`) || 'Eski ismi yok'
  let toplamik = await db.fetch(`toplamik_${member.id}`) || '0'
  let eskiismi = await db.fetch(`kayıtlıisim_${member}`)  
    
  setTimeout(function(){
  member.setNickname(`${isimön} ${isim} | ${yaş}`)
  },1000)
    setTimeout(function(){
  member.roles.add(erkek)//KADIN 1  
  },2000)

    setTimeout(function(){
  member.roles.remove(unregister)
  },3000)
 
 
    
  let embed = new Discord.MessageEmbed()
  .setAuthor(`Kayıt Başarılı`,)
  .setColor('f5f5f5')
  .setDescription(`

**Kayıt edilen kullanıcı :** ${member}
**Kayıt işleminde verilen rol: ** <@&${erkek}>
**Yeni Kullanıcı Adı :** \`${toplamaisim}\`


**Bu Kullanıcının Sunucudaki Eski İsimleri [${toplamik}]** 
\n\`${caneskiisimler.join('\n')}\` ${erkek}
`)

   .setThumbnail(member.user.avatarURL({dynamic: true}))
 .setFooter(message.author.username,
message.author.avatarURL( { dynamic : true } ))
  .setTimestamp()
   .setFooter(`a!isimler Kullanıcının eski isimlerini görmek için komutu kullanın`)
  
message.channel.send(embed)
  message.react('✅')
  
  
  db.add(`kayıte_${message.author.id}`, 1)
  db.add(`toplamkayit_${message.author.id}`, 1)//eklemişz yaa q :D 
  
  
  
  
  /*let hg = new Discord.MessageEmbed()
   .setThumbnail(member.user.avatarURL({dynamic: true}))
   .setFooter(`${client.user.tag}` , `${client.user.displayAvatarURL()}`)
 .setTimestamp()  
  .setColor(0xf5f5f5)
  .setTitle("")
  .setDescription(`**Aramıza ${member} Bir \`\`Melek\`\` Geldi. <a:sartik:775815192244256798>**\n**İyiki Geldin Senle \`${message.guild.memberCount}\` Üyeye Ulaştık**`)
//.setImage("https://media.giphy.com/media/OkJat1YNdoD3W/giphy.gif")
  client.channels.cache.get("756857869676183600").send(hg)//.then(x => x.delete({timeout: 3000}));
  */

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['e'],
  permLevel: 0
}
exports.help = {
  name: 'erkek',
  description: "Erkek kullanıcıları kayıt etme komutu.",
  usage: 'kadın @kişi isim yaş'
}