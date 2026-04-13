import PocketBase from 'pocketbase';

// Single shared PocketBase client instance
const pb = new PocketBase('http://127.0.0.1:8090');

export default pb;
