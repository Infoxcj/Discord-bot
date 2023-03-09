const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hola')
    .setDescription('Responde con un chao!'),
  async execute(interaction) {
    await interaction.reply('Chao!');
  },
};