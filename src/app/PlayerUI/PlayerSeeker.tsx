"use client";

import React from 'react';

import { PlayerActions } from './Player';

type Props = {}

const PlayerSeeker = (props: any) => {

  return (
    <div className="w-full h-4 bg-black/50 rounded-lg overflow-hidden relative">
        <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={props.playerState.seekValue}
            className="w-full h-full appearance-none cursor-pointer absolute bg-transparent z-20 "
            onChange={(e) => props.handlePlayerAction('seek-change' as PlayerActions, e)}
            onMouseDown={() => props.handlePlayerAction('seek-start' as PlayerActions)}
            onMouseUp={() => props.handlePlayerAction(`seek-end` as PlayerActions)}
            onTouchStart={() => props.handlePlayerAction(`seek-start` as PlayerActions)}
            onTouchEnd={() => props.handlePlayerAction(`seek-end` as PlayerActions)}
        />
        <div className="h-full bg-primary/10 absolute w-full">
            <div
                className="h-full bg-primary absolute"
                style={{ width: `${props.playerState.progress}%` }}
            />
        </div>
    </div>
  )
}

export default PlayerSeeker