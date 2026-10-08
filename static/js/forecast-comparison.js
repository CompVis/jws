const forecastSliders = document.querySelectorAll('.forecast-sample .forecast-comparison__slider');
forecastSliders.forEach(slider => {
    slider.addEventListener('input', () => {
        forecastSliders.forEach(control => {
            control.value = slider.value;
            control.setAttribute('aria-valuetext', `${slider.value}% ground truth`);
            control.closest('.forecast-comparison__viewport').style.setProperty('--reveal-position', `${slider.value}%`);
        });
    });
});

{
    const section = document.getElementById('qualitative-forecasts');
    const sample = section.querySelector('.forecast-sample');
    const videos = Array.from(section.querySelectorAll('video'));
    const master = videos[0];
    const buttons = section.querySelectorAll('.forecast-playback');
    const leadtimes = section.querySelectorAll('.forecast-leadtime');
    const fps = Number(sample.dataset.fps);
    const frameCount = Number(sample.dataset.frameCount);
    let wantsPlayback = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = false;
    let ready = false;
    let animation;

    function synchronize() {
        const time = master.currentTime;
        videos.slice(1).forEach(video => {
            if (Math.abs(video.currentTime - time) > 0.04 && !video.seeking) video.currentTime = time;
        });
        const frame = Math.min(frameCount - 1, Math.floor(time * fps));
        leadtimes.forEach(leadtime => { leadtime.textContent = `+${(frame + 1) * 5} min`; });
        animation = requestAnimationFrame(synchronize);
    }

    async function updatePlayback() {
        cancelAnimationFrame(animation);
        const playing = ready && visible && wantsPlayback && !document.hidden;
        buttons.forEach(button => {
            button.textContent = playing ? 'Pause' : 'Play';
            button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} all forecasts`);
        });
        if (!playing) {
            videos.forEach(video => video.pause());
            if (ready) videos.slice(1).forEach(video => { video.currentTime = master.currentTime; });
            return;
        }
        try {
            await Promise.all(videos.map(video => video.play()));
            if (!visible || !wantsPlayback || document.hidden) {
                updatePlayback();
                return;
            }
            cancelAnimationFrame(animation);
            animation = requestAnimationFrame(synchronize);
        } catch {
            wantsPlayback = false;
            updatePlayback();
        }
    }

    buttons.forEach(button => button.addEventListener('click', () => {
        wantsPlayback = !wantsPlayback;
        updatePlayback();
    }));
    document.addEventListener('visibilitychange', updatePlayback);
    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        updatePlayback();
    }, { threshold: 0 }).observe(section);

    Promise.all(videos.map(video => new Promise((resolve, reject) => {
        if (video.readyState >= 2) resolve();
        else video.addEventListener('loadeddata', resolve, { once: true });
        video.addEventListener('error', reject, { once: true });
    }))).then(() => {
        ready = true;
        buttons.forEach(button => { button.disabled = false; });
        updatePlayback();
    }).catch(() => {
        buttons.forEach(button => {
            button.textContent = 'Video unavailable';
            button.disabled = true;
        });
    });
}
