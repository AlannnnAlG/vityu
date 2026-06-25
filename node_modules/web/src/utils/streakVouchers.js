/**
 * Daftar milestone streak dan voucher yang didapat
 * Setiap milestone akan memberikan kode voucher unik ke pengguna
 */
export const STREAK_MILESTONES = [
  {
    days: 7,
    voucher: {
      title: 'Diskon Mingguan',
      discount: '5%',
      code: 'STREAK7',
      expiryDays: 30, // berlaku 30 hari sejak unlock
      description: 'Diskon 5% untuk semua produk Vityuu',
    },
  },
  {
    days: 14,
    voucher: {
      title: 'Reward 2 Minggu',
      discount: '10%',
      code: 'STREAK14',
      expiryDays: 30,
      description: 'Diskon 10% untuk semua produk Vityuu',
    },
  },
  {
    days: 30,
    voucher: {
      title: 'Juara Bulan Ini!',
      discount: '15%',
      code: 'STREAK30',
      expiryDays: 60,
      description: 'Diskon 15% spesial streak 30 hari',
    },
  },
  {
    days: 60,
    voucher: {
      title: 'Legend 60 Hari',
      discount: '20%',
      code: 'STREAK60',
      expiryDays: 90,
      description: 'Diskon 20% untuk streak 60 hari luar biasa',
    },
  },
  {
    days: 100,
    voucher: {
      title: 'Centurion 100 Hari',
      discount: '25%',
      code: 'STREAK100',
      expiryDays: 90,
      description: 'Diskon 25% kehormatan streak 100 hari',
    },
  },
];

/**
 * Nilai diskon dalam persen untuk setiap kode voucher streak
 */
export const STREAK_VOUCHER_DISCOUNTS = {
  STREAK7: 5,
  STREAK14: 10,
  STREAK30: 15,
  STREAK60: 20,
  STREAK100: 25,
};

const STORAGE_KEY = 'vityu_streak_vouchers';

/**
 * Ambil semua voucher streak yang sudah pernah di-unlock user dari localStorage
 * @returns {Array} list voucher yang sudah unlock
 */
export const getUnlockedStreakVouchers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Cek streak saat ini dan unlock voucher baru jika milestone tercapai.
 * Mengembalikan daftar voucher yang BARU di-unlock dalam panggilan ini.
 * @param {number} currentStreak - streak hari saat ini
 * @returns {Array} voucher-voucher yang baru saja di-unlock
 */
export const checkAndUnlockVouchers = (currentStreak) => {
  const alreadyUnlocked = getUnlockedStreakVouchers();
  const alreadyUnlockedCodes = alreadyUnlocked.map((v) => v.code);
  const newlyUnlocked = [];

  for (const milestone of STREAK_MILESTONES) {
    if (
      currentStreak >= milestone.days &&
      !alreadyUnlockedCodes.includes(milestone.voucher.code)
    ) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + milestone.voucher.expiryDays);

      const newVoucher = {
        ...milestone.voucher,
        id: `streak-${milestone.days}`,
        expiryDate: expiryDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        unlockedAt: new Date().toISOString(),
        fromStreak: milestone.days,
      };

      newlyUnlocked.push(newVoucher);
    }
  }

  if (newlyUnlocked.length > 0) {
    const updated = [...alreadyUnlocked, ...newlyUnlocked];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return newlyUnlocked;
};

/**
 * Validate apakah kode voucher valid dan belum expired.
 * Returns objek { valid, discount, message }
 * @param {string} code
 */
export const validateStreakVoucherCode = (code) => {
  const upperCode = code.toUpperCase().trim();
  const unlockedVouchers = getUnlockedStreakVouchers();
  const voucher = unlockedVouchers.find((v) => v.code === upperCode);

  if (!voucher) {
    // Cek apakah kode ada di daftar milestone (tapi belum di-unlock)
    const isKnownCode = STREAK_MILESTONES.some(
      (m) => m.voucher.code === upperCode
    );
    if (isKnownCode) {
      return {
        valid: false,
        discount: 0,
        message: 'Kode voucher ini belum kamu unlock. Teruskan streak-mu!',
      };
    }
    return { valid: false, discount: 0, message: 'Kode voucher tidak ditemukan.' };
  }

  // Cek expiry
  const expiryRaw = new Date(voucher.unlockedAt);
  expiryRaw.setDate(expiryRaw.getDate() + voucher.expiryDays);
  if (new Date() > expiryRaw) {
    return { valid: false, discount: 0, message: 'Voucher sudah expired.' };
  }

  const discountPercent = STREAK_VOUCHER_DISCOUNTS[upperCode] || 0;
  return {
    valid: true,
    discount: discountPercent,
    message: `Voucher "${voucher.title}" berhasil! Diskon ${discountPercent}%`,
    voucher,
  };
};