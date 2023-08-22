/** @format */
"use client";
import React from 'react';

import {
  BsFillPlayFill,
  BsPauseFill,
} from 'react-icons/bs';

import { Button } from '@nextui-org/react';

type Props = {
	isPlaying: boolean;
	handlePlayPause: () => void;
};

const PlayPauseButton = (props: Props) => {
	return (
		<Button
			variant="shadow"
			isIconOnly
			className="px-2 py-2 rounded bg-black text-white w-24 h-full "
			color="primary"
			onPress={props.handlePlayPause}>
			{props.isPlaying ? (
				<BsPauseFill className="w-6 h-6" />
			) : (
				<BsFillPlayFill className="w-6 h-6" />
			)}
		</Button>
	);
};

export default PlayPauseButton;
