/**
 * Vedic Astrology Calculation Engine — Pure Math (no external dependencies)
 *
 * Implements planetary position calculations using standard astronomical
 * algorithms (VSOP87-simplified & Meeus), applies Lahiri Ayanamsa for
 * sidereal conversion, and computes Nakshatras, Houses, Vimshottari Mahadasha.
 *
 * All calculations are self-contained — no API calls, no npm packages.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RASHIS = [
  "Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya",
  "Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena",
] as const;

const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni",
  "Uttara Phalguni","Hasta","Chitra","Swati","Vishakha",
  "Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha",
  "Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada",
  "Uttara Bhadrapada","Revati",
] as const;

const NAKSHATRA_LORDS = [
  "Ketu","Shukra","Surya","Chandra","Mangala","Rahu",
  "Guru","Shani","Budha",
] as const;

const DASHA_YEARS: Record<string, number> = {
  Ketu:7,Shukra:20,Surya:6,Chandra:10,Mangala:7,
  Rahu:18,Guru:16,Shani:19,Budha:17,
};

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

// City database
const CITIES: Record<string, { lat: number; lng: number; tz: number }> = {
  "delhi":{lat:28.6139,lng:77.209,tz:5.5},"new delhi":{lat:28.6139,lng:77.209,tz:5.5},
  "mumbai":{lat:19.076,lng:72.8777,tz:5.5},"kolkata":{lat:22.5726,lng:88.3639,tz:5.5},
  "chennai":{lat:13.0827,lng:80.2707,tz:5.5},"bangalore":{lat:12.9716,lng:77.5946,tz:5.5},
  "bengaluru":{lat:12.9716,lng:77.5946,tz:5.5},"hyderabad":{lat:17.385,lng:78.4867,tz:5.5},
  "ahmedabad":{lat:23.0225,lng:72.5714,tz:5.5},"pune":{lat:18.5204,lng:73.8567,tz:5.5},
  "jaipur":{lat:26.9124,lng:75.7873,tz:5.5},"lucknow":{lat:26.8467,lng:80.9462,tz:5.5},
  "kanpur":{lat:26.4499,lng:80.3319,tz:5.5},"nagpur":{lat:21.1458,lng:79.0882,tz:5.5},
  "indore":{lat:22.7196,lng:75.8577,tz:5.5},"bhopal":{lat:23.2599,lng:77.4126,tz:5.5},
  "patna":{lat:25.6093,lng:85.1376,tz:5.5},"surat":{lat:21.1702,lng:72.8311,tz:5.5},
  "varanasi":{lat:25.3176,lng:82.9739,tz:5.5},"chandigarh":{lat:30.7333,lng:76.7794,tz:5.5},
  "coimbatore":{lat:11.0168,lng:76.9558,tz:5.5},"kochi":{lat:9.9312,lng:76.2673,tz:5.5},
  "agra":{lat:27.1767,lng:78.0081,tz:5.5},"amritsar":{lat:31.634,lng:74.8723,tz:5.5},
  "ujjain":{lat:23.1765,lng:75.7885,tz:5.5},"vadodara":{lat:22.3072,lng:73.1812,tz:5.5},
  "guwahati":{lat:26.1445,lng:91.7362,tz:5.5},"dehradun":{lat:30.3165,lng:78.0322,tz:5.5},
  "thiruvananthapuram":{lat:8.5241,lng:76.9366,tz:5.5},
  "visakhapatnam":{lat:17.6868,lng:83.2185,tz:5.5},
  "rishikesh":{lat:30.0869,lng:78.2676,tz:5.5},"haridwar":{lat:29.9457,lng:78.1642,tz:5.5},
  "mathura":{lat:27.4924,lng:77.6737,tz:5.5},
  "london":{lat:51.5074,lng:-0.1278,tz:0},"new york":{lat:40.7128,lng:-74.006,tz:-5},
  "los angeles":{lat:34.0522,lng:-118.2437,tz:-8},"chicago":{lat:41.8781,lng:-87.6298,tz:-6},
  "toronto":{lat:43.6532,lng:-79.3832,tz:-5},"sydney":{lat:-33.8688,lng:151.2093,tz:10},
  "singapore":{lat:1.3521,lng:103.8198,tz:8},"dubai":{lat:25.2048,lng:55.2708,tz:4},
  "kathmandu":{lat:27.7172,lng:85.324,tz:5.75},"colombo":{lat:6.9271,lng:79.8612,tz:5.5},
  "dhaka":{lat:23.8103,lng:90.4125,tz:6},
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlanetPosition = {
  name: string;
  nameEn: string;
  siderealLongitude: number;
  sign: string;
  signIndex: number;
  house: number;
  degree: string;
  nakshatra: string;
  nakshatraIndex: number;
  nakshatraPada: number;
};

export type VedicChart = {
  birthDate: Date;
  latitude: number;
  longitude: number;
  ayanamsa: number;
  ascendantLongitude: number;
  ascendant: string;
  sunSign: string;
  moonSign: string;
  planets: PlanetPosition[];
  mahadasha: {
    current: string;
    lord: string;
    startDate: string;
    endDate: string;
    elapsed: string;
    remaining: string;
  };
};

// ---------------------------------------------------------------------------
// Julian Day & Time helpers
// ---------------------------------------------------------------------------

function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours()/24 +
            date.getUTCMinutes()/1440 + date.getUTCSeconds()/86400;
  let yr = y, mo = m;
  if (mo <= 2) { yr--; mo += 12; }
  const A = Math.floor(yr / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25*(yr+4716)) + Math.floor(30.6001*(mo+1)) + d + B - 1524.5;
}

/** Julian centuries from J2000.0 */
function julianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// ---------------------------------------------------------------------------
// Lahiri Ayanamsa
// ---------------------------------------------------------------------------

