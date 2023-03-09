const { SlashCommandBuilder } = require('discord.js');

const getNumbers = (signo, op) => {
  const num1 = Number(op.split(signo)[0]);
  const num2 = Number(op.split(signo)[1]);
  return { num1, num2 };
};

const makeCalc = (operacion) => {
  if (operacion.includes('+')) {
    const { num1, num2 } = getNumbers('+', operacion);
    return num1 + num2;
  } else if (operacion.includes('-')) {
    const { num1, num2 } = getNumbers('-', operacion);
    return num1 - num2;
  } else if (operacion.includes('x')) {
    const { num1, num2 } = getNumbers('x', operacion);
    return num1 * num2;
  } else if (operacion.includes('/')) {
    const { num1, num2 } = getNumbers('/', operacion);
    return num1 / num2;
  } else {
    return 'Signo invalido. Intenta de nuevo';
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Suma, resta, divide o multiplica dos numeros!')
    .addStringOption(option =>
      option.setName('operacion')
        .setDescription('La operacion a realizar')
        .setRequired(true)),
  async execute(interaction) {
    const operacion = interaction.options.getString('operacion');
    const result = makeCalc(operacion);
    await interaction.reply(String(result));
  },
};
