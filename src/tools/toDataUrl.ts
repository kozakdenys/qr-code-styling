import { Window } from "../types";

export default async function toDataURL(url: string, window: Window): Promise<string> {
  return new Promise((resolve) => {
    const xhr = new window.XMLHttpRequest();
    xhr.onload = function () {
      const reader = new window.FileReader();
      reader.onloadend = function () {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
}