function getLahiriAyanamsa(jd: number): number {
  const T = julianCentury(jd);
  // Newcomb's precession + Lahiri reference (epoch 1900)
  // Lahiri Ayanamsa at J2000.0 ≈ 23°51' = 23.85°
  // Rate ≈ 50.29" per year = 0.01397° per year
  const yearsSince2000 = (jd - 2451545.0) / 365.25;
  return 23.85 + 0.01397 * yearsSince2000;
}

// ---------------------------------------------------------------------------
// Planetary longitude calculations (Meeus / simplified VSOP87)
// ---------------------------------------------------------------------------

/** Sun's geocentric ecliptic longitude (tropical) */
function sunLongitude(T: number): number {
  // Geometric mean longitude
  const L0 = norm360(280.46646 + 36000.76983*T + 0.0003032*T*T);
  // Mean anomaly
  const M = norm360(357.52911 + 35999.05029*T - 0.0001537*T*T);
  const Mrad = M * DEG;
  // Equation of center
  const C = (1.914602 - 0.004817*T - 0.000014*T*T) * Math.sin(Mrad)
          + (0.019993 - 0.000101*T) * Math.sin(2*Mrad)
          + 0.000289 * Math.sin(3*Mrad);
  // Sun's true longitude
  const sunTrue = norm360(L0 + C);
  // Apparent longitude (correct for nutation + aberration)
  const omega = 125.04 - 1934.136*T;
  return norm360(sunTrue - 0.00569 - 0.00478 * Math.sin(omega * DEG));
}

