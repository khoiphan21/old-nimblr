import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UUID } from '../document/command/document-command.service';
import { User } from 'src/app/classes/user';

const aws = require('aws-sdk');

export interface InvitationEmailDetails {
  email: string;
  documentId: UUID;
  sender: User;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  async sendInvitationEmail(input: InvitationEmailDetails) {

    // Provide the full path to your config.json file.
    aws.config.accessKeyId = environment.AWS_ACCESS_KEY_ID;
    aws.config.secretAccessKey = environment.AWS_SECRET_ACCESS_KEY;
    aws.config.region = 'us-east-1';

    // This address must be verified with Amazon SES.
    const sender = 'Modulr Tech <contact@modulrtech.com>';

    const recipient = input.email;

    // The subject line for the email.
    const subject = 'Irisa Invitation Link';

    const domain = 'localhost:4200';
    // The email body for recipients with non-HTML email clients.
    const bodyText = `Invitation to shared document: http://${domain}/document/${input.documentId}`;

    // The HTML body of the email.
    const bodyHTML = `
    <html>
      <head></head>
      <body>
        <h1>Invitation to shared document</h1>
        <p>Click on this link to access document:
          <a href='http://${domain}/document/${input.documentId};email=${input.email}'>Shared Document</a>
        </p>
      </body>
    </html>`;

    // The character encoding for the email.
    const charset = 'UTF-8';

    // Create a new SES object.
    const ses = new aws.SES();

    // Specify the parameters to pass to the API.
    const params = {
      Source: sender,
      Destination: {
        ToAddresses: [
          recipient
        ],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: charset
        },
        Body: {
          Text: {
            Data: bodyText,
            Charset: charset
          },
          Html: {
            Data: bodyHTML,
            Charset: charset
          }
        }
      }
    };

    await this.send(ses, params);
  }

  private async send(service: any, params: any) {
    return new Promise((resolve, reject) => {
      // Try to send the email.
      service.sendEmail(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
          console.log('Email sent! Message ID: ', data.MessageId);
        }
      });
    });
  }
}
