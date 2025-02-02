const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const HTMLParser = require('node-html-parser');

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
        
        if (plate.trim() === "") {
            return await interaction.reply("Please enter a license plate number");
        }
        
        fetch("https://phatnguoixe.com/1026", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                BienSo: plate,
                LoaiXe: 2
            })
        });
        
        await interaction.reply('Hey');
    }
};