/** Moon's geocentric ecliptic longitude (tropical) — simplified Meeus */
function moonLongitude(T: number): number {
  const Lp = norm360(218.3165 + 481267.8813*T);
  const D  = norm360(297.8502 + 445267.1115*T);
  const M  = norm360(357.5291 + 35999.0503*T);
  const Mp = norm360(134.9634 + 477198.8676*T);
  const F  = norm360(93.2720 + 483202.0175*T);

  const Lp_r = Lp*DEG, D_r = D*DEG, M_r = M*DEG, Mp_r = Mp*DEG, F_r = F*DEG;

  // Major perturbation terms
  let lon = Lp
    + 6.289 * Math.sin(Mp_r)
    - 1.274 * Math.sin(2*D_r - Mp_r)
    + 0.658 * Math.sin(2*D_r)
    + 0.214 * Math.sin(2*Mp_r)
    - 0.186 * Math.sin(M_r)
    - 0.114 * Math.sin(2*F_r)
    + 0.059 * Math.sin(2*D_r - 2*Mp_r)
    + 0.057 * Math.sin(2*D_r - M_r - Mp_r)
    + 0.053 * Math.sin(2*D_r + Mp_r)
    + 0.046 * Math.sin(2*D_r - M_r)
    - 0.041 * Math.sin(M_r - Mp_r)
    - 0.035 * Math.sin(D_r)
    - 0.030 * Math.sin(M_r + Mp_r);

  return norm360(lon);
}

/** Generic planet longitude using simplified orbital elements (Meeus Table 31.A) */
function planetLongitude(planet: string, T: number): number {
  // Orbital elements: [L0, L1, ω0, ω1, e0, e1, a, i] simplified
  const elements: Record<string, {L0:number;L1:number;p0:number;p1:number;e0:number;e1:number;a:number;N0:number;N1:number}> = {
    Mercury: {L0:252.2509,L1:149472.6746,p0:77.4561,p1:0.1588,e0:0.205635,e1:0.000023,a:0.387098,N0:48.3309,N1:0.1254},
    Venus:   {L0:181.9798,L1:58517.8157,p0:131.5637,p1:0.0080,e0:0.006773,e1:-0.000048,a:0.723330,N0:76.6799,N1:0.0901},
    Mars:    {L0:355.4330,L1:19140.2993,p0:336.0602,p1:0.4439,e0:0.093405,e1:0.000090,a:1.523688,N0:49.5574,N1:0.2930},
    Jupiter: {L0:34.3515,L1:3034.9057,p0:14.3312,p1:0.2155,e0:0.048498,e1:0.000163,a:5.202560,N0:100.4542,N1:0.1768},
    Saturn:  {L0:50.0774,L1:1222.1138,p0:93.0572,p1:0.3025,e0:0.055546,e1:-0.000346,a:9.554747,N0:113.6634,N1:0.2507},
  };

  const el = elements[planet];
  if (!el) return 0;

  // Mean longitude & anomaly
  const L = norm360(el.L0 + el.L1 * T);
  const perihelion = norm360(el.p0 + el.p1 * T);
  const e = el.e0 + el.e1 * T;
  let M = norm360(L - perihelion);
  const Mrad = M * DEG;

  // Solve Kepler's equation (iterate)
  let E = Mrad;
  for (let i = 0; i < 10; i++) {
    E = Mrad + e * Math.sin(E);
  }

  // True anomaly
  const v = 2 * Math.atan2(
    Math.sqrt(1+e) * Math.sin(E/2),
    Math.sqrt(1-e) * Math.cos(E/2)
  ) * RAD;

  // Heliocentric longitude
  const helioLon = norm360(v + perihelion);

  // Convert heliocentric → geocentric (simplified)
  const sunLon = sunLongitude(T);
  // For inner planets, more complex; for outer planets, approximate
  const r = el.a * (1 - e * Math.cos(E)); // distance from sun

  // Sun's distance (approximate)
  const Ms = norm360(357.52911 + 35999.05029*T) * DEG;
  const Rs = 1.00014 - 0.01671*Math.cos(Ms) - 0.00014*Math.cos(2*Ms);

  const helioRad = helioLon * DEG;
  const sunRad = sunLon * DEG;

  // Geocentric longitude (simplified projection)
  const x = r * Math.cos(helioRad) - Rs * Math.cos(sunRad);
  const y = r * Math.sin(helioRad) - Rs * Math.sin(sunRad);
  const geoLon = Math.atan2(y, x) * RAD;

  return norm360(geoLon);
}

/** Mean longitude of Rahu (ascending lunar node) */
function rahuLongitude(T: number): number {
  return norm360(125.04452 - 1934.136261*T + 0.0020708*T*T);
}

