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
export const campusImages = {
  heroLight: heroDay, heroDark: heroNight,              // Hero + final CTA (School of ICT entrance)
  gate: { light: gateDay, dark: gateNight },            // About (university main building)
  aerial: { light: aerialDay, dark: aerialNight },      // How it works + Events hero
  dome: { light: domeDay, dark: domeNight },            // Why Campus Connect
  lostFound: { light: lostFoundDay, dark: lostFoundNight }, // Lost & Found hero (university gateway)
};