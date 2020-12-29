const Discord = require('discord.js');//
const client = new Discord.Client();//
const ayarlar = require('./ayarlar.json');//
const chalk = require('chalk');//
const moment = require('moment');//
var Jimp = require('jimp');//
const { Client, Util } = require('discord.js');//
const fs = require('fs');//
const db = require('quick.db');//
const express = require('express');//
require('./util/eventLoader.js')(client);//
const path = require('path');//
const snekfetch = require('snekfetch');//
const ms = require('ms');//
const tags = require('common-tags')
//

var prefix = ayarlar.prefix;//
//
const log = message => {//
    console.log(`${message}`);//
};

client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./komutlar/', (err, files) => {//
    if (err) console.error(err);//
    log(`‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒
    ${files.length} komut yüklenecek.
‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒`);//
    files.forEach(f => {//
        let props = require(`./komutlar/${f}`);//
        log(`[KOMUT] | ${props.help.name} Eklendi.`);//
        client.commands.set(props.help.name, props);//
        props.conf.aliases.forEach(alias => {//
            client.aliases.set(alias, props.help.name);//
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//------------------------------------------------------------------------------------------------------------\\


client.on("message" , async msg => {
  
  if(!msg.guild) return;
  if(msg.content.startsWith(ayarlar.prefix+"afk")) return; 
  
  let afk = msg.mentions.users.first()
  
  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`)
  
  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`)
 if(afk){
   const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`)
   const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`)
   if(msg.content.includes(kisi3)){

       msg.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`<@` + msg.author.id + `> Etiketlediğiniz Kişi Afk \nSebep : ${sebep}`))
   }
 }
  if(msg.author.id === kisi){

       msg.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`))
   db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkid_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`)
    msg.member.setNickname(isim)
    
  }
  
});


//--------------------------------------------------------------------------------------\\

client.on('guildMemberAdd', async(member) => {
let rol = member.guild.roles.cache.find(r => r.name === "Cezalı");
let cezalımı = db.fetch(`cezali_${member.guild.id + member.id}`)
let sürejail = db.fetch(`süreJail_${member.id + member.guild.id}`)
if (!cezalımı) return;
if (cezalımı == "cezali") {
member.roles.add(ayarlar.JailCezalıRol)
 
member.send("Cezalıyken Sunucudan Çıktığın için Yeniden Cezalı Rolü Verildi!")
 setTimeout(function(){
    // msg.channel.send(`<@${user.id}> Muten açıldı.`)
db.delete(`cezali_${member.guild.id + member.id}`)
    member.send(`<@${member.id}> Cezan açıldı.`)
    member.roles.remove('cezalı rol id');
  }, ms(sürejail));
}
})

//--------------------------------------------------------------------------------------\\

client.on('guildMemberAdd', async(member) => {
let mute = member.guild.roles.cache.find(r => r.name === "Chat Muted");
let mutelimi = db.fetch(`muteli_${member.guild.id + member.id}`)
let süre = db.fetch(`süre_${member.id + member.guild.id}`)
if (!mutelimi) return;
if (mutelimi == "muteli") {
member.roles.add(ayarlar.MuteliRol)
 
member.send("Muteliyken Sunucudan Çıktığın için Yeniden Mutelendin!")
 setTimeout(function(){
    // msg.channel.send(`<@${user.id}> Muten açıldı.`)
db.delete(`muteli_${member.guild.id + member.id}`)
    member.send(`<@${member.id}> Muten açıldı.`)
    member.roles.remove('790156526769799208');//chat muted rol ıd
  }, ms(süre));
}
})

//--------------------------------------------------------------------------------------\\


client.on('guildMemberAdd', async member => {
const data = require('quick.db')
const asd = data.fetch(`${member.guild.id}.jail.${member.id}`)
if(asd) {
let data2 = await data.fetch(`jailrol_${member.guild.id}`)
let rol = member.guild.roles.cache.get(data2)
if(!rol) return;
let kişi = member.guild.members.cache.get(member.id)
kişi.roles.add(rol.id);
kişi.roles.cache.forEach(r => {
kişi.roles.remove(r.id)
data.set(`${member.guild.id}.jail.${kişi.id}.roles.${r.id}`, r.id )})
    data.set(`${member.guild.id}.jail.${kişi.id}`)
  const wasted = new Discord.MessageEmbed()
  .setAuthor(member.user.tag, member.user.avatarURL({ dynamic : true }))
  .setColor(`#0x800d0d`)
  .setDescription(`Dostum hadi ama !!! Jaildan Kaçamazsın ikimizde birbirimizi kandırmayalım...!`)
  .setTimestamp()
    member.send(wasted)
} 
  
  
})

