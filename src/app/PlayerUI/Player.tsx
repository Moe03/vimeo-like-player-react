/** @format */

"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import Image from 'next/image';
import {
  BiSolidVolumeMute,
  BiVolumeFull,
} from 'react-icons/bi';
import {
  BsFillPlayFill,
  BsPauseFill,
  BsSkipBackwardFill,
} from 'react-icons/bs';
import {
  MdFullscreen,
  MdOutlineHighQuality,
  MdOutlineSpeed,
} from 'react-icons/md';
import {
  TbPlayerTrackNext,
  TbSettingsFilled,
} from 'react-icons/tb';

import {
  Button,
  Spinner,
} from '@nextui-org/react';

import PlayPauseButton from './PlayPauseButton';

export interface PlayerProps {
	src: string;
	thumbnailURL?: string | "";
	playbackRates?: [];
	settings?: object;
}

const Player = (props: PlayerProps) => {

	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [seekValue, setSeekValue] = useState(0);
	const [isSeeking, setIsSeeking] = useState(false);
	const [videoSpeed, setVideoSpeed] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isVideoLoaded, setIsVideoLoaded] = useState(false);
	const [hasInitialized, setHasInit] = useState(false);

	const [controller, setController] = useState({
		active: true,
	});

	const [floatMenu, setFloat] = useState({
		active: false,
		menu: ``,
		nested: ``,
	});

	const progressTimeout = useRef<any>(null);
	const containerRef = useRef<any>(null);
	const videoRef = useRef<any>(null);

	const srcUrl = `${props.src}`;

	const resetAll = () => {
		setHasInit(false);
		setIsPlaying(false);
		setIsSeeking(false);
		setSeekValue(0);
		setProgress(0);
		setIsVideoLoaded(false);
	};

	React.useEffect(() => {
		const videoElement = videoRef.current;

		if (videoElement) {
			resetAll();
			videoElement.src = srcUrl;
		}
	}, [srcUrl]);

	useEffect(() => {
		if (isSeeking) {
			const videoElement = videoRef.current;
			const seekTime = (seekValue / 100) * videoElement.duration;
			videoElement.currentTime = seekTime || 0;
		}
	}, [isSeeking, seekValue]);

	useEffect(() => {
		const resizeHandler = () => {
			const containerElement = containerRef.current;
			if (containerElement) {
				const width = containerElement.offsetWidth;
				const height = (width * 9) / 16; // Calculate the height based on 16:9 aspect ratio
				containerElement.style.height = `${height}px`;
			}
		};

		window.addEventListener("resize", resizeHandler);
		resizeHandler();

		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	useEffect(() => {
		const videoElement = videoRef.current;

		const handleCanPlay = () => {
			setIsVideoLoaded(true);
			if (isSeeking) {
				videoElement.play(); // Start playing the video if seeking
			}
		};

		const handleLoadStart = () => {
			if (isPlaying) {
				setIsVideoLoaded(false);
			}
		};

		const handleSeeking = () => {
			handleLoadStart();
		};

		videoElement.addEventListener("canplay", handleCanPlay);
		videoElement.addEventListener("loadstart", handleLoadStart);
		videoElement.addEventListener("seeking", handleSeeking);

		return () => {
			videoElement.removeEventListener("canplay", handleCanPlay);
			videoElement.removeEventListener("loadstart", handleLoadStart);
			videoElement.removeEventListener("seeking", handleSeeking);
		};
	}, []);

	const handlePlayPause = () => {
		const videoElement = videoRef.current;

		if (videoElement) {
			if (videoElement.paused) {
				videoElement.play();
				setIsPlaying(true);
			} else {
				videoElement.pause();
				setIsPlaying(false);
			}
		}
		if (!hasInitialized) {
			setHasInit(true);
		}
	};

	const handleTimeUpdate = () => {
		const videoElement = videoRef.current;

		if (videoElement) {
			const { currentTime, duration } = videoElement;
			const newProgress = (currentTime / duration) * 100;

			if (!isSeeking) {
				setProgress(newProgress);
				setSeekValue(newProgress);
			}
		}
	};

	const handleSeekStart = () => {
		setIsSeeking(true);
	};

	const handleSeekEnd = () => {
		setIsSeeking(false);

		if (progressTimeout.current) {
			clearTimeout(progressTimeout.current);
		}

		progressTimeout.current = setTimeout(() => {
			const videoElement = videoRef.current;
			const { currentTime, duration } = videoElement;
			const newProgress = (currentTime / duration) * 100;
			setProgress(newProgress);
			progressTimeout.current = null;
		}, 500);
	};

	const handleSeekChange = (e: any) => {
		setSeekValue(Number(e.target.value));
		setProgress(Number(e.target.value));
	};

	const handleSpeedChange = (speed: any) => {
		setVideoSpeed(speed);
		const videoElement = videoRef.current;
		if (videoElement) {
			videoElement.playbackRate = speed;
		}
	};

	const handleToggleMute = () => {
		const videoElement = videoRef.current;
		if (videoElement) {
			videoElement.muted = !videoElement.muted;
			setIsMuted(videoElement.muted);
		}
	};

	const handleChangeVideo = (target: string) => {
		if (target === "prev") {
			// change to previous video in playlist
		} else if (target === "next") {
			// change to next video
		}
	};

	const handleToggleFullscreen = () => {
		const videoElement = videoRef.current;
		if (videoElement) {
			if (videoElement.requestFullscreen) {
				videoElement.requestFullscreen();
			} else if (videoElement.mozRequestFullScreen) {
				videoElement.mozRequestFullScreen();
			} else if (videoElement.webkitRequestFullscreen) {
				videoElement.webkitRequestFullscreen();
			} else if (videoElement.msRequestFullscreen) {
				videoElement.msRequestFullscreen();
			}
			setIsFullscreen(true);
		}
	};

	const playbackRates = props.playbackRates || [
		0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
	];

	return (
		<div
			onMouseEnter={() => {
				setFloat((prev) => ({
					...prev,
					active: prev.active,
					nested: prev.nested,
				}));
				setController((prev) => ({ ...prev, active: true }));
			}}
			onMouseLeave={() => {
				setFloat((prev) => ({ ...prev, active: false, nested: `` }));
				setController((prev) => ({ ...prev, active: false }));
			}}
			className="relative h-full w-full"
			ref={containerRef}>
			<video
				onClick={handlePlayPause}
				playsInline
				ref={videoRef}
				className="w-full h-full bg-black"
				onTimeUpdate={handleTimeUpdate}
			/>
			<AnimatePresence>
				{/* VIDEO IS PAUSED */}
				{(!hasInitialized && props.thumbnailURL) ||
					(!isPlaying && (
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
								onPress={() => handleChangeVideo(`prev`)}>
								<BsSkipBackwardFill className="w-6 h-6" />
							</Button>
							<Button
								size={`lg`}
								variant="shadow"
								isIconOnly
								className="px-2 py-2 rounded  text-white  z-20  "
								color="primary"
								onPress={handlePlayPause}>
								{isPlaying ? (
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
								onPress={() => handleChangeVideo("next")}>
								<TbPlayerTrackNext className="w-6 h-6" />
							</Button>

							<Image layout="fill" src={props.thumbnailURL || ""} alt={""} />
						</motion.div>
					))}

				{/* VIDEO LOADED AND PLAYING */}
				{!isVideoLoaded && hasInitialized && (
					<motion.div
						key={`video_playing`}
						initial={{ opacity: 0, scale: 0.9, right: `2.5%` }}
						animate={{ opacity: 1, scale: 1, right: `2.5%` }}
						exit={{ opacity: 0, scale: 0.9, right: `2.5%` }}
						transition={{
							type: "spring",
							stiffness: 500,
							damping: 30,
							mass: 0.5,
						}}
						className="bg-transparent flex-all-center  w-full h-full absolute z-20 bottom-0">
						<div className="flex-all-center rounded-full  p-2">
							<Spinner color="primary" />
						</div>
					</motion.div>
				)}
				{/* SHOWING FLOAT MENU WHEN PRESSING SETTINGS */}
				{floatMenu.active && (
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
						{floatMenu.nested === `speed` && (
							<div className="grid grid-cols-2 gap-1">
								{playbackRates.map((rate) => (
									<Button
										size="md"
										className="bg-black text-white w-full flex items-center justify-between mx-0 text-center"
										onPress={() => {
											handleSpeedChange(rate);
											setFloat((prev) => ({ ...prev, nested: "" }));
										}}>
										{rate}x
									</Button>
								))}
							</div>
						)}
						{!floatMenu.nested && (
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
									onPress={() =>
										setFloat((prev) => ({ ...prev, nested: `speed` }))
									}
									className="bg-black text-white w-full flex items-center justify-between mx-0">
									<div className="flex items-center">
										<MdOutlineSpeed className="w-5 h-5 mr-1" />
										<span>Speed</span>
									</div>
									<div>
										{/* Video speed here, should sync with user perefrences */}
										<span className="text-xs">{videoSpeed}x</span>
										<span></span>
									</div>
								</Button>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
			<div
				className={`${
					controller.active ? `opacity-1` : `opacity-0`
				} absolute bottom-2 mx-auto left-0 right-0 w-[95%] bg-opacity-70 text-white  flex items-center gap-2 rounded-lg transition-all duration-500`}>
				<PlayPauseButton isPlaying={isPlaying} handlePlayPause={handlePlayPause} />
				<div className="bg-black/25 backdrop-blur w-full h-full flex items-center pl-4 rounded-lg py-1">
					<div className="w-full h-4 bg-black/50 rounded-lg overflow-hidden relative">
						<input
							type="range"
							min={0}
							max={100}
							step={0.1}
							value={seekValue}
							className="w-full h-full appearance-none cursor-pointer absolute bg-transparent z-20 "
							onChange={handleSeekChange}
							onMouseDown={handleSeekStart}
							onMouseUp={handleSeekEnd}
							onTouchStart={handleSeekStart}
							onTouchEnd={handleSeekEnd}
						/>
						<div className="h-full bg-primary/10 absolute w-full">
							<div
								className="h-full bg-primary absolute"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
					<div className={`flex`}>
						<Button
							onPress={() =>
								setFloat((prev) => ({
									...prev,
									active: !prev.active,
									menu: "settings",
								}))
							}
							size="sm"
							isIconOnly
							className="bg-transparent text-white">
							<TbSettingsFilled className="w-5 h-5" />
						</Button>
						<Button
							onPress={handleToggleMute}
							size="sm"
							isIconOnly
							className="bg-transparent text-white">
							{isMuted ? (
								<BiSolidVolumeMute className="w-5 h-5 " />
							) : (
								<BiVolumeFull className="w-5 h-5" />
							)}
						</Button>
						<Button
							onPress={handleToggleFullscreen}
							size="sm"
							isIconOnly
							className="bg-transparent text-white">
							<MdFullscreen className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Player;
