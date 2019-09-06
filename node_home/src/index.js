import { send } from 'micro';
import home from './home.js';

export default async function (req, res) {
  send(res, 200, home);
}
