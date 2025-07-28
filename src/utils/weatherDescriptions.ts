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
      title: "Calm Wind",
      description: "Ideal wind conditions for water activities. Sea surface is relatively calm with small waves.",
      recommendation: "Perfect time for beginner surfing, snorkeling, or other water activities. Very safe conditions.",
      icon: "🌊"
    };
  } else if (windSpeed <= 7) {
    return {
      title: "Moderate Wind",
      description: "Wind blowing at normal speed. Waves are forming well for surfing.",
      recommendation: "Good conditions for intermediate surfing. Pay attention to wind direction to choose the best spot.",
      icon: "🌬️"
    };
  } else if (windSpeed <= 12) {
    return {
      title: "Strong Wind",
      description: "Wind blowing quite strong, creating larger waves and more challenging sea conditions.",
      recommendation: "Suitable for experienced surfers. Beginners should avoid or practice in sheltered spots.",
      icon: "💨"
    };
  } else {
    return {
      title: "Very Strong Wind",
      description: "Extreme wind conditions with large waves and strong currents. Sea is in dangerous condition.",
      recommendation: "Not recommended for water activities. Wait until conditions improve or find sheltered spots.",
      icon: "⛈️"
    };
  }
};

// Wave Height Conditions (meters)
export const getWaveCondition = (waveHeight: number): WeatherCondition => {
  if (waveHeight <= 0.5) {
    return {
      title: "Small Waves",
      description: "Very small waves, ideal for beginners learning to surf or calm water activities.",
      recommendation: "Perfect for learning surfing basics, longboarding, or relaxed water activities.",
      icon: "〰️"
    };
  } else if (waveHeight <= 1.5) {
    return {
      title: "Medium Waves",
      description: "Ideal wave size for most surfers. Big enough for fun riding but still safe.",
      recommendation: "Best conditions for recreational surfing. Suitable for all levels with proper supervision.",
      icon: "🌊"
    };
  } else if (waveHeight <= 2.5) {
    return {
      title: "Large Waves",
      description: "Challenging wave size that requires good surfing skills and experience.",
      recommendation: "Only for intermediate to advanced surfers. Ensure prime physical condition and use safety leash.",
      icon: "🌊🌊"
    };
  } else {
    return {
      title: "Extreme Waves",
      description: "Very large waves only suitable for professional surfers with big wave surfing experience.",
      recommendation: "Only for expert surfers. Use special big wave equipment and ensure safety team presence.",
      icon: "🌊🌊🌊"
    };
  }
};

// Temperature Conditions (Celsius)
export const getTemperatureCondition = (temp: number): WeatherCondition => {
  if (temp <= 20) {
    return {
      title: "Cool Temperature",
      description: "Water and air temperature quite cold. May require wetsuit for comfort during activities.",
      recommendation: "Use 3/2mm or 4/3mm wetsuit. Warm-up before entering water is highly recommended.",
      icon: "🧊"
    };
  } else if (temp <= 26) {
    return {
      title: "Comfortable Temperature",
      description: "Very ideal temperature for water activities. Not too hot and not too cold.",
      recommendation: "Perfect conditions for surfing without wetsuit. Don't forget sunscreen for UV protection.",
      icon: "🌡️"
    };
  } else if (temp <= 30) {
    return {
      title: "Warm Temperature",
      description: "Quite warm and comfortable temperature. Water feels refreshing and suitable for long water activities.",
      recommendation: "Ideal conditions for long surfing sessions. Stay hydrated and use sun protection.",
      icon: "☀️"
    };
  } else {
    return {
      title: "Hot Temperature",
      description: "Very hot temperature. Water may feel warm and sun exposure is quite intense.",
      recommendation: "Limit time under direct sunlight. Use rashguard and increase water intake.",
      icon: "🔥"
    };
  }
};

