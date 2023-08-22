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

import PlayerFloatMenu from './PlayerFloatMenu';
import PlayerLoading from './PlayerLoading';
import PlayerOptionsButtons from './PlayerOptionsButtons';
import PlayerPausedOverlay from './PlayerPausedOverlay';
import PlayerSeeker from './PlayerSeeker';
import PlayPauseButton from './PlayPauseButton';

export interface PlayerProps {
	src: string;
	thumbnailURL?: string | "";
	playbackRates?: [];
	settings?: object;
}

export interface PlayerChild {
	setPlayerState: any;
	playerState: any;
	handlePlayerAction: (arg0: PlayerActions, arg2?: any) => void;
}

export type PlayerActions =
	| "play-pause"
	| "time-update"
	| "speed-change"
	| "seek-change"
	| "seek-start"
	| "seek-end"
	| "toggle-fullscreen"
	| "change-video"
	| "toggle-mute";

const Player = (props: PlayerProps) => {
	const srcUrl = `${props.src}`;

	const progressTimeout = useRef<any>(null);
	const containerRef = useRef<any>(null);
	const videoRef = useRef<any>(null);

	const [playerState, setPlayerState] = useState({
		isPlaying: false,
		progress: 0,
		seekValue: 0,
		isSeeking: false,
		videoSpeed: 1,
		isMuted: false,
		isFullscreen: false,
		isVideoLoaded: false,
		hasInitialized: false,
		controller: { active: false },
		floatMenu: {
			active: false,
			menu: "",
			nested: "",
		},
	});

	const resetAll = () => {
		setPlayerState((prev) => ({
			...prev,
			hasInitialized: false,
			isPlaying: false,
			isSeeking: false,
			seekValue: 0,
			progress: 0,
			isVideoLoaded: false,
		}));
	};

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

	React.useEffect(() => {
		const videoElement = videoRef.current;
		if (videoElement) {
			resetAll();
			videoElement.src = srcUrl;
		}
	}, [srcUrl]);

	useEffect(() => {
		if (playerState.isSeeking) {
			const videoElement = videoRef.current;
			const seekTime = (playerState.seekValue / 100) * videoElement.duration;
			videoElement.currentTime = seekTime || 0;
		}
	}, [playerState.isSeeking, playerState.seekValue]);

	useEffect(() => {
		const videoElement = videoRef.current;

		const handleCanPlay = () => {
			setPlayerState((prev) => ({ ...prev, isVideoLoaded: true }));
			if (playerState.isSeeking) {
				videoElement.play(); // Start playing the video if seeking
			}
		};

		const handleLoadStart = () => {
			if (playerState.isPlaying) {
				setPlayerState((prev) => ({ ...prev, isVideoLoaded: false }));
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
				setPlayerState((prev) => ({ ...prev, isPlaying: true }));
			} else {
				videoElement.pause();
				setPlayerState((prev) => ({ ...prev, isPlaying: false }));
			}
		}
		if (!playerState.hasInitialized) {
			setPlayerState((prev) => ({ ...prev, hasInitialized: true }));
		}
	};

	const handleTimeUpdate = () => {
		const videoElement = videoRef.current;

		if (videoElement) {
			const { currentTime, duration } = videoElement;
			const newProgress = (currentTime / duration) * 100;

			// if (playerState.isSeeking) {
			setPlayerState((prev) => ({
				...prev,
				progress: newProgress,
				seekValue: newProgress,
			}));
		}
	};

	const handleSeekStart = () => {
		setPlayerState((prev) => ({ ...prev, isSeeking: true }));
	};

	const handleSeekEnd = () => {
		setPlayerState((prev) => ({ ...prev, isSeeking: false }));

		if (progressTimeout.current) {
			clearTimeout(progressTimeout.current);
		}

		progressTimeout.current = setTimeout(() => {
			const videoElement = videoRef.current;
			const { currentTime, duration } = videoElement;
			const newProgress = (currentTime / duration) * 100;
			setPlayerState((prev) => ({ ...prev, progress: newProgress }));
			progressTimeout.current = null;
		}, 500);
	};

	const handleSeekChange = (e: any) => {
		setPlayerState((prev) => ({
			...prev,
			seekValue: Number(e.target.value),
			progress: Number(e.target.value),
		}));
	};

	const handleSpeedChange = (speed: number) => {
		if (speed) {
			setPlayerState((prev) => ({ ...prev, videoSpeed: speed }));
			const videoElement = videoRef.current;
			if (videoElement) {
				videoElement.playbackRate = speed;
			}
		}
	};

	const handleToggleMute = () => {
		const videoElement = videoRef.current;
		if (videoElement) {
			videoElement.muted = !videoElement.muted;
			setPlayerState((prev) => ({ ...prev, isMuted: videoElement.muted }));
		}
	};

	const handleChangeVideo = (target: string) => {
		if (target === "prev") {
			// change src to previous video in playlist
		} else if (target === "next") {
			// change src to next video
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
			setPlayerState((prev) => ({ ...prev, isFullscreen: true }));
		}
	};

	const handlePlayerAction = (action: PlayerActions, payload?: any | null) => {
		switch (action) {
			case "play-pause":
				handlePlayPause();
				break;
			case "time-update":
				handleTimeUpdate();
			case "speed-change":
				handleSpeedChange(payload);
				break;
			case "seek-change":
				handleSeekChange(payload);
				break;
			case "seek-start":
				handleSeekStart();
				break;
			case "seek-end":
				handleSeekEnd();
				break;
			case "toggle-fullscreen":
				handleToggleFullscreen();
				break;
			case "toggle-mute":
				handleToggleMute();
				break;
			case "change-video":
				handleChangeVideo(payload);
				break;
			default:
				console.log("It's a weekend :)");
				break;
		}
	};

	return (
		<div
			onMouseEnter={() => {
				setPlayerState((prev) => ({
					...prev,
					floatMenu: {
						...prev.floatMenu,
						active: prev.floatMenu.active,
						nested: prev.floatMenu.nested,
					},
					controller: { ...prev.controller, active: true },
				}));
			}}
			onMouseLeave={() => {
				setPlayerState((prev) => ({
					...prev,
					floatMenu: {
						...prev.floatMenu,
						active: false,
						nested: "",
					},
					controller: { ...prev.controller, active: false },
				}));
			}}
			className="relative h-full w-full"
			ref={containerRef}>
			<video
				onClick={() => handlePlayerAction("play-pause")}
				playsInline
				ref={videoRef}
				className="w-full h-full bg-black"
				onTimeUpdate={(e) => handlePlayerAction("time-update")}
			/>
			<AnimatePresence>
				{/* VIDEO LOADING */}
				{!playerState.isVideoLoaded && !playerState.hasInitialized && (
					<PlayerLoading />
				)}
				{/* VIDEO IS PAUSED */}
				{(!playerState.hasInitialized && props.thumbnailURL) ||
					(!playerState.isPlaying && (
						<PlayerPausedOverlay
							playerState={playerState}
							setPlayerState={setPlayerState}
							handlePlayerAction={handlePlayerAction}
							thumbnailURL={props.thumbnailURL}
						/>
					))}
				{/* SHOWING FLOAT MENU WHEN PRESSING SETTINGS */}
				{playerState.floatMenu.active && (
					<PlayerFloatMenu
						playerState={playerState}
						setPlayerState={setPlayerState}
						handlePlayerAction={handlePlayerAction}
					/>
				)}
				{playerState.controller.active && (
				<motion.div
					initial={{opacity: 0}}
					animate={{opacity: 1}}
					exit={{opacity: 0}}
					key={'player_bottom_bar'}
					className={` absolute bottom-2 mx-auto left-0 right-0 w-[95%] backdrop-blur text-white  flex items-center gap-2 rounded-lg`}>
					<PlayPauseButton
						isPlaying={playerState.isPlaying}
						handlePlayPause={() => handlePlayerAction("play-pause")}
					/>
					<div className="bg-black/25 w-full h-full flex items-center pl-4 rounded-lg py-1">
						<PlayerSeeker
							playerState={playerState}
							setPlayerState={setPlayerState}
							handlePlayerAction={handlePlayerAction}
						/>
						<PlayerOptionsButtons
							playerState={playerState}
							setPlayerState={setPlayerState}
							handlePlayerAction={handlePlayerAction}
						/>
					</div>
				</motion.div>) }
				
			</AnimatePresence>
		</div>
	);
};

export default Player;
