import { ErrorInterface } from "password-validator-pro";

export function passwordErrorFormatter(error: ErrorInterface[]): string[] {
  const obj: any = {};

  for (let i of error) {
    let splitError = i.message.split(",");

    for (let m of splitError) {
      const message = m.trim().replace(".", "");

      obj[splitError.indexOf(m)] = message;
    }
  }

  return obj;
}
