import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const source = from([
  { name: 'joe', age: 30 },
  { name: 'frank', age: 20 },
  { name: 'ryan', age: 50 },
]);
const eg = source.pipe(map((item) => item.name));
eg.subscribe((v) => console.log(v));
