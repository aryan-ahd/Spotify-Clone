const fs = require('fs');
const path = require('path');

const musicPath = path.join(__dirname, 'Music');
const outputFile = path.join(musicPath, 'index.json');

const folders = fs.readdirSync(musicPath).filter(f =>
  fs.statSync(path.join(musicPath, f)).isDirectory()
);

const playlist = folders.map(folder => {
  const folderPath = path.join(musicPath, folder);
  const infoPath = path.join(folderPath, 'info.json');

  let info = { title: folder, description: "No description" };
  if (fs.existsSync(infoPath)) {
    try {
      info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
    } catch {
      console.warn(`⚠️ Skipping invalid info.json in ${folder}`);
    }
  }

  const songs = fs.readdirSync(folderPath).filter(f => f.endsWith('.mp3'));

  return {
    folder,
    title: info.title,
    description: info.description,
    songs
  };
});

fs.writeFileSync(outputFile, JSON.stringify(playlist, null, 2));
console.log("✅ Music/index.json generated.");
