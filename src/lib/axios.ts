import axios from 'axios';
import { browser } from 'webextension-polyfill-ts';

const axiosClient = axios.create({
  baseURL: 'https://syncroomplus.koeda.me/',
  headers: { 'X-SYNCROOM-Plus-Version': browser.runtime.getManifest().version },
});

export default axiosClient;
