import { send } from 'micro';
import home from './home.js';

console.log('im running');
export default async function (req, res) {
  send(res, 200, home);
}
