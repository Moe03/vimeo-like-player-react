/** @format */
"use client";

import React from 'react';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  BsFillPlayFill,
  BsPauseFill,
  BsSkipBackwardFill,
} from 'react-icons/bs';
import { TbPlayerTrackNext } from 'react-icons/tb';

import { Button } from '@nextui-org/react';

import { PlayerChild } from './Player';

const PlayerPausedOverlay = (props: PlayerChild | any) => {
	return (
		<motion.div
			key={`video_paused`}
			initial={{ opacity: "0%" }}
			animate={{ opacity: "100%" }}
			exit={{ opacity: "0%" }}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 30,
				mass: 0.5,
			}}
			className="bg-black/20 backdrop-blur flex justify-center items-center  w-full h-full absolute z-20 bottom-0 left-0 gap-5">
			<Button
				size={`lg`}
				variant={`ghost`}
				isIconOnly
				className="px-2 py-2 rounded  text-white  z-20  "
				color="primary"
				onPress={() => props.handlePlayerAction("change-video", "prev")}>
				<BsSkipBackwardFill className="w-6 h-6" />
			</Button>
			<Button
				size={`lg`}
				variant="shadow"
				isIconOnly
				className="px-2 py-2 rounded  text-white  z-20  "
				color="primary"
				onPress={() => props.handlePlayerAction("play-pause")}>
				{props.playerState.isPlaying ? (
					<BsPauseFill className="w-6 h-6" />
				) : (
					<BsFillPlayFill className="w-6 h-6" />
				)}
			</Button>
			<Button
				size={`lg`}
				variant={`ghost`}
				isIconOnly
				className="px-2 py-2 rounded  text-white  z-20  "
				color="primary"
				onPress={() => props.handlePlayerAction("change-video", "next")}>
				<TbPlayerTrackNext className="w-6 h-6" />
			</Button>
            {props.thumbnailURL && <Image layout="fill" src={props.thumbnailURL || ""} alt={""} />}
		</motion.div>
	);
};

export default PlayerPausedOverlay;
