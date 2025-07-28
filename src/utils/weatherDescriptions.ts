// Weather and Tides Condition Descriptions
export interface WeatherCondition {
  title: string;
  description: string;
  recommendation: string;
  icon: string;
}

export interface TideCondition {
  title: string;
  description: string;
  surfTip: string;
  icon: string;
}

// Wind Speed Conditions (m/s)
export const getWindCondition = (windSpeed: number): WeatherCondition => {
  if (windSpeed <= 3) {
    return {
      title: "Angin Tenang",
      description: "Kondisi angin sangat ideal untuk aktivitas air. Permukaan laut relatif tenang dengan gelombang kecil.",
      recommendation: "Waktu yang sempurna untuk surfing pemula, snorkeling, atau aktivitas air lainnya. Kondisi sangat aman.",
      icon: "🌊"
    };
  } else if (windSpeed <= 7) {
    return {
      title: "Angin Sedang",
      description: "Angin bertiup dengan kecepatan normal. Gelombang mulai terbentuk dengan baik untuk surfing.",
      recommendation: "Kondisi bagus untuk surfing intermediate. Perhatikan arah angin untuk memilih spot terbaik.",
      icon: "🌬️"
    };
  } else if (windSpeed <= 12) {
    return {
      title: "Angin Kencang",
      description: "Angin bertiup cukup kuat, menciptakan gelombang yang lebih besar dan kondisi laut yang lebih menantang.",
      recommendation: "Cocok untuk surfer berpengalaman. Pemula sebaiknya menghindari atau berlatih di spot yang terlindung.",
      icon: "💨"
    };
  } else {
    return {
      title: "Angin Sangat Kencang",
      description: "Kondisi angin ekstrem dengan gelombang besar dan arus yang kuat. Laut dalam kondisi berbahaya.",
      recommendation: "Tidak disarankan untuk aktivitas air. Tunggu hingga kondisi membaik atau cari spot yang terlindung.",
      icon: "⛈️"
    };
  }
};

// Wave Height Conditions (meters)
export const getWaveCondition = (waveHeight: number): WeatherCondition => {
  if (waveHeight <= 0.5) {
    return {
      title: "Gelombang Kecil",
      description: "Gelombang sangat kecil, ideal untuk pemula yang baru belajar surfing atau aktivitas air yang tenang.",
      recommendation: "Sempurna untuk belajar dasar-dasar surfing, longboarding, atau aktivitas air yang santai.",
      icon: "〰️"
    };
  } else if (waveHeight <= 1.5) {
    return {
      title: "Gelombang Sedang",
      description: "Ukuran gelombang yang ideal untuk sebagian besar surfer. Cukup besar untuk fun riding namun masih aman.",
      recommendation: "Kondisi terbaik untuk surfing recreational. Cocok untuk semua level dengan pengawasan yang tepat.",
      icon: "🌊"
    };
  } else if (waveHeight <= 2.5) {
    return {
      title: "Gelombang Besar",
      description: "Gelombang dengan ukuran menantang yang membutuhkan skill dan pengalaman surfing yang baik.",
      recommendation: "Hanya untuk surfer intermediate hingga advanced. Pastikan kondisi fisik prima dan gunakan safety leash.",
      icon: "🌊🌊"
    };
  } else {
    return {
      title: "Gelombang Ekstrem",
      description: "Gelombang sangat besar yang hanya cocok untuk surfer profesional dengan pengalaman big wave surfing.",
      recommendation: "Hanya untuk expert surfer. Gunakan peralatan khusus big wave dan pastikan ada safety team.",
      icon: "🌊🌊🌊"
    };
  }
};

// Temperature Conditions (Celsius)
export const getTemperatureCondition = (temp: number): WeatherCondition => {
  if (temp <= 20) {
    return {
      title: "Suhu Sejuk",
      description: "Suhu air dan udara cukup dingin. Mungkin memerlukan wetsuit untuk kenyamanan saat beraktivitas.",
      recommendation: "Gunakan wetsuit 3/2mm atau 4/3mm. Pemanasan sebelum masuk air sangat disarankan.",
      icon: "🧊"
    };
  } else if (temp <= 26) {
    return {
      title: "Suhu Nyaman",
      description: "Suhu yang sangat ideal untuk aktivitas air. Tidak terlalu panas dan tidak terlalu dingin.",
      recommendation: "Kondisi sempurna untuk surfing tanpa wetsuit. Jangan lupa sunscreen untuk perlindungan UV.",
      icon: "🌡️"
    };
  } else if (temp <= 30) {
    return {
      title: "Suhu Hangat",
      description: "Suhu cukup hangat dan nyaman. Air terasa menyegarkan dan cocok untuk aktivitas air yang lama.",
      recommendation: "Kondisi ideal untuk sesi surfing yang panjang. Tetap terhidrasi dan gunakan sun protection.",
      icon: "☀️"
    };
  } else {
    return {
      title: "Suhu Panas",
      description: "Suhu sangat panas. Air mungkin terasa hangat dan paparan sinar matahari cukup intens.",
      recommendation: "Batasi waktu di bawah sinar matahari langsung. Gunakan rashguard dan perbanyak minum air.",
      icon: "🔥"
    };
  }
};

