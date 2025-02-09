const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const HTMLParser = require('node-html-parser');
const PrismaClient = require('@prisma/client').PrismaClient;
require("better-stack-traces").register()

const prisma = new PrismaClient()
console.log("New Prisma client created");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkvar")
        .setDescription("Check for any traffic violations")
        .addStringOption(option =>
            option
                .setName("plate")
                .setDescription("Enter the license plate number")
        )
        .addIntegerOption(option =>
            option
                .setName("vehicle-type")
                .setDescription("Enter the vehicle type (1: 🚗, 2: 🛵, 3: 🔋🛵) (default: 2)")
        )
    ,
    async execute(interaction) {
        console.log(new Date().toISOString(), "Command executed: checkvar");
        
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
                    iconURL: "https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/MeteorIconsDiscord.png"
                }
            )

        let start = Date.now();
        await interaction.deferReply()
        console.log("Defere reply sent in", Date.now() - start, "ms")

        let plate = interaction.options.getString("plate") ?? "";
        plate = plate.replaceAll(/(\.|-| )/g, "").toUpperCase();
        let vehicleType = interaction.options.getInteger("vehicle-type") ?? 2;

        if ((plate.length < 8 && plate.length != 0) || plate.length > 10) {
            return await interaction.editReply("Invalid license plate number");
        }
        if (vehicleType < 1 || vehicleType > 3) {
            vehicleType = 2;
        }

        if (interaction.options.getString("plate") === null) {
            start = Date.now();
            const users = await prisma.user.findMany({
                where: {
                    discordId: interaction.user.id
                },
                orderBy: {
                    lastAccessTime: "desc"
                }
            })
            console.log("Prisma query done in", Date.now() - start, "ms");

            if (users.length === 0) {
                return await interaction.editReply("We don't know any of your license plates :< \nPlease pass in your license plate number");
            }

            plate = users[0].plate;
            vehicleType = +users[0].vehicleType;
        }


        const params = new URLSearchParams();
        params.append('BienSo', plate);
        vehicleType = vehicleType + '';
        params.append('LoaiXe', vehicleType);

        start = Date.now();
        interaction.editReply("Calling API...");
        await fetch(url, {
            method: 'POST',
            headers: headers,
            body: params
        })
            .then(response => {
                console.log("API call done in", Date.now() - start, "ms");

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(async data => {
                console.log("Data: ", data.substring(0, 500) + "...");
                root = HTMLParser.parse(data);
                console.log("H3 amounts", root.querySelectorAll('center h3').length)
                
                if (root.querySelectorAll('center h3').length === 2) {
                    const violations = root.querySelectorAll('center h3')[0].text;
                    console.log(`${plate}: ${violations}`);
                    // interaction.editReply(`${plate}: ${violations}`); 
                    interaction.editReply({
                        content: `Kết quả cho biển số ${plate}`,
                        embeds: [
                            embed
                                .setColor("#00e078")
                                .setTitle("Không tìm thấy vi phạm nguội")
                                .setDescription(`Biển số ${plate} với loại xe là ${vehicleType} không tìm thấy lỗi vi phạm nguội. Xem thêm tại [phatnguoixe.com](https://phatnguoixe.com)`)
                                .addFields(
                                    { name: "❓ Kết quả này là sao?", value: "Biển số xe chưa vi phạm lỗi giao thông nào và không có vi phạm nào trong hệ thống Cổng thông tin điện tử Cục Cảnh sát giao thông." },
                                    { name: "🗓️ Kiểm lại lần khác", value: "Thông thường các lỗi sẽ xuất hiện sau 3 đến 15 ngày. Hãy thường xuyên kiểm tra để có kết quả mới nhất." }
                                )
                                .setThumbnail("https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/MeteorIconsBadgeCheck.png")
                                .setTimestamp()
                        ]
                    });
                } else {
                    // 51D-665.36: đã xử phạt
                    // : chưa xử phạt
                    console.log(`${plate} có lỗi vi phạm`);
                    // interaction.editReply(`⚠️ ${plate} có lỗi vi phạm: xem chi tiết tại đây [phatnguoixe.com](https://phatnguoixe.com)`);
                    interaction.editReply({
                        content: `Kết quả cho biển số ${plate}`,
                        embeds: [
                            embed
                                .setColor("#e10054")
                                .setTitle("Phát hiện vi phạm giao thông")
                                .setDescription(`Biển số ${plate} với loại xe là ${vehicleType} đã có lỗi vi phạm nguội, xem chi tiết tại [phatnguoixe.com](https://phatnguoixe.com)`)
                                .addFields(
                                    { name: "❓ Kết quả này là sao?", value: "Biển số xe đã vi phạm lỗi giao thông nào và có thông tin trong hệ thống Cổng thông tin điện tử Cục Cảnh sát giao thông." },
                                    { name: "🗓️ Kiểm lại lần khác", value: "Sau khi giải quyết lỗi vi phạm, kiểm tra lại thường xuyên để có kết quả xử lý mới nhất." }
                                )
                                .setThumbnail("https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/MeteorIconsTriangleExclamation.png")
                                .setTimestamp()
                        ]
                    });
                }

            })
            .catch(async error => {
                console.error('Error:', error);
                interaction.editReply("An error occurred while processing the request");
            });

        start = Date.now();
        await prisma.user.upsert({
            where: {
                discordId_plate: {
                    discordId: interaction.user.id,
                    plate: plate
                }
            },
            update: {
                vehicleType: +vehicleType,
                accessCount: {
                    increment: 1
                }
            },
            create: {
                discordId: interaction.user.id,
                plate: plate,
                vehicleType: +vehicleType,
                accessCount: 1
            }
        })
        console.log("Prisma upsert done in", Date.now() - start, "ms");
        // await interaction.reply("Processing request failed");
    }
};