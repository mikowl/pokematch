interface SoundEffects {
	[key: string]: HTMLAudioElement;
}

export const soundEffects: SoundEffects = {
	gameOver: new Audio("/gameover.mp3"),
	success: new Audio("/success.mp3"),
	success2: new Audio("/success2.mp3"),
	fail: new Audio("/fail.mp3"),
};

export const playSoundEffect = (name: keyof SoundEffects, mute: boolean) => {
	const soundEffect = soundEffects[name];
	if (soundEffect && !mute) {
		soundEffect.currentTime = 0;
		soundEffect.play();
	}
};
