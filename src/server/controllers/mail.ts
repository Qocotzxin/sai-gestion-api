/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import * as nodemailer from "nodemailer";
const SendGridTransport = require('nodemailer-sendgrid-transport');
import { SENDGRID_API_KEY } from "../config/config";

const options = {
  auth: {
    api_key: SENDGRID_API_KEY
  }
}

export const mailer = nodemailer.createTransport(SendGridTransport(options));

/**
 * Sets the email subject for the signup process based on the language.
 * @param lang: string 
 */
export function setSignupEmailSubject(lang: string) {
  return (lang === 'es') ? 'Gracias por registrarse en SAI!' : 'Thanks for registering into SAI!';
}

/**
 * Sets the email body for the signup process based on the language.
 * @param link: string
 * @param lang: string 
 */
export function setSignupEmailBody(link: string, language: string) {
  return language === 'es' ? esEmailTemplate(link) : enEmailTemplate(link);
}

function esEmailTemplate(link: string) {
  return `
  <div style="display: block; width: 600px">
    <img alt="SAI Logo" src="http://cdn.mcauto-images-production.sendgrid.net/188fcfb094e0f09e/981a841a-cca2-48d7-b337-70397c920dd8/200x200.png" width="200">
    <img alt="SAI Logo" src="http://cdn.mcauto-images-production.sendgrid.net/188fcfb094e0f09e/ce94801b-9804-41fd-8871-94fa174dff81/1280x853.jpg" height="auto" width="600">
    <div style="font-family: arial; text-align: center; background-color: coral; width: 600px; padding: 24px 0"><span style="font-size: 24px; color: white;">Bienvenido a SAI.</span></div>
    <div style="font-family: arial; text-align: center; background-color: coral; width: 600px; margin: 10px 0; padding: 50px 0;">
      <span style="font-size: 16px; color: white;">Muchas gracias por registrarse en SAI. Solo falta un paso mas para que pueda disfrutar de los beneficios de este moderno sistema de 
      gestión inmobiliario, que le va a permitir controlar y gestionar las propiedades de su negocio de manera muy rápida y simple. 
        </br>
      Por favor haga click <a style="text-decoration: none;" href=${link}><strong>aquí</strong></a> para completar el registro.
      </span>
    </div>
    
    <div style="font-family: arial; text-align: center; background-color: #4C4B4B; width: 600px; padding: 4px 0;"><span style="font-size: 12px; color: white;">Desuscribirse</span></div>
  </div>
  `;
}

function enEmailTemplate(link: string) {
  return `
  <div style="display: block; width: 600px">
    <img alt="SAI Logo" src="http://cdn.mcauto-images-production.sendgrid.net/188fcfb094e0f09e/981a841a-cca2-48d7-b337-70397c920dd8/200x200.png" width="200">
    <img alt="SAI Logo" src="http://cdn.mcauto-images-production.sendgrid.net/188fcfb094e0f09e/ce94801b-9804-41fd-8871-94fa174dff81/1280x853.jpg" height="auto" width="600">
    <div style="font-family: arial; text-align: center; background-color: coral; width: 600px; padding: 24px 0"><span style="font-size: 24px; color: white;">Welcome to SAI.</span></div>  
    <div style="font-family: arial; text-align: center; background-color: coral; width: 600px; margin: 10px 0; padding: 50px 0;">
      <span style="font-size: 16px; color: white;">Thanks for registering into SAI. There is only one more step in order for you to enjoy the benefits of this modern 
      management system for real estate businesses, which will allow you to control and manage all your business properties in a very simple and fast way.
      </br>      
      Please click <a style="text-decoration: none;" href=${link}><strong>here</strong></a> to complete the registration process.
      </span>
    </div>
    <div style="font-family: arial; text-align: center; background-color: #4C4B4B; width: 600px; padding: 4px 0;"><span style="font-size: 12px; color: white;">Unsubscribe</span></div>  
  </div>
  `;
}