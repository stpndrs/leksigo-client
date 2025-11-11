/**
 * Mengonversi total detik menjadi format durasi deskriptif.
 * @param {number} totalSeconds Total detik (cth: 8174).
 * @returns {string} Durasi dalam format "X jam Y menit Z detik".
 */
export function formatDurationVerbose(totalSeconds) {
  totalSeconds = Math.floor(totalSeconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  // Hanya tambahkan bagian jika nilainya lebih dari 0
  if (hours > 0) {
    parts.push(`${hours} jam`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} menit`);
  }
  if (seconds > 0) {
    parts.push(`${seconds} detik`);
  }

  // Jika inputnya 0, kembalikan "0 detik"
  if (parts.length === 0) {
    return "0 detik";
  }

  return parts.join(' ');
}

// --- Contoh Penggunaan ---
const durasi = 8174;
console.log(formatDurationVerbose(durasi));
// Output: 2 jam 16 menit 14 detik

console.log(formatDurationVerbose(3610));
// Output: 1 jam 10 detik (melewatkan 0 menit)