"use client";

import React from 'react';

import {
  BiSolidVolumeMute,
  BiVolumeFull,
} from 'react-icons/bi';
import { MdFullscreen } from 'react-icons/md';
import { TbSettingsFilled } from 'react-icons/tb';

import { Button } from '@nextui-org/react';

import { PlayerChild } from './Player';

const PlayerOptionsButtons = (props: PlayerChild) => {
  return (
    <div className={`flex`}>
    <Button
        onPress={() => {
            props.setPlayerState((prev: any) => ({
                ...prev,
                floatMenu: {
                    ...prev.floatMenu,
                    active: !prev.floatMenu.active,
                    menu: "settings",
                },
            }));
        }}
        size="sm"
        isIconOnly
        className="bg-transparent text-white">
        <TbSettingsFilled className="w-5 h-5" />
    </Button>
    <Button
        onPress={() => props.handlePlayerAction("toggle-mute")}
        size="sm"
        isIconOnly
        className="bg-transparent text-white">
        {props.playerState.isMuted ? (
            <BiSolidVolumeMute className="w-5 h-5 " />
        ) : (
            <BiVolumeFull className="w-5 h-5" />
        )}
    </Button>
    <Button
        onPress={() => props.handlePlayerAction('toggle-fullscreen')}
        size="sm"
        isIconOnly
        className="bg-transparent text-white">
        <MdFullscreen className="w-5 h-5" />
    </Button>
</div>
  )
}

export default PlayerOptionsButtons