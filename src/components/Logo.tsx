// "mahmya logo 1 [Vectorized]" — Figma node 704:834. Each vector keeps the exact
// inset (top right bottom left, in %) it has inside the 115×44 logo frame.
import v00 from '../assets/figma/logo/logo-00.svg';
import v01 from '../assets/figma/logo/logo-01.svg';
import v02 from '../assets/figma/logo/logo-02.svg';
import v03 from '../assets/figma/logo/logo-03.svg';
import v04 from '../assets/figma/logo/logo-04.svg';
import v05 from '../assets/figma/logo/logo-05.svg';
import v06 from '../assets/figma/logo/logo-06.svg';
import v07 from '../assets/figma/logo/logo-07.svg';
import v08 from '../assets/figma/logo/logo-08.svg';
import v09 from '../assets/figma/logo/logo-09.svg';
import v10 from '../assets/figma/logo/logo-10.svg';
import v11 from '../assets/figma/logo/logo-11.svg';
import v12 from '../assets/figma/logo/logo-12.svg';
import v13 from '../assets/figma/logo/logo-13.svg';
import v14 from '../assets/figma/logo/logo-14.svg';
import v15 from '../assets/figma/logo/logo-15.svg';

const LAYERS: [string, string][] = [
  [v00, '46.24% 39.24% 27.99% 41.69%'],
  [v01, '31.63% 58.02% 28.07% 29.76%'],
  [v02, '46.15% 27.97% 17.6% 60.68%'],
  [v03, '46.34% 16.07% 28.11% 72.69%'],
  [v04, '2.37% 11.36% 94.52% 88.02%'],
  [v05, '34.45% 68.98% 28.1% 0'],
  [v06, '75.7% 5.8% 1.09% 36.69%'],
  [v07, '0 0.39% 7.87% 79.99%'],
  [v08, '98.83% 9.06% 0 85.47%'],
  [v09, '22.8% 18.95% 73.07% 80.53%'],
  [v10, '98.96% 8.79% 0 90.21%'],
  [v11, '6.11% 13.27% 90.81% 86.1%'],
  [v12, '95.92% 4.94% 2.55% 93.68%'],
  [v13, '11.39% 7.86% 87.26% 91.42%'],
  [v14, '8.85% 10.27% 89.83% 88.93%'],
  [v15, '5.93% 6.75% 92.47% 92.79%'],
];

export function Logo() {
  return (
    <div className="logo" role="img" aria-label="Mahmya">
      {LAYERS.map(([src, inset]) => (
        <span key={src} style={{ inset }}>
          <img src={src} alt="" />
        </span>
      ))}
    </div>
  );
}
