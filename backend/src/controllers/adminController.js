<!DOCTYPE html>
<html class="light" lang="id"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dasbor Admin (ID &amp; Penarikan)</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#2b9dee",
              "primary-dark": "#1a7bc0",
              "deep-ocean": "#0B253C", 
              "deep-ocean-light": "#153d60",
              "background-light": "#f6f7f8",
              "background-dark": "#101a22",
              "surface-light": "#ffffff",
              "surface-dark": "#1b2730",
              "mint": "#26c485",
              "orange": "#ff9f1c",
              "red": "#ef4444",
            },
            fontFamily: {
              "display": ["Plus Jakarta Sans", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'nav': '0 -4px 25px -5px rgba(0, 0, 0, 0.1)',
                'card': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        body { -webkit-tap-highlight-color: transparent; }
        body { min-height: max(884px, 100dvh); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark text-[#111518] dark:text-white font-display overflow-x-hidden min-h-screen">
<div class="flex items-center bg-deep-ocean p-4 justify-between sticky top-0 z-30 shadow-md">
<div class="flex-1">
<button class="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-white">menu</span>
</button>
</div>
<h2 class="text-white text-lg font-bold leading-tight tracking-tight text-center whitespace-nowrap">Dasbor Admin</h2>
<div class="flex w-12 items-center justify-end flex-1">
<button class="flex items-center justify-center rounded-full w-10 h-10 hover:bg-white/10 transition-colors relative">
<span class="material-symbols-outlined text-white text-[24px]">notifications</span>
<span class="absolute top-2.5 right-2.5 w-2 h-2 bg-red rounded-full border border-deep-ocean"></span>
</button>
</div>
</div>
<div class="relative bg-deep-ocean pb-12 pt-4 px-4 rounded-b-[2rem] mb-6 shadow-soft">
<div class="flex items-center gap-4 mb-4">
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-white/20 shadow-lg" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuADQan5ckuXLS2pba2yKDDMBfVMZuB9N62p2GwgKlaOTCxI_eQTidr3ps8ucKsTjL90Nf8-C33K5yvrb1MBa2y9cbBzsEA0W5yGvnkJQqa84rsp1oyGJPF0bnRhRGCXQTlSbJ_JWtqMTvgz28WIHJ7mXtXN9ORnE0wq-KFlG3KGF7k5Tt_jphj5sOI52JKjRyjMngkuRmM4TDKu74so3U5TK8y0DLLkdqshp2HoQaBX6TPKw2r55ieyOqRQfQTToWpwG8j6gb8wGrGd");'></div>
<div class="flex flex-col justify-center">
<p class="text-white text-xl font-bold leading-tight">Selamat Pagi, Admin</p>
<p class="text-white/60 text-sm font-medium">Sistem operasional dan berjalan</p>
</div>
</div>
<div class="absolute -bottom-10 left-4 right-4 bg-white dark:bg-surface-dark rounded-xl shadow-card p-4 flex items-start gap-4 overflow-x-auto no-scrollbar z-10 border border-gray-100 dark:border-gray-800">
<a class="flex flex-col items-center gap-2 group min-w-[70px] flex-shrink-0" href="#">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
<span class="material-symbols-outlined text-primary text-[20px]">person_add_alt</span>
</div>
<span class="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Daftar Pemilik</span>
</a>
<a class="flex flex-col items-center gap-2 group min-w-[70px] flex-shrink-0" href="#">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
<span class="material-symbols-outlined text-primary text-[20px]">emoji_events</span>
</div>
<span class="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Persetujuan Acara</span>
</a>
<button class="flex flex-col items-center gap-2 group min-w-[70px] flex-shrink-0">
<div class="w-10 h-10 rounded-full bg-mint/10 flex items-center justify-center group-hover:bg-mint/20 transition-colors">
<span class="material-symbols-outlined text-mint text-[20px]">add_location</span>
</div>
<span class="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Tambah Spot</span>
</button>
<button class="flex flex-col items-center gap-2 group min-w-[70px] flex-shrink-0">
<div class="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center group-hover:bg-orange/20 transition-colors">
<span class="material-symbols-outlined text-orange text-[20px]">description</span>
</div>
<span class="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Laporan</span>
</button>
<button class="flex flex-col items-center gap-2 group min-w-[70px] flex-shrink-0">
<div class="w-10 h-10 rounded-full bg-red/10 flex items-center justify-center group-hover:bg-red/20 transition-colors">
<span class="material-symbols-outlined text-red text-[20px]">payments</span>
</div>
<span class="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Penarikan Uang</span>
</button>
</div>
</div>
<div class="h-8"></div>
<div class="px-4 mb-6">
<h3 class="text-[#111518] dark:text-white text-lg font-bold mb-3 pl-1">Ringkasan Sistem</h3>
<div class="grid grid-cols-2 gap-3">
<div class="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800">
<div class="flex justify-between items-start">
<div class="bg-primary/10 p-2 rounded-lg text-primary">
<span class="material-symbols-outlined text-[20px]">monetization_on</span>
</div>
<p class="text-mint text-xs font-bold bg-mint/10 px-2 py-0.5 rounded-full">+12%</p>
</div>
<div>
<p class="text-[#617989] dark:text-gray-400 text-xs font-medium">Pendapatan Platform</p>
<p class="text-[#111518] dark:text-white text-lg font-bold leading-tight">$42,890</p>
</div>
</div>
<div class="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800">
<div class="flex justify-between items-start">
<div class="bg-orange/10 p-2 rounded-lg text-orange">
<span class="material-symbols-outlined text-[20px]">verified_user</span>
</div>
<p class="text-orange text-xs font-bold bg-orange/10 px-2 py-0.5 rounded-full">Perlu Tindakan</p>
</div>
<div>
<p class="text-[#617989] dark:text-gray-400 text-xs font-medium">Verifikasi Tertunda</p>
<p class="text-[#111518] dark:text-white text-lg font-bold leading-tight">18 Pemilik</p>
</div>
</div>
<a class="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow" href="#">
<div class="flex justify-between items-start">
<div class="bg-orange/10 p-2 rounded-lg text-orange">
<span class="material-symbols-outlined text-[20px]">emoji_events</span>
</div>
<p class="text-orange text-xs font-bold bg-orange/10 px-2 py-0.5 rounded-full">Perlu Tindakan</p>
</div>
<div>
<p class="text-[#617989] dark:text-gray-400 text-xs font-medium">Acara Tertunda</p>
<p class="text-[#111518] dark:text-white text-lg font-bold leading-tight">8 Acara</p>
</div>
</a>
<div class="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800">
<div class="flex justify-between items-start">
<div class="bg-mint/10 p-2 rounded-lg text-mint">
<span class="material-symbols-outlined text-[20px]">phishing</span>
</div>
<p class="text-mint text-xs font-bold bg-mint/10 px-2 py-0.5 rounded-full">+5</p>
</div>
<div>
<p class="text-[#617989] dark:text-gray-400 text-xs font-medium">Total Spot Aktif</p>
<p class="text-[#111518] dark:text-white text-lg font-bold leading-tight">843</p>
</div>
</div>
<div class="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800">
<div class="flex justify-between items-start">
<div class="bg-red/10 p-2 rounded-lg text-red">
<span class="material-symbols-outlined text-[20px]">account_balance_wallet</span>
</div>
<p class="text-orange text-xs font-bold bg-orange/10 px-2 py-0.5 rounded-full">Perlu Tindakan</p>
</div>
<div>
<p class="text-[#617989] dark:text-gray-400 text-xs font-medium">Permintaan Penarikan</p>
<p class="text-[#111518] dark:text-white text-lg font-bold leading-tight">5 Tertunda</p>
</div>
</div>
</div>
</div>
<div class="px-4 mb-6">
<div class="flex justify-between items-center mb-3">
<h3 class="text-[#111518] dark:text-white text-lg font-bold pl-1">Manajemen Pemilik - Persetujuan Tertunda</h3>
<span class="bg-orange/10 text-orange text-xs font-bold px-2 py-1 rounded-full">Prioritas</span>
</div>
<div class="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
<th class="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">PEMILIK / SPOT</th>
<th class="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Tindakan</th>
</tr>
</thead>
<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
<td class="p-3">
<div class="flex flex-col">
<span class="text-xs font-bold text-[#111518] dark:text-white">Budi Santoso</span>
<span class="text-[10px] text-gray-500">Spot: Pemancingan Jatiasih</span>
</div>
</td>
<td class="p-3 text-right flex justify-end gap-2">
<button class="bg-red/10 text-red hover:bg-red/20 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Tolak</button>
<button class="bg-primary text-white hover:bg-primary-dark text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Setujui</button>
</td>
</tr>
<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
<td class="p-3">
<div class="flex flex-col">
<span class="text-xs font-bold text-[#111518] dark:text-white">CV Berkah Alam</span>
<span class="text-[10px] text-gray-500">Spot: Danau Sunter Indah</span>
</div>
</td>
<td class="p-3 text-right flex justify-end gap-2">
<button class="bg-red/10 text-red hover:bg-red/20 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Tolak</button>
<button class="bg-primary text-white hover:bg-primary-dark text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Setujui</button>
</td>
</tr>
</tbody>
</table>
<div class="p-2 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 text-center">
<button class="text-xs font-bold text-gray-500 hover:text-primary transition-colors">Lihat Semua Pemilik Tertunda</button>
</div>
</div>
</div>
<div class="px-4 mb-6">
<div class="flex justify-between items-center mb-3">
<h3 class="text-[#111518] dark:text-white text-lg font-bold pl-1">Persetujuan Acara - Prioritas</h3>
<span class="bg-orange/10 text-orange text-xs font-bold px-2 py-1 rounded-full">Prioritas</span>
</div>
<div class="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
<th class="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">TURNAMEN / PENYELENGGARA</th>
<th class="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Tindakan</th>
</tr>
</thead>
<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
<td class="p-3">
<div class="flex flex-col">
<span class="text-xs font-bold text-[#111518] dark:text-white">Galatama Lele Cup</span>
<span class="text-[10px] text-gray-500">Org: Pemancingan Jaya</span>
</div>
</td>
<td class="p-3 text-right flex justify-end gap-2">
<button class="bg-red/10 text-red hover:bg-red/20 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Tolak</button>
<button class="bg-primary text-white hover:bg-primary-dark text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Setujui</button>
</td>
</tr>
<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
<td class="p-3">
<div class="flex flex-col">
<span class="text-xs font-bold text-[#111518] dark:text-white">Weekend Bass Pro</span>
<span class="text-[10px] text-gray-500">Org: Danau Biru Club</span>
</div>
</td>
<td class="p-3 text-right flex justify-end gap-2">
<button class="bg-red/10 text-red hover:bg-red/20 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Tolak</button>
<button class="bg-primary text-white hover:bg-primary-dark text-xs px-3 py-1.5 rounded-md font-semibold transition-colors">Setujui</button>
</td>
</tr>
</tbody>
</table>
<div class="p-2 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 text-center">
<a class="text-xs font-bold text-gray-500 hover:text-primary transition-colors" href="#">Lihat Semua Permintaan</a>
</div>
</div>
</div>
<div class="px-4 mb-6">
<div class="flex justify-between items-center mb-3">
<h3 class="text-[#111518] dark:text-white text-lg font-bold pl-1">Laporan Umpan Strike</h3>
<span class="bg-red/10 text-red text-xs font-bold px-2 py-1 rounded-full">Laporan Baru</span>
</div>
<div class="flex flex-col gap-3">
<div class="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3">
<div class="w-16 h-16 rounded-lg bg-gray-200 bg-center bg-cover shrink-0" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzqZXWewkiXsf0mpXmev0XMqvYR9-d27WIEjRm9MwU5FgDjJCW0zDRhIETIS0d2LYgCaHjOPGGhq6kUNz-O_cH-OEJtgK3RPW1Q7UUn2YvOjIj8JGlIUT1FY3DqaTM2yyVjy-Akt9MZRm4ulOrBcoopzJzrzxI1Ij5PuO218U8PWi4DU5r_kGSfUedoex2GOzVfKPB6ot3eLid9RHDCBAu3QfY-tJGgOMzvaz1QtVYZ5Dsqb2_i7PVrEMRAbX63BvyTv8-D62YChKD')"></div>
<div class="flex flex-col flex-1 justify-between">
<div>
<div class="flex justify-between items-start">
<span class="text-xs font-bold text-[#111518] dark:text-white">Konten Tidak Pantas</span>
<span class="text-[10px] text-gray-400">10m yang lalu</span>
</div>
<p class="text-[10px] text-gray-500 line-clamp-1 mt-0.5">Dilaporkan oleh: User882 - "Offensive language in caption"</p>
</div>
<div class="flex gap-2 mt-2 justify-end">
<button class="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Tutup Laporan</button>
<button class="text-[10px] font-semibold text-white bg-red px-3 py-1 rounded hover:bg-red/90 transition-colors">Hapus Posting</button>
</div>
</div>
</div>
<div class="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3">
<div class="w-16 h-16 rounded-lg bg-gray-200 bg-center bg-cover shrink-0" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9Wu-7N07WrotpSElj001i0m_8K4plwLz0268jo1LZF3V6J9r3HDZFNOoa4JMUbmZQNL7IX1SbbGu7EMskOrVb9tNWszjNfzFRiakjFsti54A5J2KrI2tTihZaeLQVXZ8Mg_Us_NqTPUAck6HeWIyQggkdyJiRdKjFoEf7pTC4gG83J3SWjkvw7THzRbZKGPmJZhS2kQQMNT_BkNihPZH00KejvRVD_xEtPRdXCMpSRH8z5uhWR7FY6Iy88kv4862g7lNGM1TK2JK')"></div>
<div class="flex flex-col flex-1 justify-between">
<div>
<div class="flex justify-between items-start">
<span class="text-xs font-bold text-[#111518] dark:text-white">Spam / Penipuan</span>
<span class="text-[10px] text-gray-400">45m yang lalu</span>
</div>
<p class="text-[10px] text-gray-500 line-clamp-1 mt-0.5">Dilaporkan oleh: AnglerPro - "Promoting gambling site"</p>
</div>
<div class="flex gap-2 mt-2 justify-end">
<button class="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Tutup Laporan</button>
<button class="text-[10px] font-semibold text-white bg-red px-3 py-1 rounded hover:bg-red/90 transition-colors">Hapus Posting</button>
</div>
</div>
</div>
</div>
</div>
<div class="px-4 mb-6">
<div class="flex min-w-72 flex-1 flex-col gap-2 rounded-xl bg-white dark:bg-surface-dark p-5 shadow-sm border border-gray-100 dark:border-gray-800">
<div class="flex justify-between items-center mb-2">
<div>
<div class="flex items-center gap-2 mb-1">
<p class="text-[#617989] dark:text-gray-400 text-sm font-medium leading-normal">Pertumbuhan Mingguan</p>
</div>
<p class="text-[#111518] dark:text-white tracking-light text-2xl font-bold leading-tight truncate">$1,240 <span class="text-xs font-normal text-gray-400">/ minggu</span></p>
</div>
<div class="flex gap-1 items-center bg-mint/10 px-2 py-1 rounded-md">
<span class="material-symbols-outlined text-mint text-sm">trending_up</span>
<p class="text-mint text-sm font-bold leading-normal">+15%</p>
</div>
</div>
<div class="w-full h-[120px] relative mt-2">
<svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="239" x2="239" y1="0" y2="150">
<stop stop-color="#2b9dee" stop-opacity="0.2"></stop>
<stop offset="1" stop-color="#2b9dee" stop-opacity="0"></stop>
</linearGradient>
</defs>
<path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#paint0_linear)"></path>
<path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#2b9dee" stroke-linecap="round" stroke-width="3"></path>
</svg>
</div>
<div class="flex justify-between px-2 mt-2">
<p class="text-[#617989] dark:text-gray-500 text-[11px] font-bold">Sen</p>
<p class="text-[#617989] dark:text-gray-500 text-[11px] font-bold">Sel</p>
<p class="text-[#617989] dark:text-gray-500 text-[11px] font-bold">Rab</p>
<p class="text-[#617989] dark:text-gray-500 text-[11px] font-bold">Kam</p>
<p class="text-[#617989] dark:text-gray-500 text-[11px] font-bold">Jum</p>
<p class="text-[#617989] dark:text-gray-500 text-[11px] font-bold">Sab</p>
<p class="text-[#617989] dark:text-gray-500 text-[11px] font-bold">Min</p>
</div>
</div>
</div>

</body></html>