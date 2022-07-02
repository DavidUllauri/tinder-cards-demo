import { useState } from 'react';
import { animated, to as interpolate, useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import './App.css';

const cards = [
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
]

const to = (i) => ({
  x: 0,
  y: i,
  scale: 1,
  rot: 0,
  delay: i * 100
})
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(0deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set())
  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  }))

  const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = vx > 0.2
    if (!active && trigger)
      gone.add(index);
    api.start(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0
      const rot = active ? mx / 100 : 0
      const scale = active ? 1.1 : 1
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: active ? 0: isGone ? 200 : 500 },
      }
    })
    if (!active && gone.size === cards.length)
      setTimeout(() => {
        gone.clear()
        api.start(i => to(i))
      }, 600)
  })
  return (
    <>
      {props.map(({ x, y, rot, scale }, i ) => (
        <animated.div className='deck' key={i} style={{ x, y }}>
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], (r, s) => `rotate(${r}deg) scale(${s})`),
            }}
          >
            <img src={cards[i]} alt="Torrot" draggable="false" />
          </animated.div>
        </animated.div>
      ))}
    </>
  )
}

export default function App() {
  return (
    <div className='flex fill center container'>
      <Deck />
    </div>
  );
}
