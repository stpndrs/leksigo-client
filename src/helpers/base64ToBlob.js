export function base64ToBlob(base64, type = 'application/octet-stream') {
    // 1. Cek apakah ada prefix "data:...", jika ada, kita split dan ambil bagian belakangnya saja
    let base64Data = base64;

    if (base64.includes(',')) {
        // Mengambil bagian setelah koma (raw base64 nya)
        base64Data = base64.split(',')[1];
    }

    // 2. Bersihkan dari spasi atau enter (newline) yang mungkin terbawa
    base64Data = base64Data.replace(/\s/g, '');

    // 3. Proses decoding (ini baris yang sebelumnya error)
    const binStr = atob(base64Data);

    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], { type: type });
}