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

  sendInvitationEmail(input: InvitationEmailDetails) {
    'use strict';

    // Provide the full path to your config.json file.
    aws.config.accessKeyId = environment.AWS_ACCESS_KEY_ID;
    aws.config.secretAccessKey = environment.AWS_SECRET_ACCESS_KEY;
    aws.config.region = 'us-east-1';

    // Replace sender@example.com with your "From" address.
    // This address must be verified with Amazon SES.
    const sender = 'Khoi Phan <khoiphan21@gmail.com>';

    // Replace recipient@example.com with a "To" address. If your account
    // is still in the sandbox, this address must be verified.
    const recipient = 'khoiphan21@gmail.com';

    // The subject line for the email.
    const subject = 'Irisa Invitation Link';

    // The email body for recipients with non-HTML email clients.
    const bodyText = 'Amazon SES Test (SDK for JavaScript in Node.js)\r\n'
      + 'This email was sent with Amazon SES using the '
      + 'AWS SDK for JavaScript in Node.js.';

    // The HTML body of the email.
    const bodyHTML = `
    <html>
      <head></head>
      <body>
        <h1>Invitation to shared document</h1>
        <p>Click on this link to access document:
          <a href='http://localhost:4200/document/${input.documentId}'>Shared Document</a>
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

    // Try to send the email.
    ses.sendEmail(params, (err, data) => {
      // If something goes wrong, print an error message.
      if (err) {
        console.log(err.message);
      } else {
        console.log('Email sent! Message ID: ', data.MessageId);
      }
    });
  }
}
