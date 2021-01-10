import { TypeNumber } from "../types";

interface TypesMap {
  [key: number]: TypeNumber;
}

const qrTypes: TypesMap = {};

for (let type = 0; type <= 40; type++) {
  qrTypes[type] = type as TypeNumber;
}

// 0 types is autodetect

// types = {
//     0: 0,
//     1: 1,
//     ...
//     40: 40
// }

export default qrTypes;
