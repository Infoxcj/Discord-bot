const axios = require('axios').default;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const createFields = (price, high, low, change, crypto, coin, monto) => {
  if (monto) {
    return [
      { name: 'El precio de hoy', value: price, inline: true },
      { name: 'El precio mas alto de hoy', value: high, inline: true },
      { name: 'El precio mas bajo de hoy', value: low, inline: true },
      { name: 'Diferencia en 24 horas', value: `${change} %`, inline: true },
      { name: 'Monto', value: `${monto.toFixed(4)} ${crypto}`, inline: true },
    ];
  } else {
    return [
      { name: 'El precio de hoy', value: price, inline: true },
      { name: 'El precio mas alto de hoy', value: high, inline: true },
      { name: 'El precio mas bajo de hoy', value: low, inline: true },
      { name: 'Diferencia en 24 horas', value: `${change} %`, inline: true },
    ];
  }
};

const createEmbed = (price, high, low, change, crypto, coin, monto) => {
  const fields = createFields(price, high, low, change, crypto, coin, monto);
  const exampleEmbed = new EmbedBuilder()
    .setTitle('Cotizador')
    .setColor(0xFFFFFF)
    .setDescription(`Cotizando ${crypto} a ${coin}`)
    .addFields(fields);
  return exampleEmbed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cotizador')
    .setDescription('Cotiza una moneda en la divisa que eligas!')
    .addStringOption(option =>
      option.setName('cripto')
        .setDescription('La cripto a cotizar')
        .setRequired(true)
        .addChoices(
          { name: 'Bitcoin', value: 'BTC' },
          { name: 'Ethereum', value: 'ETH' },
          { name: 'AXS', value: 'AXS' },
          { name: 'Binance Coin', value: 'BNB' },
        ))
    .addStringOption(option =>
      option.setName('divisa')
        .setDescription('La moneda a mostrar')
        .setRequired(true)
        .addChoices(
          { name: 'Dolar', value: 'USD' },
          { name: 'Euros', value: 'EUR' },
          { name: 'Pesos argentinos', value: 'ARS' },
          { name: 'Bolivares', value: 'VES' },
        ))
    .addStringOption(option =>
      option.setName('monto')
        .setDescription('El monto a cotizar')
    ),
  async execute(interaction) {
    const crypto = interaction.options.getString('cripto');
    const coin = interaction.options.getString('divisa');
    const amount = interaction.options.getString('monto');

    try {
      const { data } = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${coin}`);

      const displayData = data.DISPLAY[crypto][coin];
      const priceRaw = data.RAW[crypto][coin].PRICE;

      const monto = amount / priceRaw;


      const { PRICE: price, HIGH24HOUR: high, LOW24HOUR: low, CHANGEPCT24HOUR: change } = displayData;

      const embed = createEmbed(price, high, low, change, crypto, coin, monto);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.reply('Hubo un error.');
    }
  },
};