/* eslint-disable indent */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require('axios');
const db = require('../database');

const createEmbed = (team) => {
  const exampleEmbed = new EmbedBuilder()
    //.setColor(0x0099FF)
    .setTitle(team.name_en)
    //.setURL(`https://en.wikipedia.org/wiki/${team.name.common}`)
    .setDescription('Informacion del equipo')
    .setThumbnail(team.flag)
    .addFields(
      { name: 'Grupo', value: team.groups, inline: true },
    )
    //.setImage(team.flags.png)
    .setTimestamp()
    .setFooter({ text: 'Finito', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  return exampleEmbed;
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-equipo')
    .setDescription('Muestra informacion del equipo en el mundial')
    .addStringOption(option =>
      option.setName('equipo')
        .setDescription('Nombre del equipo')
        .setRequired(true)),
  async execute(interaction) {
    const team = interaction.options.getString('equipo');
    const discordId = interaction.user.id;
    try {

      const { token } = db.prepare(`
      SELECT token from users
      WHERE discord_id = ?
      `).get(discordId);

      const { data: response } = await axios.get('http://api.cup2022.ir/api/v1/team', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const t = (response.data.find(equipo => equipo.name_en === team));
      console.log(t);

      if (team) {
        const embed = await createEmbed(team);
        return await interaction.reply({ embeds: [embed] });
      }

    } catch (error) {
      await interaction.reply('Hubo un error');
    }
  },
};