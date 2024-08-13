export type UserDataType = {
  id?: string;
  name: string;
  email: string;
  password: string;
  photo?: FormData | string;
  role?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
