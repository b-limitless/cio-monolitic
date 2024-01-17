import logger from "../logger";
import util from "util";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const readFileAsync = util.promisify(fs.readFile);

const readFile = async(templateURL:string, data:Record<string, any>) => {
  try {
    const templateFilePath = path.join(__dirname, '..', 'email-templates', templateURL);

    const readEmailTemplate = await readFileAsync(templateFilePath, "utf-8"); 
    const template = handlebars.compile(readEmailTemplate);
    const emailbody = template(data);
    return emailbody;
  } catch(err) {
    logger.log("error", err)
  }
}

export {readFile}
