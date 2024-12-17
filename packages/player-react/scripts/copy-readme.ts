import * as fs from 'node:fs';
import * as path from 'node:path';

const rootDir = path.join(__dirname, '../../../');
const readmeFiles = ['./README.md', './README.zh-cn.md'];

readmeFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const targetPath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /\((img|\.\/img)\/(.+?)\)/g,
    '(https://raw.githubusercontent.com/HEKEH/easy-audio-player/master/img/$2)',
  );
  content = content.replace(
    /\.?\((README(?:\.[\w-]+)?\.md)\)/g,
    '(https://www.github.com/HEKEH/easy-audio-player/blob/master/$1)',
  );
  fs.writeFileSync(targetPath, content);
});
