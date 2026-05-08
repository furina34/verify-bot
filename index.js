const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot online");
});

app.listen(3000, () => {
  console.log("Web running");
});
require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');


// ======================
// สร้าง Client
// ======================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});


// ======================
// ตอนบอทออนไลน์
// ======================

client.once(Events.ClientReady, async () => {

    console.log(`${client.user.tag} ออนไลน์แล้ว`);

    // สร้าง Slash Command

    const commands = [
        new SlashCommandBuilder()
            .setName('verify')
            .setDescription('ส่งปุ่มรับยศ')
            .toJSON()
    ];

    // REST

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {

        // ลงทะเบียนคำสั่งในเซิร์ฟ

        await rest.put(

            Routes.applicationGuildCommands(
                client.user.id,

                // ======================
                // ใส่ SERVER ID ตรงนี้
                // ======================

                '1501801405047115859'
            ),

            { body: commands }
        );

        console.log('สร้าง /verify สำเร็จ');

    } catch (error) {

        console.log(error);
    }
});


// ======================
// ตอนมี Interaction
// ======================

client.on(Events.InteractionCreate, async interaction => {

    // ======================
    // Slash Command
    // ======================

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === 'verify') {

            // Embed

            const embed = new EmbedBuilder()
                .setTitle('VERIFY')
                .setDescription('กดปุ่มด้านล่างเพื่อรับยศ')
                .setColor('Blue')

                // เปลี่ยนรูปได้
                .setImage('https://media.tenor.com/6ZUs58774jwAAAAC/anime.gif');

            // ปุ่ม

            const button = new ButtonBuilder()
                .setCustomId('verify_button')
                .setLabel('กดรับยศ')
                .setStyle(ButtonStyle.Primary);

            // Row

            const row = new ActionRowBuilder()
                .addComponents(button);

            // ส่งข้อความ

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }


    // ======================
    // ตอนกดปุ่ม
    // ======================

    if (interaction.isButton()) {

        if (interaction.customId === 'verify_button') {

            // ======================
            // ใส่ ROLE ID ตรงนี้
            // ======================

            const roleId = '1501833494240821259';

            // ดึงยศ

            const role = interaction.guild.roles.cache.get(roleId);

            // ถ้าไม่เจอยศ

            if (!role) {

                return interaction.reply({
                    content: 'ไม่พบยศ',
                    ephemeral: true
                });
            }

            // เพิ่มยศ

            await interaction.member.roles.add(role);

            // ตอบกลับ

            await interaction.reply({
                content: `คุณได้รับยศ ${role.name} แล้ว`,
                ephemeral: true
            });
        }
    }
});


// ======================
// LOGIN
// ======================

client.login(process.env.TOKEN);