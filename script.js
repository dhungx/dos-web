document.getElementById('dosForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = document.getElementById('dosForm');
    const button = form.querySelector('button');
    const url = document.getElementById('url').value.trim();
    const threads = document.getElementById('threads').value;
    const result = document.getElementById('result');

    button.classList.add('active');
    result.innerHTML = "Đang gửi yêu cầu...";

    // Kiểm tra định dạng URL
    if (!url.match(/^https?:\/\/.+/)) {
        result.innerHTML = 'URL không hợp lệ. Vui lòng nhập URL bắt đầu bằng http:// hoặc https://';
        button.classList.remove('active');
        return;
    }

    fetch('/dos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            url: url,
            threads: threads
        })
    })
    .then(response => response.text())
    .then(data => {
        button.classList.remove('active');
        result.innerHTML = data;
    })
    .catch(error => {
        console.error('Error:', error);
        result.innerHTML = 'Đã xảy ra lỗi khi gửi yêu cầu: ' + error.message;
        button.classList.remove('active');
    });
});
