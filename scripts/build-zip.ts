#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const DEST_DIR = path.join(__dirname, '../dist');
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip');

const extractExtensionData = () => {
  const extPackageJson = require('../package.json');

  return {
    name: extPackageJson.name,
    version: extPackageJson.version,
  };
};

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR);
  }
};

const buildZip = (src: any, dist: any, zipFilename: any) => {
  console.info(`Building ${zipFilename}...`);

  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(path.join(dist, zipFilename));

  return new Promise((resolve: any, reject) => {
    archive
      .directory(src, false)
      .on('error', (err: any) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

const main = () => {
  const { name, version } = extractExtensionData();

  makeDestZipDirIfNotExists();

  // Google Chrome
  buildZip(DEST_DIR, DEST_ZIP_DIR, `GoogleChrome-${name}-v${version}.zip`)
    .then(() => console.info('OK'))
    .catch(console.log);

  // Mozilla Firefox
  buildZip(DEST_DIR, DEST_ZIP_DIR, `MozillaFirefox-${name}-v${version}.xpi`)
    .then(() => console.info('OK'))
    .catch(console.log);

  // Opera
  buildZip(DEST_DIR, DEST_ZIP_DIR, `Opera-${name}-v${version}.crx`)
    .then(() => console.info('OK'))
    .catch(console.log);

  // Microsoft Edge
  buildZip(DEST_DIR, DEST_ZIP_DIR, `MicrosoftEdge-${name}-v${version}.zip`)
    .then(() => console.info('OK'))
    .catch(console.log);
};

main();