// ---------------------------------------------------------------------------
// Sidereal & Nakshatra helpers
// ---------------------------------------------------------------------------

function toSidereal(tropical: number, ayanamsa: number): number {
  return norm360(tropical - ayanamsa);
}

function getRashi(sid: number) {
  const i = Math.floor(sid / 30) % 12;
  return { name: RASHIS[i], index: i };
}

function getNakshatra(sid: number) {
  const span = 360 / 27;
  const i = Math.floor(sid / span) % 27;
  const pos = sid - i * span;
  const pada = Math.min(Math.floor(pos / (span / 4)) + 1, 4);
  return { name: NAKSHATRAS[i], index: i, pada };
}

function formatDeg(sid: number): string {
  const d = sid % 30;
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${deg}°${min.toString().padStart(2,"0")}'`;
}

// ---------------------------------------------------------------------------
// Ascendant (Lagna)
// ---------------------------------------------------------------------------

function calcAscendant(jd: number, lat: number, lng: number, ayanamsa: number): number {
  const T = julianCentury(jd);
  // GMST in degrees
  let gmst = 280.46061837 + 360.98564736629*(jd-2451545.0)
           + 0.000387933*T*T - T*T*T/38710000;
  gmst = norm360(gmst);
  const lst = norm360(gmst + lng);
  const eps = (23.4393 - 0.013*T) * DEG;
  const latR = lat * DEG;
  const lstR = lst * DEG;

  let asc = Math.atan2(Math.cos(lstR),
    -(Math.sin(lstR)*Math.cos(eps) + Math.tan(latR)*Math.sin(eps))) * RAD;
  return toSidereal(norm360(asc), ayanamsa);
}

// ---------------------------------------------------------------------------
// Vimshottari Mahadasha
// ---------------------------------------------------------------------------

function calcMahadasha(moonSid: number, birthDate: Date) {
  const nak = getNakshatra(moonSid);
  const lordIdx = nak.index % 9;
  const lords: string[] = [];
  for (let i = 0; i < 9; i++) lords.push(NAKSHATRA_LORDS[(lordIdx + i) % 9]);

  const span = 360 / 27;
  const posIn = moonSid - nak.index * span;
  const frac = posIn / span;
  const first = lords[0];
  const firstRemaining = DASHA_YEARS[first] * (1 - frac);

  const now = new Date();
  const ageYrs = (now.getTime() - birthDate.getTime()) / (365.25*24*3600*1000);

  const fmt = (d: Date) => d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  const yrsStr = (y: number) => `${Math.floor(y)} years ${Math.floor((y%1)*12)} months`;
  const msPerYr = 365.25*24*3600*1000;

  if (ageYrs < firstRemaining) {
    return {
      current: `${first} Mahadasha`, lord: first,
      startDate: fmt(birthDate),
      endDate: fmt(new Date(birthDate.getTime() + firstRemaining*msPerYr)),
      elapsed: yrsStr(ageYrs), remaining: yrsStr(firstRemaining - ageYrs),
    };
  }

  let acc = firstRemaining;
  for (let cycle = 0; cycle < 3; cycle++) {
    const start = cycle === 0 ? 1 : 0;
    for (let i = start; i < 9; i++) {
      const lord = lords[i % 9];
      const yrs = DASHA_YEARS[lord];
      if (ageYrs < acc + yrs) {
        const startMs = birthDate.getTime() + acc*msPerYr;
        return {
          current: `${lord} Mahadasha`, lord,
          startDate: fmt(new Date(startMs)),
          endDate: fmt(new Date(startMs + yrs*msPerYr)),
          elapsed: yrsStr(ageYrs - acc), remaining: yrsStr(acc + yrs - ageYrs),
        };
      }
      acc += yrs;
    }
  }

  return { current: `${first} Mahadasha`, lord: first,
    startDate: fmt(birthDate), endDate: "—", elapsed: "—", remaining: "—" };
}

// ---------------------------------------------------------------------------
// Coordinate resolution
// ---------------------------------------------------------------------------

