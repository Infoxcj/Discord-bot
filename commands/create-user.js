/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crear-usuario')
    .setDescription('Crea un usuario en la base de datos')
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('Tu primer nombre')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('contraseña')
        .setDescription('Tu contraseña')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('email')
        .setDescription('Tu correo electronico')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('pais')
        .setDescription('Tu pais de residencia')
        .setRequired(true)),
  async execute(interaction) {
    try {
      const name = interaction.options.getString('nombre');
      const password = interaction.options.getString('contraseña');
      const email = interaction.options.getString('email');
      const country = interaction.options.getString('pais');

      const newUser = {
        name,
        email,
        password,
        passwordConfirm: password,
      };

      await axios.post('http://api.cup2022.ir/api/v1/user', newUser);

      db.prepare(`
      INSERT INTO users (discord_id, name, email, password, country)
      VALUES (?, ?, ?, ?, ?)
    `).run(interaction.user.id, name, email, password, country);
      await interaction.reply('Registro exioso!');
    } catch (error) {
      console.log(error?.response?.data?.message);
      if (error?.response?.data?.message) {
        return await interaction.reply('La contraseña debe contener 8 caracteres');
      }
      switch (error.message) {
        case 'UNIQUE constraint failed: users.discord_id':
          return await interaction.reply('Tu usuario ya se encuentra registrado');
        case 'UNIQUE constraint failed: users.email':
          return await interaction.reply('Tu email ya se encuentra registrado');
        default:
          return await interaction.reply('Hubo un error');
      }
    }
  },
};