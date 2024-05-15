import bcrypt from 'bcrypt';

export const encrypt = async (password: string) => {
  return await bcrypt.hash(password, 8);
};

export const matchPassword = (password: string, userPassword: string) => {
  return bcrypt.compare(password, userPassword);
};
