interface SoundEffects {
	[key: string]: HTMLAudioElement;
}

export const soundEffects: SoundEffects = {
	beep: new Audio("/sounds/beepalt.mp3"),
	click: new Audio("/sounds/click.mp3"),
	gameOver: new Audio("/sounds/gameover.mp3"),
	success: new Audio("/sounds/success.mp3"),
	success2: new Audio("/sounds/success2.mp3"),
	success3: new Audio("/sounds/success3.mp3"),
	fail: new Audio("/sounds/fail.mp3"),
};

export const playSoundEffect = (name: keyof SoundEffects, mute: boolean) => {
	const soundEffect = soundEffects[name];
	if (soundEffect && !mute) {
		soundEffect.currentTime = 0;
		soundEffect.play();
	}
};
