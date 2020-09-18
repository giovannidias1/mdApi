import { extname } from "path";

export const imageFileFilter = (type) => {
    if (type.match(/(jpg|jpeg|png|gif)$/)) {
      return true;
    }
    return false;
  };