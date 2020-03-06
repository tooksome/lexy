#!/usr/bin/env node -r esm
import fs       from 'fs'
import JSSoup   from 'jssoup'
import _        from 'lodash'
import glob     from 'glob'
//
import Bee      from '../src/lib/Bee'
import Scrabble from './wl_us.json'

// --- Setup
// wget -r -l100000 --no-clobber -nv https://nytbee.com/
const data_dir = '/data/ripd/nytbee.com'
const dict_fn  = './data/dicts.js'

// --- Parse
const AllWords = new Set()
const AllObs   = new Set()
const AllBees  = []

glob(`${data_dir}/Bee_*.html`, (err, files) => {
  files.forEach((filename) => {
    // console.log(filename)
    const raw_html = fs.readFileSync(filename, 'utf8');
    const doc = new JSSoup(raw_html);
    const [wds_els, _skip, obs_els] = doc.findAll('div').filter((div) => div.attrs.class === 'answer-list')

    const words = {}
    words.wds     = wds_els.text.split(/\s+/).filter((ss) => (ss.length > 0))
    words.obs     = obs_els.findAll('li').map((li) => li.text)
    // words.datestr = datestr

    // Find main letter
    const ltr_hist = {}
    words.wds.forEach(
      (word) => word.split('').forEach(
        (ltr) => (ltr_hist[ltr] = 1 + (ltr_hist[ltr]||0)))) // eslint-disable-line

    // add to lexicons
    words.wds.forEach((word) => AllWords.add(word))
    words.obs.forEach((word) => AllObs.add(word))

    words.letters = Object
      .entries(ltr_hist)
      .sort(([_a, cta], [_b, ctb]) => ((cta > ctb) ? -1 : 1))
      .map(([ll, _x]) => ll)
      .join('')

    words.letters = Bee.normalize(words.letters)

    AllBees.push(words)
  })

  const all_wds = Array.from(AllWords.values()).sort()
  const all_obs = Array.from(AllObs.values()).sort()
  // console.log(all_wds)

  const dicts_prog = `
const NytDict = new Set(${JSON.stringify(all_wds)})
const ObsDict = new Set(${JSON.stringify(all_obs)})
const ScrDict = new Set(${JSON.stringify(Scrabble)})

const Dicts = { nyt: NytDict, obs: ObsDict, scr: ScrDict }
export default Dicts
`;

  fs.writeFileSync(dict_fn, dicts_prog, { encoding: 'utf8' });

  // import Dicts from './dicts'
  // console.log(Dicts)
})
