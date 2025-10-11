/**
 * Mengubah string Base64 menjadi Blob.
 * @param {string} base64 - String data Base64.
 * @param {string} contentType - Tipe MIME dari file, e.g., 'audio/mpeg'.
 * @returns {Blob}
 */
export function base64ToBlob(base64, contentType = '') {
    // atob() adalah fungsi browser untuk men-decode string Base64
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    // Ubah array byte menjadi data biner sungguhan
    const byteArray = new Uint8Array(byteNumbers);
    // Buat Blob dari data biner
    return new Blob([byteArray], { type: contentType });
};