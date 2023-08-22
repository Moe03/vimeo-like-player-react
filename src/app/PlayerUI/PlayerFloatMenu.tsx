/** @format */

import React from 'react';

import { motion } from 'framer-motion';
import {
  MdOutlineHighQuality,
  MdOutlineSpeed,
} from 'react-icons/md';

import { Button } from '@nextui-org/react';

import { PlayerChild } from './Player';

type Props = {};

const PlayerFloatMenu = (props: PlayerChild | any) => {
	const playbackRates = props.playbackRates || [
		0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
	];

	return (
		<motion.div
			key={`video_settings_float`}
			initial={{ opacity: 0, scale: 0.9, right: `2.5%` }}
			animate={{ opacity: 1, scale: 1, right: `2.5%` }}
			exit={{ opacity: 0, scale: 0.9, right: `2.5%` }}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 30,
				mass: 0.5,
			}}
			className={`absolute bottom-14  w-48 h-[70%] bg-black/50 backdrop-blur text-white  flex flex-col items-center gap-2 rounded-lg py-4 px-2`}>
			{props.playerState.floatMenu.nested === `speed` && (
				<div className="grid grid-cols-2 gap-1">
					{playbackRates.map((rate: number, index: number) => (
						<Button
							key={`player_speed_${index}`}
							size="md"
							className="bg-black text-white w-full flex items-center justify-between mx-0 text-center"
							onPress={() => {
								props.handlePlayerAction("speed-change", rate);
								props.setPlayerState((prev: any) => ({
									...prev,
									floatMenu: { ...prev.floatMenu, nested: "" },
								}));
							}}>
							{rate}x
						</Button>
					))}
				</div>
			)}
			{!props.playerState.floatMenu.nested && (
				<>
					<Button
						size="sm"
						isDisabled
						className="bg-black text-white w-full flex items-center justify-between ">
						<div className="flex items-center">
							<MdOutlineHighQuality className="w-5 h-5 mr-1 " />
							<span>Quality</span>
						</div>
						<div>
							{/* Video quality here */}
							<span className="text-xs">Original</span>
							<span></span>
						</div>
					</Button>
					<Button
						size="sm"
						onPress={() => {
							props.setPlayerState((prev: any) => ({
								...prev,
								floatMenu: { ...prev.floatMenu, nested: "speed" },
							}));
						}}
						className="bg-black text-white w-full flex items-center justify-between mx-0">
						<div className="flex items-center">
							<MdOutlineSpeed className="w-5 h-5 mr-1" />
							<span>Speed</span>
						</div>
						<div>
							{/* Video speed here, should sync with user perefrences */}
							<span className="text-xs">{props.playerState.videoSpeed}x</span>
							<span></span>
						</div>
					</Button>
				</>
			)}
		</motion.div>
	);
};

export default PlayerFloatMenu;
