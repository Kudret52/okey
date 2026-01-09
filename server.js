const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// CORS ayarları ve Soket bağlantısı
const io = new Server(server, {
    cors: { origin: "*" }
});

// HTML dosyanın görünmesi için ana dizin yönlendirmesi
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let taslar = [];
const renkler = ['kirmizi', 'sari', 'siyah', 'mavi'];

function taslariHazirla() {
    let yeniTaslar = [];
    for (let i = 1; i <= 13; i++) {
        renkler.forEach(renk => {
            yeniTaslar.push({ sayi: i, renk: renk });
            yeniTaslar.push({ sayi: i, renk: renk });
        });
    }
    yeniTaslar.push({ sayi: 0, renk: 'sahte' }, { sayi: 0, renk: 'sahte' });
    return yeniTaslar.sort(() => Math.random() - 0.5);
}

taslar = taslariHazirla();

io.on("connection", (socket) => {
    console.log("Bir oyuncu bağlandı:", socket.id);

    socket.on("tasCek", () => {
        if (taslar.length > 0) {
            const cekilenTas = taslar.pop();
            socket.emit("tasAlindi", cekilenTas);
            io.emit("bilgi", "Bir oyuncu yerden taş çekti.");
        } else {
            socket.emit("bilgi", "Yerde taş kalmadı!");
        }
    });
});

// KRİTİK NOKTA: Render'ın atadığı portu veya 3000'i kullan
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda yayında...`);
});
