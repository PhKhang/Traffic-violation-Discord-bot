const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const HTMLParser = require('node-html-parser');
const PrismaClient = require('@prisma/client').PrismaClient;
require("better-stack-traces").register()

const prisma = new PrismaClient()
console.log("New Prisma client created");

const url = 'https://phatnguoixe.com/1026';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin': 'https://phatnguoixe.com',
    'Pragma': 'no-cache',
    'Referer': 'https://phatnguoixe.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
};

const embed = new EmbedBuilder()
    .setFooter(
        {
            text: "Created by me, with ❤️‍🩹",
            iconURL: "https://api.iconify.design/meteor-icons:discord.svg"
        }
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkvar")
        .setDescription("Check for any traffic violations")
        .addStringOption(option =>
            option
                .setName("plate")
                .setDescription("Enter the license plate number")
        ),
    async execute(interaction) {
        let start = Date.now();
        interaction.deferReply();
        console.log("Defere reply sent in", Date.now() - start, "ms");
        start = Date.now();

        let plate = interaction.options.getString("plate") ?? "";
        plate = plate.replaceAll(' ', '').toUpperCase();
        let vehicleType = 2;

        if (interaction.options.getString("plate") === null) {
            const users = await prisma.user.findMany({
                where: {
                    discordId: interaction.user.id
                },
                orderBy: {
                    accessCount: "desc"
                }
            })
            console.log("Prisma query done in", Date.now() - start, "ms");
            start = Date.now();

            if (users.length === 0) {
                return await interaction.editReply("We don't know any of your license plates :< \nPlease pass in your license plate number");
            }

            plate = users[0].plate;
            vehicleType = users[0].vehicleType.toString();
        }


        const params = new URLSearchParams();
        params.append('BienSo', plate);
        params.append('LoaiXe', vehicleType);

        await fetch(url, {
            method: 'POST',
            headers: headers,
            body: params
        })
            .then(response => {
                console.log("API call done in", Date.now() - start, "ms");
                start = Date.now();

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(async data => {
                console.log("Data: ", data.substring(0, 100));
                root = HTMLParser.parse(data);
                const violations = root.querySelectorAll('center h3')[1].text;

                console.log(`${plate}: ${violations}`);
                interaction.editReply(`${plate}: ${violations}`);
            })
            .catch(async error => {
                console.error('Error:', error);
                interaction.editReply("An error occurred while processing the request");
            });

        if (interaction.options.getString("plate") !== null) {
            await prisma.user.upsert({
                where: {
                    discordId_plate: {
                        discordId: interaction.user.id,
                        plate: plate
                    }
                },
                update: {
                    vehicleType: vehicleType,
                    accessCount: {
                        increment: 1
                    }
                },
                create: {
                    discordId: interaction.user.id,
                    plate: plate,
                    vehicleType: vehicleType,
                    accessCount: 1
                }
            })
            console.log("Prisma upsert done in", Date.now() - start, "ms");
        }
        // await interaction.reply("Processing request failed");
    }
};