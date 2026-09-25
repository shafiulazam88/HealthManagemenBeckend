import nodemailer from "nodemailer";
import { envVariable } from "../../config/env";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
    host: envVariable.EMAIL_SENDER.host,
    secure: Number(envVariable.EMAIL_SENDER.port) === 465, // true for 465, false for other ports
    auth:{
        user:envVariable.EMAIL_SENDER.user,
        pass:envVariable.EMAIL_SENDER.pass
    },
    port: Number(envVariable.EMAIL_SENDER.port)

});


//we will use ejs
interface ISendEmail{
    to: string;
    subject: string;
    templateName:string;
    templateData: Record<string,any>;
    attachments?:{
        filename: string;
        content:Buffer|string;
        contentType:string;
    }[];
}

export const sendEmail = async ({to, subject, templateName, templateData, attachments}:ISendEmail) => {
    try{
          const templatePath = path.resolve(process.cwd(),`src/app/templates/${templateName}.ejs` )
          const html = await ejs.renderFile(templatePath, templateData);
          const info = await transporter.sendMail({
            from: envVariable.EMAIL_SENDER.user,
            to : to,
            subject : subject,
            html : html,
            attachments : attachments?.map((attachment) => ({
              filename: attachment.filename,
              content: attachment.content,
              contentType: attachment.contentType
            }))
          });
        //   console.log("Email sent successfully:", info.messageId);
        //   return info;
    }
    catch(error:any){
        console.error("Error sending email:", error.message);
        //todo throw appError(statuscode, message)
        throw error;
    }
}
