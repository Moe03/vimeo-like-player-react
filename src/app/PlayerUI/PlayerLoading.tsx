"use client";

import React from 'react';

import { motion } from 'framer-motion';

import { Spinner } from '@nextui-org/react';

type Props = {}

const PlayerLoading = (props: Props) => {
  return (
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
  )
}

export default PlayerLoading