const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios').default;
const db = require('../database');
const { read, intToRGBA } = require('jimp');

const createEmbed = async (country, weather) => {
  const image = await read(country.flags.png);
  const { r, g, b } = intToRGBA(image.getPixelColor(0, 0));
  const exampleEmbed = new EmbedBuilder()
    .setColor([r, g, b])
    .setTitle(country.name.common)
    .setURL(`https://en.wikipedia.org/wiki/${country.name.common}`)
    .setDescription('Informacion del pais')
    .setThumbnail(`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`)
    .addFields(
      { name: 'Capital', value: country.capital[0], inline: true },
      { name: 'Subregion', value: country.subregion, inline: true },
      { name: 'Poblacion', value: `${country.population} Habitantes`, inline: true },
      { name: 'Temperatura', value: `${weather.main.temp} °C`, inline: true },
      { name: 'Clima', value: `${weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.substring(1)}`, inline: true },
    )
    .setImage(country.flags.png)
    .setTimestamp()
    .setFooter({ text: 'Finito', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  return exampleEmbed;
};

const getEmbedByCountry = async (country) => {
  const { data: [countryApi] } = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
  const [lat, lon] = countryApi.latlng;
  const { data: weatherApi } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=561df2b8d38e31cb4116a3b541206b1d&units=metric&lang=es`);
  const embed = await createEmbed(countryApi, weatherApi);
  return embed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-pais')
    .setDescription('Muestra la informacion del pais')
    .addStringOption(option =>
      option.setName('pais')
        .setDescription('Nombre del pais')),
  async execute(interaction) {
    const country = interaction.options.getString('pais');
    const discordId = interaction.user.id;
    try {
      if (country) {
        const embed = await getEmbedByCountry(country);
        return await interaction.reply({ embeds: [embed] });
      }
      const { country: countryDB } = db.prepare(`
        SELECT country FROM users WHERE discord_id = ?
      `).get(discordId);
      const embed = await getEmbedByCountry(countryDB);
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.reply('El pais no existe! Intenta con otro');
    }
  },
};