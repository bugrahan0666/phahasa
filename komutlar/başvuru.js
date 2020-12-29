const Discord = require("discord.js");
const db = require("quick.db");

let sahip = ["619913888921813003", "619913888921813003"];//YETKILI ID YAZ 1 //YETKILI ID YAZ 2
let rol = "BASVURU ONAYLANANA VERILECEK ROL ID YAZ";//BASVURU ONAYLANANA VERILECEK ROL ID YAZ
let log = "790817192219639861";//BAŞVURU LOG ID YAZ

module.exports.run = async (client, message, args) => {
  if (args[0] === "onayla") {
    if (!sahip.includes(message.author.id))
      return message.reply(
        "Bu Komutu Sadece Sistemde Yetkili Sahipler Kullana Bilir!"
      );
    let mem;
    let meme = message.mentions.members.first();
    let memem = message.guild.members.cache.get(args[1]);
    if (meme) {
      mem = meme;
    }
    if (memem) {
      mem = memem;
    }
    if (!mem) {
      message.reply("Bir Kişiyi Etiketlemelisin veya Id Girmelisin!");
    }
    let data = db.get(`basvuru.${mem.id}`);
    if (!data)
      return message.reply("Bahsedilen Üyenin Bir Başvuru Talebi Bulunamadı!");

    mem.roles.add(rol);
    message.channel.send(
      "Başarı ile Üyenin Başvurusu Onaylandı ve Rolü Verildi!"
    );
    mem.send(
      "Hey Tebrikler " +
        message.guild.name +
        " Sunucusunda Yetkili Olma Talebin Onaylandı!"
    );
    db.delete(`basvuru.${mem.id}`);
  } else {
    if (args[0] === "red") {
      if (!sahip.includes(message.author.id))
        return message.reply(
          "Bu Komutu Sadece Sistemde Yetkili Sahipler Kullana Bilir!"
        );
      let mem;
      let meme = message.mentions.members.first();
      let memem = message.guild.members.cache.get(args[1]);
      if (meme) {
        mem = meme;
      }
      if (memem) {
        mem = memem;
      }
      if (!mem) {
        message.reply("Bir Kişiyi Etiketlemelisin veya Id Girmelisin!");
      }
      let data = db.get(`basvuru.${mem.id}`);
      if (!data)
        return message.reply(
          "Bahsedilen Üyenin Bir Başvuru Talebi Bulunamadı!"
        );

      message.channel.send("Başarı ile Üyenin Başvurusu Reddedildi!");
      mem.send(
        "Hey Üzgünüm " +
          message.guild.name +
          " Sunucusunda Yetkili Olma Talebin Reddedildi!"
      );
      db.delete(`basvuru.${mem.id}`);
    } else {
      let s1 = "İsmin Nedir?";
      let s2 = "Kaç Yaşındasın?";
      let s3 = "Bize Ne Gibi Katkıların Ola Bilir?";
      if (!args[0])
        return message.channel.send(
          new Discord.MessageEmbed()
            
 .setFooter(message.author.username,
message.author.avatarURL( { dynamic : true } ))
  .setTimestamp()
          
          .setTitle("Başvuru Talimatları")
            .setColor("BLUE")
            .setDescription(
              `Başvuru Soruları:\n**1. ${s1}\n2. ${s2}\n3. ${s3}**\n\n\`Örnek Kullanım:\` .başvuru Can 20 Fazla Davet Yapa Bilirim`
            )
        
            .setFooter("")
          
        );
      let data = db.get(`basvuru.${message.author.id}`);
      if (!data) {
        if (!args[0]) return message.reply("**İsmin Nedir Yazman Gerek!**");
        if (!args[1]) return message.reply("**Kaç Yaşındasın Yazman Gerek!**");
        if (!args.slice(2).join(" "))
          return message.reply(
            "**Bize Ne Gibi Katkıların Olur Yazman Gerek!**"
          );
        db.set(`basvuru.${message.author.id}`, "onayla");
        let ch = message.guild.channels.cache.get(log);
        let csd = new Discord.MessageEmbed()
          .setTitle("Yeni Başvuru")
          .setColor("GREEN")
          .setThumbnail(message.guild.iconURL())
          .setDescription(
            `Başvuran: ${message.author}\nBaşvuran ID: \`${
              message.author.id
            }\`\n\nBaşvuran Bilgileri:\n**İsim:** \`${args[0]}\`\n**Yaş:** \`${
              args[1]
            }\`\n**Ne Yapa Bilir:** \`${args.slice(2).join(" ")}\``
          )
          .setTimestamp()
          .setFooter("");
        return ch.send(csd).then(mr => {
          message.channel.send(
            "Başvurun Sisteme Eklendi Lütfen Ekipten Cevap Bekle!"
          );
        });
      } else {
        message.reply("Zaten Henüz Cevaplanmamış Bir Başvurun Var!");
      }
    }
  }
};
module.exports.conf = {
  aliases: []
};

module.exports.help = {
  name: "başvuru"
};
 