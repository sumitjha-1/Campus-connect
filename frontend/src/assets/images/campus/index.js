// Single place to swap campus images. Each image has one job, so sections don't repeat the same photo.
import heroDay from './campus-hero-day.png';
import heroNight from './campus-hero-night.png';
import aerialDay from './campus-aerial-day.png';
import aerialNight from './campus-aerial-night.png';
import domeDay from './campus-dome-day.jpg';
import domeNight from './campus-dome-night.png';
import gateDay from './campus-gate-day.png';
import gateNight from './campus-gate-night.png';
import lostFoundDay from './Grand University Gateway with Domes.png';
import lostFoundNight from './Twilight Entrance to Gautam Buddha University.png';
import jobsDay from './campus-jobs-day.png';
import jobsNight from './campus-jobs-night.png';
import helpDay from './campus-help-day.png';
import helpNight from './campus-help-night.png';

// Marketplace hero: drop your shopping-centre photos in this folder named
//   campus-market-day.(png|jpg|jpeg|webp)   and   campus-market-night.(png|jpg|jpeg|webp)
// They are picked up automatically. Until they exist, the gate photos are used instead (nothing breaks).
const marketFiles = import.meta.glob('./campus-market-*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const market = tone => Object.entries(marketFiles).find(([p]) => p.includes(`-${tone}.`))?.[1];

export const campusImages = {
  heroLight: heroDay, heroDark: heroNight,              // Hero + final CTA (School of ICT entrance)
  gate: { light: gateDay, dark: gateNight },            // About (university main building)
  aerial: { light: aerialDay, dark: aerialNight },      // How it works + Events hero
  dome: { light: domeDay, dark: domeNight },            // Why Campus Connect
  lostFound: { light: lostFoundDay, dark: lostFoundNight }, // Lost & Found hero (university gateway)
  market: { light: market('day') || gateDay, dark: market('night') || gateNight }, // Marketplace hero (shopping centre)
  jobs: { light: jobsDay, dark: jobsNight },            // Jobs & Alumni hero
  help: { light: helpDay, dark: helpNight },            // Campus Assistance hero (campus walkway)
};
