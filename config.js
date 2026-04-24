export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const API_TOKEN = atob("ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKaGRXUWlPaUl3Wm1KbE9Ua3laRGM1T0dVMVpUQmpNRFk1WmpKbE1qUTFPVFkxTVRaaE5pSXNJbTVpWmlJNk1UYzNOVFV4TWpnek1TNDVOekVzSW5OMVlpSTZJalk1WkRReVkyWm1ZbVl5T0dJMU16aGpOVE14TXpoak5pSXNJbk5qYjNCbGN5STZXeUpoY0dsZmNtVmhaQ0pkTENKMlpYSnphVzl1SWpveGZRLktOUlhPbGQzR2xVM01nVk5fR3dRdzVHT2hQY1A0ZHIwTVMyN3N1V3RRM3M=");

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
};