// UV Index Conditions
export const getUVCondition = (uvIndex: number): WeatherCondition => {
  if (uvIndex <= 2) {
    return {
      title: "UV Rendah",
      description: "Tingkat radiasi UV minimal. Aman untuk aktivitas outdoor dalam waktu yang lama.",
      recommendation: "Tetap gunakan sunscreen sebagai perlindungan dasar, terutama jika berada di air yang memantulkan sinar.",
      icon: "🌤️"
    };
  } else if (uvIndex <= 5) {
    return {
      title: "UV Sedang",
      description: "Tingkat UV moderat. Perlindungan kulit mulai diperlukan untuk aktivitas outdoor yang lama.",
      recommendation: "Gunakan sunscreen SPF 30+, topi, dan kacamata hitam. Cari teduh saat istirahat.",
      icon: "☀️"
    };
  } else if (uvIndex <= 7) {
    return {
      title: "UV Tinggi",
      description: "Radiasi UV cukup kuat. Kulit dapat terbakar dalam waktu relatif singkat tanpa perlindungan.",
      recommendation: "Wajib gunakan sunscreen SPF 50+, rashguard, dan batasi paparan langsung saat midday.",
      icon: "🌞"
    };
  } else {
    return {
      title: "UV Sangat Tinggi",
      description: "Tingkat UV ekstrem yang dapat menyebabkan sunburn dalam hitungan menit.",
      recommendation: "Hindari paparan langsung 10:00-16:00. Gunakan perlindungan maksimal dan cari teduh sesering mungkin.",
      icon: "🔆"
    };
  }
};

// Tide Height Conditions (meters)
export const getTideCondition = (height: number, type: 'high' | 'low'): TideCondition => {
  if (type === 'high') {
    if (height >= 2.0) {
      return {
        title: "Air Pasang Tinggi",
        description: "Ketinggian air laut mencapai level maksimal. Banyak spot surf yang biasanya shallow menjadi lebih aman.",
        surfTip: "Waktu terbaik untuk spot-spot reef break yang dangkal. Waves lebih clean dan powerful.",
        icon: "🌊⬆️"
      };
    } else {
      return {
        title: "Air Pasang Sedang",
        description: "Level air laut naik namun belum mencapai puncak. Kondisi transisi yang sering memberikan waves terbaik.",
        surfTip: "Golden time untuk surfing! Kombinasi depth dan wave power yang ideal untuk most breaks.",
        icon: "🌊↗️"
      };
    }
  } else {
    if (height <= 0.5) {
      return {
        title: "Air Surut Rendah",
        description: "Level air laut sangat rendah. Reef dan rocks lebih terekspos, membutuhkan extra caution.",
        surfTip: "Hati-hati dengan shallow reefs. Pilih spot yang deeper atau tunggu tide naik sedikit.",
        icon: "🌊⬇️"
      };
    } else {
      return {
        title: "Air Surut Sedang",
        description: "Air laut dalam kondisi surut namun masih aman untuk most surf spots. Waves cenderung lebih hollow.",
        surfTip: "Bagus untuk experienced surfer yang suka hollow waves. Perhatikan depth di takeoff zone.",
        icon: "🌊↘️"
      };
    }
  }
};

