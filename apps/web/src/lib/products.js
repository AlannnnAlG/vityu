export const products = [
  {
    id: 'sweet-block-spray',
    name: 'Sweet Block Spray',
    description: 'Solusi praktis atasi kecanduan gula. Anti Sugar Craving Spray pertama di Indonesia.',
    shortDescription: 'Spray herbal penekan hasrat manis instan.',
    price: 45000,
    originalPrice: 65000,
    image: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/1d0d5ed5b2efc499e516b122cd88c2e9.png',
    badge: 'Bestseller',
    rating: 4.9,
    reviewsCount: 1240,
    specifications: [
      { label: 'Volume', value: '20ml' },
      { label: 'Bentuk', value: 'Liquid Spray' },
      { label: 'Izin Edar', value: 'BPOM TR234567891' },
      { label: 'Masa Simpan', value: '24 Bulan' }
    ],
    ingredients: 'Ekstrak Gymnema Sylvestre, Peppermint Oil, Stevia Extract, Purified Water.',
    usage: 'Semprotkan 2-3 kali langsung ke permukaan lidah saat muncul dorongan ingin mengonsumsi makanan/minuman manis. Tahan beberapa detik sebelum ditelan.'
  },
  {
    id: 'miracle-tea',
    name: 'Miracle Tea',
    description: 'Teh herbal dengan 20 tea bag, untuk mendukung gaya hidup sehat dan diet gula.',
    shortDescription: 'Teh herbal pendukung stabilitas gula darah.',
    price: 62450,
    originalPrice: 110000,
    image: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/bc4a128c8412a82f950b3e7e2ba38b6b.png',
    badge: 'Promo',
    rating: 4.8,
    reviewsCount: 856,
    specifications: [
      { label: 'Berat Bersih', value: '40gr (20 tea bags)' },
      { label: 'Bentuk', value: 'Teh Celup' },
      { label: 'Izin Edar', value: 'P-IRT 8901234567' },
      { label: 'Masa Simpan', value: '18 Bulan' }
    ],
    ingredients: 'Green Tea Extract, Gymnema Sylvestre Leaves, Cinnamon, Stevia Leaves.',
    usage: 'Seduh 1 kantong teh dengan 200ml air panas (80-90°C) selama 3-5 menit. Nikmati 1-2 kali sehari, idealnya setelah makan besar atau di malam hari.'
  },
  {
    id: 'diet-sugar-spray-original',
    name: 'Diet Sugar Spray - Original',
    description: 'Varian original dari Anti Sugar Craving Spray dengan sensasi mint yang lebih kuat.',
    shortDescription: 'Spray penekan hasrat manis varian original.',
    price: 45000,
    originalPrice: null,
    image: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/d5bb27a6a983611b13c5e7d4e9398ee9.png',
    badge: null,
    rating: 4.7,
    reviewsCount: 532,
    specifications: [
      { label: 'Volume', value: '20ml' },
      { label: 'Bentuk', value: 'Liquid Spray' },
      { label: 'Izin Edar', value: 'BPOM TR234567892' },
      { label: 'Masa Simpan', value: '24 Bulan' }
    ],
    ingredients: 'Ekstrak Gymnema Sylvestre, Extra Peppermint Oil, Stevia Extract, Purified Water.',
    usage: 'Semprotkan 2-3 kali langsung ke permukaan lidah saat muncul dorongan ingin mengonsumsi makanan/minuman manis.'
  },
  {
    id: 'reseller-package',
    name: 'Reseller Package 12in1',
    description: 'Paket bundel khusus untuk reseller, berisi 12 botol Diet Sugar Spray dengan harga terbaik.',
    shortDescription: 'Paket hemat 12 botol untuk reseller.',
    price: 450000,
    originalPrice: 540000,
    image: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/9b400edaca78463f711b99340131566a.png',
    badge: 'Peluang Bisnis',
    rating: 5.0,
    reviewsCount: 128,
    specifications: [
      { label: 'Isi Paket', value: '12 Botol x 20ml' },
      { label: 'Berat Total', value: '± 500gr' },
      { label: 'Bonus', value: 'Marketing Kit Digital' }
    ],
    ingredients: 'Sesuai dengan komposisi Diet Sugar Spray.',
    usage: 'Cocok untuk dijual kembali atau penggunaan jangka panjang bersama keluarga.'
  }
];

export const getProductById = (id) => {
  return products.find(p => p.id === id);
};