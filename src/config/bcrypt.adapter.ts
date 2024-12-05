import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export const bcryptAdapter = {
  hash: (password: string) => {
    const slat = genSaltSync();
    return hashSync(password, slat);
  },
  compare: (password: string, hashed: string) => {
    return compareSync(password, hashed);
  },
};