// Cloud Cover Conditions (percentage)
export const getCloudCondition = (cloudCover: number): WeatherCondition => {
  if (cloudCover <= 25) {
    return {
      title: "Cerah Berawan",
      description: "Langit sebagian besar cerah dengan sedikit awan. Sinar matahari dominan sepanjang hari.",
      recommendation: "Kondisi ideal untuk fotografi surf dan aktivitas outdoor. Jangan lupa sun protection yang maksimal.",
      icon: "☀️"
    };
  } else if (cloudCover <= 50) {
    return {
      title: "Berawan Sebagian",
      description: "Langit tertutup awan sekitar setengahnya. Sinar matahari masih cukup kuat namun sesekali terhalang.",
      recommendation: "Kondisi nyaman untuk aktivitas outdoor. UV masih kuat jadi tetap gunakan sunscreen.",
      icon: "⛅"
    };
  } else if (cloudCover <= 75) {
    return {
      title: "Berawan Tebal",
      description: "Langit didominasi awan tebal. Sinar matahari sering terhalang, suhu cenderung lebih sejuk.",
      recommendation: "Kondisi yang nyaman untuk sesi surfing yang lama. Risiko sunburn berkurang namun tetap waspada.",
      icon: "☁️"
    };
  } else {
    return {
      title: "Mendung Total",
      description: "Langit tertutup awan sepenuhnya. Kemungkinan hujan cukup tinggi, visibility mungkin terbatas.",
      recommendation: "Siapkan rain gear dan perhatikan kondisi cuaca. Bisa jadi sesi surfing yang epic jika tidak hujan!",
      icon: "☁️☁️"
    };
  }
};

// Visibility Conditions (km)
export const getVisibilityCondition = (visibility: number): WeatherCondition => {
  if (visibility >= 15) {
    return {
      title: "Visibility Excellent",
      description: "Jarak pandang sangat jernih dan jauh. Kondisi ideal untuk melihat set waves dari kejauhan.",
      recommendation: "Perfect untuk spot hunting dan menikmati pemandangan. Kondisi fotografi yang excellent.",
      icon: "👁️✨"
    };
  } else if (visibility >= 10) {
    return {
      title: "Visibility Baik",
      description: "Jarak pandang cukup baik untuk sebagian besar aktivitas. Dapat melihat kondisi laut dengan jelas.",
      recommendation: "Kondisi normal untuk surfing. Tetap waspada terhadap perubahan cuaca mendadak.",
      icon: "👁️"
    };
  } else if (visibility >= 5) {
    return {
      title: "Visibility Terbatas",
      description: "Jarak pandang mulai terbatas karena kabut, hujan, atau kondisi cuaca lainnya.",
      recommendation: "Extra caution saat surfing. Pastikan selalu dalam jangkauan visual dari pantai.",
      icon: "🌫️"
    };
  } else {
    return {
      title: "Visibility Buruk",
      description: "Jarak pandang sangat terbatas. Kondisi berbahaya untuk aktivitas air yang jauh dari pantai.",
      recommendation: "Tidak disarankan untuk surfing jauh dari pantai. Stick to spots yang dekat dengan shore.",
      icon: "🌫️🌫️"
    };
  }
};

// Tide Change Recommendations
export const getTideChangeRecommendation = (currentTide: any, nextTide: any): string => {
  if (!currentTide || !nextTide) return "";
  
  const currentTime = new Date();
  const nextTideTime = new Date(nextTide.time);
  const hoursUntilNext = (nextTideTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilNext <= 1) {
    return `⏰ Tide akan berubah dalam ${Math.round(hoursUntilNext * 60)} menit. Ini adalah window terbaik untuk surfing!`;
  } else if (hoursUntilNext <= 2) {
    return `🌊 Masih ada ${Math.round(hoursUntilNext)} jam sebelum tide berubah. Waktu yang tepat untuk sesi yang panjang.`;
  } else {
    return `📅 Tide berikutnya dalam ${Math.round(hoursUntilNext)} jam. Plan your session accordingly.`;
  }
};

// Best Surf Time Recommendation
export const getBestSurfTimeRecommendation = (weather: any, tide: any): string => {
  if (!weather || !tide) return "";
  
  const windCondition = getWindCondition(weather.windSpeed);
  const waveCondition = getWaveCondition(weather.waveHeight);
  const tideCondition = getTideCondition(tide.height, tide.type);
  
  if (weather.windSpeed <= 7 && weather.waveHeight >= 1.0 && weather.waveHeight <= 2.0) {
    return `🏄‍♂️ Kondisi surf EXCELLENT! ${windCondition.title.toLowerCase()}, ${waveCondition.title.toLowerCase()}, dan ${tideCondition.title.toLowerCase()} - perfect combo!`;
  } else if (weather.windSpeed <= 10 && weather.waveHeight >= 0.8) {
    return `🌊 Kondisi surf GOOD! ${waveCondition.recommendation}`;
  } else if (weather.waveHeight < 0.8) {
    return `😴 Kondisi surf FLAT. Waktu yang tepat untuk belajar atau istirahat. Cek forecast untuk swell berikutnya.`;
  } else {
    return `⚠️ Kondisi surf CHALLENGING. ${windCondition.recommendation}`;
  }
};