import fs from 'fs';
import fetch from 'node-fetch'; // Standard in Node 20, but just in case, though the project doesn't have it in package.json, it should use global fetch

async function testFetch() {
  console.log('Fetching news from Blizzard...');
  const url = 'https://worldofwarcraft.blizzard.com/es-es/news';
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('Status:', response.status);
    if (!response.ok) {
      console.error('Response not OK');
      return;
    }

    const html = await response.text();
    fs.writeFileSync('blizzard_test.html', html);
    console.log('HTML saved to blizzard_test.html');

    const match = html.match(/model\s*=\s*({.*?});/s);
    if (!match) {
      console.error('Could not find news model in HTML');
      // Let's see some part of the HTML to debug
      console.log('HTML snippet around where "model" might be:');
      const index = html.indexOf('model');
      if (index !== -1) {
        console.log(html.substring(index, index + 200));
      } else {
        console.log('"model" not found in HTML at all.');
      }
    } else {
      console.log('Found model match!');
      try {
        const model = JSON.parse(match[1]);
        console.log('Successfully parsed model JSON. Blogs count:', model?.blogList?.blogs?.length);
      } catch (e) {
        console.error('Error parsing JSON:', e.message);
        fs.writeFileSync('match_failed_json.txt', match[1]);
      }
    }
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}

testFetch();