//--------------------------------------------------------------------------------------\\

client.on("message", async msg => {
  
  
 const i = await db.fetch(`kufur_${msg.guild.id}`)
    if (i == "acik") {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
        if (kufur.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                          
                      return msg.channel.send(new Discord.MessageEmbed().setDescription(`${msg.author} Bu sunucuda küfür filtresi etkin.`).setColor('0x800d0d').setAuthor(msg.member.displayName, msg.author.avatarURL({ dynamic: true })).setTimestamp()).then(x => x.delete({timeout: 5000}));
  
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  
  
 const i = db.fetch(`${oldMessage.guild.id}.kufur`)
    if (i) {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq","amguard","seksüel","sekssüel"];
        if (kufur.some(word => newMessage.content.includes(word))) {
          try {
            if (!oldMessage.member.hasPermission("BAN_MEMBERS")) {
                  oldMessage.delete();
                          
                      return oldMessage.channel.send(new Discord.MessageEmbed().setDescription(`${oldMessage.author} Bu sunucuda küfür filtresi etkin.`).setColor('0x800d0d').setAuthor(oldMessage.member.displayName, oldMessage.author.avatarURL({ dynamic: true })).setTimestamp()).then(x => x.delete({timeout: 5000}));
  
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});


//--------------------------------------------------------------------------------------\\


//--------------------------------------------------------------------------------------\\

client.on("message", msg => {
 if(!db.has(`reklam_${msg.guild.id}`)) return;
        const reklam = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg",];
        if (reklam.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                    return msg.channel.send(new Discord.MessageEmbed().setDescription(`${msg.author} Bu sunucuda reklam filtresi etkin.`).setColor('0x800d0d').setAuthor(msg.member.displayName, msg.author.avatarURL({ dynamic: true })).setTimestamp()).then(x => x.delete({timeout: 5000}));
  
 
  msg.delete(3000);                              
 
            }              
          } catch(err) {
            console.log(err);
          }
        }
    });

//--------------------------------------------------------------------------------------\\

client.on('messageDelete', message => {
  const data = require("quick.db")
  data.set(`snipe.mesaj.${message.guild.id}`, message.content)
  data.set(`snipe.id.${message.guild.id}`, message.author.id)

})



const iltifatlar = [
  "Ateşin annesi çok güzel",
  "Ateş tam bir orospo çocuğu",
  "metenin annesi kaşar", // bu şekilde arttırabilirsiniz
];

client.on("ready", async () => {
  let sunucuID = "786868630658089000"; // Sunucu ID
  let kanalID = "786868807485882378"; // Kanal ID
  let birinciRol = "792350607725822002"; // İlk rol ID (Erkek rolü)
  let ikinciRol = "786868831624364061"; // Diğer rol ID (Kız rolü)
  setInterval(() => {
    let sunucu = client.guilds.get(sunucuID);
    client.channels.get(kanalID).send(`${sunucu.members.filter(uye => (uye.roles.has(birinciRol) || uye.roles.has(ikinciRol)) && uye.presence.status !== "offline").random()} ${iltifatlar[Math.floor(Math.random() * iltifatlar.length)]}`);
  }, 10*60*1000);
});

client.on("guildMemberAdd", async(member) => {
  let djstürkiye = await db.get(`forceban_${member.guild.id}`)
  if(djstürkiye && djstürkiye.some(id => `k${member.user.id}` === id)) {
    try {
      await member.guild.owner.user.send(new Discord.MessageEmbed().setTimestamp().setFooter(client.user.username + " Force Ban", client.user.avatarURL()).setDescription(`Bir kullanıcı **${member.guild.name}** adlı sunucuna girmeye çalıştı! Force banı olduğu için tekrar yasaklandı. \n**Kullanıcı:** ${member.user.id} | ${member.user.tag}`))
      await member.user.send(new Discord.MessageEmbed().setTimestamp().setFooter(client.user.username + " Force Ban", client.user.avatarURL()).setDescription(`**${member.guild.name}** sunucusundan force banlı olduğun için yasaklandın!`))
      member.members.ban({reason: 'Forceban'})
    } catch(err) { console.log(err) }
  }
})


//mesaj sayıcı
client.on("message", message => {
  db.add(`msayar_${message.author.id}`, 1)
})






                  //  BU ALAN DİĞER GUARD SİSTEMLERİ İÇİN AYIRILMIŞTIR //





// SNİPE //
client.on('messageDelete', message => {
  db.set(`snipe.mesaj.${message.guild.id}`, message.content)
  db.set(`snipe.id.${message.guild.id}`, message.author.id)
})
// SNİPE //

//////////////////////////////////////////////////////////////////////////////////////////////
//
client.on("message", async message =>  {
   if(message.author.bot || message.channel.type === "dm") return;
         if (message.content === '.join' && message.member.hasPermission("ADMINISTRATOR")) {
        const channel = message.member.voice.channel;
           if(!message.member.voice.channel) return message.channel.send("Bir ses kanalında olman lazım!").then(m => m.delete(9000));
        channel.join()
            
                message.reply("Bot odaya giriş yaptı.").then(m => m.delete(9000));

      }
           if (message.content === '.join' && !message.member.hasPermission("ADMINISTRATOR")) {
     message.reply("Bu komutu sadece yöneticiler kullanabilir!").then(m => m.delete(9000));
             return
      }
      if (message.content === '.leave' && message.member.hasPermission("ADMINISTRATOR")) {
        const channel = message.member.voice.channel;
        if(!message.member.voice.channel) return message.channel.send("Bir ses kanalında olman lazım!").then(m => m.delete(9000));
        channel.leave()
        
                message.reply("Bot odadan çıkış yaptı.").then(m => m.delete(9000));

      }
             if (message.content === '.leave' && !message.member.hasPermission("ADMINISTRATOR")) {
     message.reply("Bu komutu sadece yöneticiler kullanabilir!").then(m => m.delete(9000));
             return
      }
  
  })
//Oto Tag//Oto Tag//Oto Tag//Oto Tag//Oto Tag
client.on("userUpdate", function(oldUser, newUser){

  let kanal =client.channels.cache.get('756857871408300048')//kanal log ıd
     if(oldUser.username !== newUser.username) {
       const  takmaad =  client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).displayName

          
        if(!newUser.username.includes("⚚")&& client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.cache.has("756857869000769602")) {
           if(!client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.remove("756857869000769602")) return newUser.guild.owner.send("ototag rolü olmadığı için rol alınamadı")
             client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.remove("756857869000769602")

            let değişeceksembol1 = takmaad.replace(/☆/g, "⚚");
              client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).setNickname(değişeceksembol1)   
               if(!kanal) return newUser.guild.owner.send("ototag bilgi kanalı olmadığı için rol alındı ama kanala yazı yazılamadı")
          
            let embed1 = new Discord.MessageEmbed()
            .setColor("#000002")
            .setDescription(`**${newUser}, tagı çıkardığı için Bot tarafından <@&756857869000769602> rolü alındı!**`)
            .setFooter(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
            .setTimestamp()
            kanal.send(embed1)
                
       
        } 
         if(newUser.username.includes("⚚")&& !client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.cache.has("756857869000769602")) {

           if(client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.cache.has("651163710705893386")) return;
           
                      if(client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.cache.has("634806986143301654")) return;

             if(!client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.add("756857869000769602"))   return newUser.guild.owner.send("ototag rolü olmadığı için rol verilemedi")
              client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).roles.add("756857869000769602")
                let değişeceksembol2 = takmaad.replace(/★/g, "⚚");
                 client.guilds.cache.get("756857868543721545").members.cache.get(newUser.id).setNickname(değişeceksembol2)    
                   if(!kanal) return newUser.guild.owner.send("ototag bilgi kanalı olmadığı için rol verirdi ama kanala yazı yazılamadı")
           
            let embed1 = new Discord.MessageEmbed()
            .setColor("#000002")
            .setDescription(`**${newUser}, tagı aldığı için Bot tarafından <@&756857869000769602> rolü verildi!**`)
                
              .setFooter(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
             .setTimestamp()
            kanal.send(embed1) 
         }
        }
      })
//Oto Tag//Oto Tag//Oto Tag//Oto Tag//Oto Tag//Oto Tag


client.on("message", async message =>  {
   if(message.author.bot || message.channel.type === "dm") return;
  if(message.content.toLowerCase() ==="sa"||message.content.toLowerCase() ==="sea"||message.content.toLowerCase() ==="selamün aleyküm"||message.content.toLowerCase() ==="selamun aleykum"){
    message.reply("**Aleyküm Selam Dostum Hoşgeldin** <a:tatl:775410836654260244>")
  }
})

client.on("message", async message =>  {
   if(message.author.bot || message.channel.type === "dm") return;
  if(message.content ===".tag"||message.content ==="tag"||message.content ==="!tag"){
    message.channel.send(`**⚚**`)
  }
})

client.on("message",async message => {
 if(message.channel.type === "dm" || message.author.bot) return
   if(message.content === "!link"||message.content === ".link"||message.content === "link") {
     message.channel.send("https://discord.gg/gSN2EuWfER")
   }
})

//  BU ALAN DİĞER GUARD SİSTEMLERİ İÇİN AYIRILMIŞTIR //


//KOMUTLAR



//---------------------------------------------------------------------------------------------\\
/////BOTU ODAYA SOKARSINIZ
 /*client.on("ready", () => {
   client.channels.cache.get('786868842080632852').join();
})*/


//---------------------------------------------------------------------------------------------\\

client.on("messageDelete", async (message, channel) => {
if(message.author.bot || message.channel.type === "dm") return;
   var Attachment = (message.attachments)
  if (Attachment){
     if(Attachment.array()[0]!==undefined) return
       
     
  }
  
// MESAJ SİLİNDİ LOG
 let sChannel2 = message.guild.channels.cache.get("756857871408300046")
    if(!sChannel2) return
  const embed = new Discord.MessageEmbed()
  .setColor("#000000")
  .setAuthor(`Mesaj silindi.`, message.author.avatarURL())
  .addField("**Kullanıcı Tag**", message.author.tag, true)
  .addField("**Kanal Adı**", message.channel.name, true)
  .addField("**Silinen Mesaj**", "```" + message.content + "```")
  .setThumbnail(message.author.avatarURL())
    .setTimestamp()  
  .setFooter(`Bilgilendirme  • bügün saat ${message.createdAt.getHours()+3}:${message.createdAt.getMinutes()}`, `${client.user.displayAvatarURL()}`)
  sChannel2.send(embed);
});
// MESAJ LOGU DÜZENLENDİ 
client.on("messageUpdate", async (oldMessage, newMessage) => {
if(newMessage.author.bot || newMessage.channel.type === "dm") return;
  let sChannel3 = newMessage.guild.channels.cache.get("756857871408300046")
  if (oldMessage.content == newMessage.content) return;
  if(!sChannel3) return
  let embed = new Discord.MessageEmbed()
  .setColor("#ffffff")
  .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
  .addField("**Kullanıcı**", newMessage.author)
  .addField("**Kanal Adı**", newMessage.channel.name)
  .addField("**Eski Mesaj**", "```" +oldMessage.content+"```" , true)
  .addField("**Yeni Mesaj**", "```" +newMessage.content+"```" , true)
  .setThumbnail(newMessage.author.avatarURL())
    .setTimestamp()  
  .setFooter(`Bilgilendirme  • Bügün saat ${newMessage.createdAt.getHours()+3}:${newMessage.createdAt.getMinutes()}`, `${client.user.displayAvatarURL()}`)
  sChannel3.send(embed)
});
// FOTO LOG
client.on("messageDelete", async (message, channel) => {
if(message.author.bot || message.channel.type === "dm") return;
  
  let sChannel3 = message.guild.channels.cache.get("790782315025530880")
    if(!sChannel3) return

 var Attachment = (message.attachments)
  if (Attachment){
   if(Attachment.array()[0]!==undefined){

       let embed = new Discord.MessageEmbed()
  .setColor("#210481")
  .setAuthor(`Foto Log `, message.author.avatarURL())
  .addField("**Kullanıcı**", message.author.tag,true)
  .addField("**Kanal Adı**", message.channel.name,true)
  .setImage(Attachment.array()[0].proxyURL)
    .setTimestamp()  
  //.setFooter(`Bilgilendirme  • bügün saat ${newMessage.createdAt.getHours()+3}:${newMessage.createdAt.getMinutes()}`, `${client.user.displayAvatarURL()}`)
  sChannel3.send(embed)
   //sChannel3.send(message.author ,new Discord.MessageAttachment(Attachment.array()[0].proxyURL))
   // sChannel3.send("----------------------------------------------------")
   }
  }
});




//// K O R U M A   G U A R D     K I S M I  \\\\
//// K O R U M A   G U A R D     K I S M I  \\\\


/*client.on("roleUpdate", async function(oldRole, newRole) {
  
   const bilgilendir = await newRole.guild.fetchAuditLogs({type: "ROLE_UPLATE"}).then(hatırla => hatırla.entries.first())
    let yapanad= bilgilendir.executor;
  let idler= bilgilendir.executor.id;
  if(idler === "619913888921813003") return
  if(oldRole.hasPermission("ADMINISTRATOR")) return
  
   setTimeout(() => {

     if(newRole.hasPermission("ADMINISTRATOR")){
   newRole.setPermissions((newRole.permissions-8))    
 }
     
 if(newRole.hasPermission("ADMINISTRATOR")){
  
     if(!client.guilds.cache.get(newRole.guild.id).channels.cache.has("756857871408300045")) return newRole.guild.owner.send(`Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi** Alındı. \Rol: **${newRole.name}** <a:sonsuz:788307934940495883>`)

  client.channels.cache.get("756857871408300045").send(`Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi Alındı**. \Rol: **${newRole.name}** <a:sonsuz:788307934940495883>`)
 }
      }, 1000)
  })*/








//---------------------------------------------- NEW GUARD V12 ----------------------------------------------\\


//------------------------KANAL KORUMA-----------------------------\\

client.on("channelDelete", async channel => {
  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());
  if (entry.executor.id === client.user.id) return;
//  if (entry.executor.id === channel.guild.owner.id) return
  if(ayarlar.korumakanal) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Bir Kanal Silindi!");
    embed.addField("Kanalı Silen", "> `" + entry.executor.tag + "`");
    embed.addField("Kanalı Silen İD", "> `" + entry.executor.id + "`");
    embed.addField("Silinen Kanal", "> `" + channel.name + "`");
    embed.addField("Sonuç;", "Kanal Tekrar Açıldı");
    embed.setThumbnail(entry.executor.avatarURL());
    embed.setFooter(channel.guild.name, channel.guild.iconURL());
    embed.setColor("f5f5f5");
    embed.setTimestamp();
    client.channels.cache
      .get(ayarlar.korumakanal)
      .send(embed)
      .then(channel.clone().then(x => x.setPosition(channel.position)));
  }
});

//---------------------------ROL KORUMA------------------------------\\

client.on("roleDelete", async role => {
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  if (entry.executor.id === client.user.id) return;
 // if (entry.executor.id === role.guild.owner.id) return
  if (ayarlar.korumakanal) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Bir Rol Silindi!");
    embed.addField("Rolü Silen", "> `" + entry.executor.tag + "`");
    embed.addField("Rolü Silen İD", "> `" + entry.executor.id + "`");
    embed.addField("Silinen Rol", "> `" + role.name + "`");
    embed.addField("Sonuç;", "Rol Tekrar Açıldı");
    embed.setThumbnail(entry.executor.avatarURL());
    embed.setFooter(role.guild.name, role.guild.iconURL());
    embed.setColor("f5f5f5");
    embed.setTimestamp();
    client.channels.cache
      .get(ayarlar.korumakanal)
      .send(embed)
      .then(
        role.guild.roles.create({
          data: {
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            permissions: role.permissions,
            mentionable: role.mentionable,
            position: role.position
          },
          reason: "Silinen Rol Açıldı."
        })
      );
  }
});