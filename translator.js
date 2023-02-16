const os = require('os');
const axios = require('axios');
const fs = require('fs');

const API_KEY = 'your_api_key';

async function detectLanguage(text) {
  try {
    const response = await axios.post('https://translation.googleapis.com/language/translate/v2/detect', {}, {
      params: {
        q: text,
        key: API_KEY
      }
    });
    return response.data.data.detections[0][0].language;
  } catch (error) {
    console.error(error);
  }
}

async function translateText(text, target) {
  try {
    const response = await axios.post('https://translation.googleapis.com/language/translate/v2', {}, {
      params: {
        q: text,
        target: target,
        key: API_KEY
      }
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(error);
  }
}

async function translatePhrase(text) {
  let target = os.locale().split('_')[0];
  let source = await detectLanguage(text);
  if (source !== target) {
    text = await translateText(text, target);
  }
  return text;
}

if (process.argv.length === 3) {
  fs.readFile(process.argv[2], 'utf-8', async (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const translatedText = await translatePhrase(data);
      console.log(`Translated text: ${translatedText}`);
    }
  });
} else {
  console.error('Please drag a .txt file into the terminal.');
}
