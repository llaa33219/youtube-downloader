const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

app.get('/download', async (req, res) => {
  const { url, format } = req.query;
  if (!url || !format) {
    return res.status(400).send('URL이나 포맷을 넣어주세요!');
  }
  if (format !== 'mp3' && format !== 'mp4') {
    return res.status(400).send('mp3나 mp4만 돼요!');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const stream = ytdl(url, {
      quality: format === 'mp3' ? 'highestaudio' : 'highest',
      filter: format === 'mp3' ? 'audioonly' : 'audioandvideo',
    });
    res.header('Content-Disposition', `attachment; filename="${title}.${format}"`);
    stream.pipe(res);
  } catch (error) {
    res.status(500).send('영상 처리 중 문제가 생겼어요.');
  }
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 시작됐어요!`);
});