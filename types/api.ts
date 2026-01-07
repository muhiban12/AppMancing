// types/api.ts
export interface FileType {
  uri: string;
  type?: string;
  name?: string;
  fileName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nama_lengkap: string;
  email: string;
  password: string;
  nomer_wa: string;
  provinsi_asal?: string;
  kota_kabupaten?: string;
}

export interface OwnerUpgradeData {
  foto_ktp: FileType;
  foto_wajah_verifikasi: FileType;
  no_rekening: string;
  nama_bank: string;
  atas_nama: string;
  spot_data: {
    nama_spot: string;
    alamat: string;
    deskripsi?: string;
    harga_per_jam: number;
    latitude: number;
    longitude: number;
    total_kursi?: number;
    jam_buka?: string;
    jam_tutup?: string;
    kode_wilayah?: string;
    foto_utama?: FileType;
  };
}

export interface SpotData {
  nama_spot: string;
  deskripsi?: string;
  harga_per_jam: number;
  alamat: string;
  latitude: number;
  longitude: number;
  total_kursi?: number;
  jam_buka?: string;
  jam_tutup?: string;
  kode_wilayah?: string;
  foto_utama?: FileType;
  foto_denah?: FileType;
  facilities?: number[];
}

export interface EventData {
  spot_id: number;
  nama_event: string;
  biaya_pendaftaran: number;
  deskripsi_event?: string;
  maks_peserta: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  batas_pendaftaran?: string;
  hadiah?: any;
  foto_poster?: FileType;
}

export interface BookingData {
  seat_id: number;
  start_time: string;
  duration: number;
  payment_channel_id?: number;
  nama_offline?: string;
  wa_offline?: string;
}

export interface ReviewData {
  spot_id?: number;
  wild_spot_id?: number;
  rating: number;
  ulasan: string;
  foto_ulasan?: FileType;
}

export interface StrikeFeedData {
  wild_spot_id?: number;
  nama_ikan?: string;
  berat?: number;
  panjang?: number;
  caption?: string;
  foto_ikan?: FileType;
}

export interface WithdrawData {
  amount: number;
  bank_tujuan: string;
  nomor_rekening: string;
}

export interface WildSpotData {
  nama_lokasi: string;
  kabupaten_provinsi?: string;
  kode_wilayah?: string;
  status_potensi?: 'Sangat Baik' | 'Baik' | 'Cukup';
  deskripsi_spot?: string;
  latitude: number;
  longitude: number;
  foto_carousel?: FileType[];
}