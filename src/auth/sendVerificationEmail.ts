import { Payload } from '..';
import { PayloadRequest } from '../express/types/payloadRequest';
import { Config } from '../config/types';
import { Collection } from '../collections/config/types';
import { User } from './types';

type Args = {
  config: Config,
  collection: Collection,
  user: User
  disableEmail: boolean
  req: PayloadRequest
  token: string
  sendEmail: Payload['sendEmail']
}

async function sendVerificationEmail(args: Args): Promise<void> {
  // Verify token from e-mail
  const {
    config,
    sendEmail,
    collection: {
      config: collectionConfig,
    },
    user,
    disableEmail,
    req,
    token,
  } = args;

  if (!disableEmail) {
    const defaultVerificationURL = `${config.serverURL}${config.routes.admin}/${collectionConfig.slug}/verify/${token}`;

    let html = `A new account has just been created for you to access <a href="${config.serverURL}">${config.serverURL}</a>.
    Please click on the following link or paste the URL below into your browser to verify your email:
    <a href="${defaultVerificationURL}">${defaultVerificationURL}</a><br>
    After verifying your email, you will be able to log in successfully.`;

    // Allow config to override email content
    if (typeof collectionConfig.auth.verify.generateEmailHTML === 'function') {
      html = await collectionConfig.auth.verify.generateEmailHTML({
        req,
        token,
        user,
      });
    }

    let subject = 'Verify your email';

    // Allow config to override email subject
    if (typeof collectionConfig.auth.verify.generateEmailSubject === 'function') {
      subject = await collectionConfig.auth.verify.generateEmailSubject({
        req,
        token,
        user,
      });
    }

    sendEmail({
      from: `"${config.email.fromName}" <${config.email.fromAddress}>`,
      to: user.email,
      subject,
      html,
    });
  }
}

export default sendVerificationEmail;