function resolveCoords(pob: string) {
  const n = pob.toLowerCase().trim().replace(/[,.\s]+/g, " ");
  for (const [city, c] of Object.entries(CITIES)) {
    if (n.includes(city)) return c;
  }
  return CITIES["delhi"];
}

// ---------------------------------------------------------------------------
// Main: Calculate complete Vedic chart
// ---------------------------------------------------------------------------

const PLANETS: Array<{key:string; name:string; nameEn:string}> = [
  {key:"Sun",name:"Surya",nameEn:"Sun"},
  {key:"Moon",name:"Chandra",nameEn:"Moon"},
  {key:"Mars",name:"Mangala",nameEn:"Mars"},
  {key:"Mercury",name:"Budha",nameEn:"Mercury"},
  {key:"Jupiter",name:"Guru",nameEn:"Jupiter"},
  {key:"Venus",name:"Shukra",nameEn:"Venus"},
  {key:"Saturn",name:"Shani",nameEn:"Saturn"},
];

export function calculateVedicChart(dob: string, tob: string, pob: string): VedicChart {
  const coords = resolveCoords(pob);
  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);

  const localDate = new Date(year, month-1, day, hour, minute, 0);
  const utcDate = new Date(localDate.getTime() - coords.tz*3600*1000);
  const jd = julianDay(utcDate);
  const T = julianCentury(jd);
  const ayanamsa = getLahiriAyanamsa(jd);

  // Ascendant
  const ascLong = calcAscendant(jd, coords.lat, coords.lng, ayanamsa);
  const ascRashi = getRashi(ascLong);
  const ascIdx = ascRashi.index;

  // Planets
  const planets: PlanetPosition[] = [];

  for (const p of PLANETS) {
    let tropLong: number;
    if (p.key === "Sun") tropLong = sunLongitude(T);
    else if (p.key === "Moon") tropLong = moonLongitude(T);
    else tropLong = planetLongitude(p.key, T);

    const sid = toSidereal(tropLong, ayanamsa);
    const rashi = getRashi(sid);
    const nak = getNakshatra(sid);
    const house = ((rashi.index - ascIdx + 12) % 12) + 1;

    planets.push({
      name: p.name, nameEn: p.nameEn,
      siderealLongitude: sid, sign: rashi.name, signIndex: rashi.index,
      house, degree: formatDeg(sid),
      nakshatra: nak.name, nakshatraIndex: nak.index, nakshatraPada: nak.pada,
    });
  }

  // Rahu & Ketu
  const rahuTrop = rahuLongitude(T);
  const rahuSid = toSidereal(rahuTrop, ayanamsa);
  const rahuR = getRashi(rahuSid), rahuN = getNakshatra(rahuSid);
  planets.push({
    name:"Rahu",nameEn:"North Node",siderealLongitude:rahuSid,
    sign:rahuR.name,signIndex:rahuR.index,
    house:((rahuR.index-ascIdx+12)%12)+1,degree:formatDeg(rahuSid),
    nakshatra:rahuN.name,nakshatraIndex:rahuN.index,nakshatraPada:rahuN.pada,
  });

  const ketuSid = norm360(rahuSid + 180);
  const ketuR = getRashi(ketuSid), ketuN = getNakshatra(ketuSid);
  planets.push({
    name:"Ketu",nameEn:"South Node",siderealLongitude:ketuSid,
    sign:ketuR.name,signIndex:ketuR.index,
    house:((ketuR.index-ascIdx+12)%12)+1,degree:formatDeg(ketuSid),
    nakshatra:ketuN.name,nakshatraIndex:ketuN.index,nakshatraPada:ketuN.pada,
  });

  const moon = planets.find(p => p.name === "Chandra")!;
  const sun = planets.find(p => p.name === "Surya")!;

  return {
    birthDate: localDate, latitude: coords.lat, longitude: coords.lng,
    ayanamsa, ascendantLongitude: ascLong, ascendant: ascRashi.name,
    sunSign: sun.sign, moonSign: moon.sign, planets,
    mahadasha: calcMahadasha(moon.siderealLongitude, localDate),
  };
}
