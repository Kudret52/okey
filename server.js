const io = require("socket.io")(3000, {
  cors: { origin: "*" }
});

let taslar = [];
const renkler = ['kirmizi', 'sari', 'siyah', 'mavi'];

// Okey taşlarını oluştur ve karıştır
function taslariHazirla() {
    let yeniTaslar = [];
    for (let i = 1; i <= 13; i++) {
        renkler.forEach(renk => {
            yeniTaslar.push({ sayi: i, renk: renk });
            yeniTaslar.push({ sayi: i, renk: renk }); // Her taştan 2 adet
        });
    }
    yeniTaslar.push({ sayi: 0, renk: 'sahte' }, { sayi: 0, renk: 'sahte' });
    return yeniTaslar.sort(() => Math.random() - 0.5);
}

taslar = taslariHazirla();

io.on("connection", (socket) => {
    console.log("Bir oyuncu bağlandı:", socket.id);

    // Oyuncu taş çekmek istediğinde
    socket.on("tasCek", () => {
        if (taslar.length > 0) {
            const cekilenTas = taslar.pop();
            socket.emit("tasAlindi", cekilenTas); // Sadece çeken kişiye gönder
            io.emit("bilgi", "Bir oyuncu yerden taş çekti."); // Herkese haber ver
        }
    });
});
