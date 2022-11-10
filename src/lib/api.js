import axios from 'axios';
import {apiUrl} from 'Wook_Market/app.json';


export const api = axios.create({
  baseURL: apiUrl,
});
