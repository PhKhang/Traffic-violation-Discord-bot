const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const HTMLParser = require('node-html-parser');
const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient()

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkvar")
        .setDescription("Check for traffic violations")
        .addStringOption(option =>
            option
                .setName("plate")
                .setDescription("Enter the license plate number")
        ),
    async execute(interaction) {
        const plate = interaction.options.getString("plate") ?? "";
        var vehicleType = 2;

        if (plate.trim() === "") {
            return await interaction.reply("Please enter a license plate number");
        }

        const params = new URLSearchParams();
        params.append('BienSo', plate);
        params.append('LoaiXe', vehicleType);

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: params
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(async data => {
                root = HTMLParser.parse(data);
                const violations = root.querySelectorAll('center h3')[1].text;

                await prisma.user.create({
                    data: {
                        discordId: interaction.user.id,
                        plate: plate,
                        accessCount: 1
                    },
                })
                console.log("User created");

                console.log(violations);
                await interaction.reply(violations);
            })
            .catch(async error => {
                console.error('Error:', error);
                await interaction.reply("An error occurred while processing the request");
            });

        // await interaction.reply("Processing request failed");
    }
};