// UV Index Conditions
export const getUVCondition = (uvIndex: number): WeatherCondition => {
  if (uvIndex <= 2) {
    return {
      title: "Low UV",
      description: "Minimal UV radiation level. Safe for long outdoor activities.",
      recommendation: "Still use sunscreen as basic protection, especially when in water that reflects sunlight.",
      icon: "🌤️"
    };
  } else if (uvIndex <= 5) {
    return {
      title: "Moderate UV",
      description: "Moderate UV level. Skin protection starts to be needed for long outdoor activities.",
      recommendation: "Use SPF 30+ sunscreen, hat, and sunglasses. Seek shade during breaks.",
      icon: "☀️"
    };
  } else if (uvIndex <= 7) {
    return {
      title: "High UV",
      description: "Quite strong UV radiation. Skin can burn in relatively short time without protection.",
      recommendation: "Must use SPF 50+ sunscreen, rashguard, and limit direct exposure during midday.",
      icon: "🌞"
    };
  } else {
    return {
      title: "Very High UV",
      description: "Extreme UV level that can cause sunburn within minutes.",
      recommendation: "Avoid direct exposure 10:00-16:00. Use maximum protection and seek shade as often as possible.",
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
      title: "Mostly Clear",
      description: "Sky is mostly clear with few clouds. Sunlight dominates throughout the day.",
      recommendation: "Ideal conditions for surf photography and outdoor activities. Don't forget maximum sun protection.",
      icon: "☀️"
    };
  } else if (cloudCover <= 50) {
    return {
      title: "Partly Cloudy",
      description: "Sky is about half covered with clouds. Sunlight is still strong but occasionally blocked.",
      recommendation: "Comfortable conditions for outdoor activities. UV is still strong so keep using sunscreen.",
      icon: "⛅"
    };
  } else if (cloudCover <= 75) {
    return {
      title: "Mostly Cloudy",
      description: "Sky is dominated by thick clouds. Sunlight is often blocked, temperature tends to be cooler.",
      recommendation: "Comfortable conditions for long surfing sessions. Sunburn risk reduced but stay alert.",
      icon: "☁️"
    };
  } else {
    return {
      title: "Overcast",
      description: "Sky is completely covered with clouds. Rain possibility is quite high, visibility may be limited.",
      recommendation: "Prepare rain gear and watch weather conditions. Could be an epic surf session if it doesn't rain!",
      icon: "☁️☁️"
    };
  }
};

// Visibility Conditions (km)
export const getVisibilityCondition = (visibility: number): WeatherCondition => {
  if (visibility >= 15) {
    return {
      title: "Excellent Visibility",
      description: "Very clear and far visibility. Ideal conditions for seeing wave sets from distance.",
      recommendation: "Perfect for spot hunting and enjoying scenery. Excellent photography conditions.",
      icon: "👁️✨"
    };
  } else if (visibility >= 10) {
    return {
      title: "Good Visibility",
      description: "Quite good visibility for most activities. Can see sea conditions clearly.",
      recommendation: "Normal conditions for surfing. Stay alert for sudden weather changes.",
      icon: "👁️"
    };
  } else if (visibility >= 5) {
    return {
      title: "Limited Visibility",
      description: "Visibility starts to be limited due to fog, rain, or other weather conditions.",
      recommendation: "Extra caution when surfing. Always stay within visual range of the beach.",
      icon: "🌫️"
    };
  } else {
    return {
      title: "Poor Visibility",
      description: "Very limited visibility. Dangerous conditions for water activities far from beach.",
      recommendation: "Not recommended for surfing far from beach. Stick to spots close to shore.",
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
    return `🏄‍♂️ EXCELLENT surf conditions! ${windCondition.title.toLowerCase()}, ${waveCondition.title.toLowerCase()} - perfect combo for surfing!`;
  } else if (weather.windSpeed <= 10 && weather.waveHeight >= 0.8) {
    return `🌊 GOOD surf conditions! ${waveCondition.recommendation}`;
  } else if (weather.waveHeight < 0.8) {
    return `😴 FLAT surf conditions. Perfect time for learning or resting. Check forecast for next swell.`;
  } else {
    return `⚠️ CHALLENGING surf conditions. ${windCondition.recommendation}`;
  }
};