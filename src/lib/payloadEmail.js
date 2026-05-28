import { SendMailClient } from "zeptomail";

const ZEPTO_URL = "https://api.zeptomail.com/v1.1/email";

function normalizeTo(to) {
  return (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map((addr) =>
      typeof addr === "string"
        ? { email_address: { address: addr } }
        : { email_address: { address: addr.address, name: addr.name } },
    );
}

export const zeptoEmailAdapter = ({ defaultFromAddress, defaultFromName }) =>
  ({ payload }) => ({
    name: "zeptomail",
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      if (process.env.EMAIL_DISABLED === "true") {
        payload.logger.info({
          msg: `[email] EMAIL_DISABLED=true, skipping send to '${message.to}' subject='${message.subject}'`,
        });
        return;
      }
      const token = process.env.ZEPTO_API_KEY;
      if (!token) {
        payload.logger.error({
          msg: "[email] ZEPTO_API_KEY not set; cannot send mail.",
        });
        return;
      }
      const client = new SendMailClient({ url: ZEPTO_URL, token });
      const fromAddress =
        typeof message.from === "string"
          ? message.from
          : message.from?.address || defaultFromAddress;
      const fromName =
        (typeof message.from === "object" && message.from?.name) ||
        defaultFromName;
      return client.sendMail({
        from: { address: fromAddress, name: fromName },
        to: normalizeTo(message.to),
        subject: message.subject,
        htmlbody: message.html,
        textbody: message.text,
      });
    },
  });
