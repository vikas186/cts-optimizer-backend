const fs = require('fs');

function writeCsv(filePath, data) {
  const path = require('path');
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!data || data.length === 0) {
    fs.writeFileSync(filePath, '', 'utf8');
    return;
  }
  const headers = Object.keys(data[0]);
  const lines = [headers.join(',')];
  for (const row of data) {
    const line = headers.map(h => {
      let val = row[h];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`;
      }
      return val;
    });
    lines.push(line.join(','));
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

module.exports = { writeCsv };
