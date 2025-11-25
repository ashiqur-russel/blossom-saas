// Script to replace API_URL in environment.prod.ts at build time
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, 'src/environments/environment.prod.ts');
const apiUrl = process.env.API_URL || 'https://your-api-domain.vercel.app';

let content = fs.readFileSync(envFile, 'utf8');
content = content.replace(
  /apiUrl:\s*['"](.*?)['"]/,
  `apiUrl: '${apiUrl}'`
);

fs.writeFileSync(envFile, content, 'utf8');
console.log(`✅ Updated API URL to: ${apiUrl}`);

