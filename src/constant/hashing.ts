import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

export async function comparePass(password: string, oldPass: string) {
  return await bcrypt.compare(password, oldPass);
}
