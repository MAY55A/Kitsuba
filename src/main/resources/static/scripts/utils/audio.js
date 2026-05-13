let currentAudio = null;

// Plays the audio of the given source, and stops any already playing audio.
export async function playAudio(src) {
    if (!src) return null;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(src);

    // Increase volume for cached kanji audio (they initially have low volume)
    if (src.includes("/audio-cache/")) {
        currentAudio.crossOrigin = "anonymous";
        const ctx = new AudioContext();
        const source = ctx.createMediaElementSource(currentAudio);
        const gainNode = ctx.createGain();
        gainNode.gain.value = 4;
        source.connect(gainNode).connect(ctx.destination);
    }

    return new Promise(resolve => {
        currentAudio.play();
        currentAudio.addEventListener("ended", resolve, {once: true});
    });
}

// Adds Click event listeners to all audio symbols in the current DOM,
// and binds them with the playAudio function assuming they all have "data-audio" attribute.
export function bindAudioSymbols() {
    document.querySelectorAll(".audio-symbol").forEach(btn => {
        btn.addEventListener("click", () => playAudio(btn.dataset.audio));
    });
}

export function audioIcon(audioSrc) {
    return `<span class="audio-symbol" data-audio="${audioSrc}">
                <img alt="audio icon"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHdklEQVR4nO1beWxURRh/4n0nXpHERI0a/1ITE02MR9RoosYr3jEqiUdjd2ZLyyl/mC0gUNiZXbYHuNCdWdpS0wqlAdpSUlvYXpReXKUgYMvRUktBoyJQxDHz3rzl7dtpd7fdXcquXzJ/9Jv3+vb3m/l+3zcz7ynKBDWbrfQaDMhiBEg/hrQPQZrFfUqyGII0C0PKjI37lGQxDGkfB93bkM16fNk6CX1KshgWo37ukFNt+t9KMpgDkmeTkoCsFPetCBAXBvRC0hFgh+QdPe4dVi9LGgIc6YWTMaA/6gDd88pZdc2BxCeAKewKDL2fIUBPcmDO9AJWQhuZr62f+dqPJzYBi9PIQwiQWh2UJ2sjq/H1qMD1lpAEuFPcV2NAZiNAz3IwrhnFrKykPQB4whLggPRpDGiXCsRK2aql1ayu6YgUfEPHQOIQkGVKbXlzStjGDbulwOs7B9j2PYOso/vkmAng6wUE6PcOQKYol9ocVvIGhvSIntqK8mrZlpZjwcDbB1jLbg14xz6tjZUAuyX/XgTJvxjQ8wiQl5WJkNqW29awqup9klEfYE07B1l795Af+HgJ4IYAna9dT05hy8oHlXiZzWabhCyeVAzp7/oPLi1o9qc2Y2va+Str3xsMPBoEaCmWlqorSECaS98vvVKJd2rDopmBN+4YYK1dJ0YEHg0CdO3Rww9BOituqS17ZjErX9sZRABX9nCAcx3YvudERAQsnpl/M4LkQ5fVda3Rjy30Fa4HCJC/s6wr7gkLkMNC3kKAbsGA/GUezVGblbKC3BpW16ylNt1vVPbRgLd1D7HmXYOsvmMg4joAQfqtiHm3uU8PBQyoJyR4VwZxRATa0Cor90oLmdGBD6mjzcNiPIUQBuQRBOmweo2FvBYUmpAOI0j+cU7Nf3jUkceQsqVphDV6FrHBulns9LZp/h8wUguOdU3Z/QRIgHPV52mPh4WsHhhLJYgh+U7E+yHbFHqdsQ8Bkq8JIs0ZkQDEpz2kKngOfHVmnv+hPyzKD4sAo7LLCGjtGlKvGQn0eAjgoDEg3eK66ca+JaneR0UY/OGyFt4iJwDSP/lFJ+pmqwQUzzMSsDIkAWaB0/1t3SdDjna01gIIeN8Uqa/fPAswJFt5n91CP5XejMUDOHhjCzcERkpjvo7wQYdLgJrnASlCkDgDZoHNNgkDclAbbfKxiQCLCJHy2BHQzVPYIGvovLiYGQv4UATYbLareLHFU5wDkMcDZwGZJq7dLKlOL/CUaE6XUSGg2RTbsSRA/b2ALhC+Ut2n+jNW3sYVX61LMkqvN/YhSPbwe5xg1VMhCVg9BhGMJwH2rwvuUtMboGd51RcIlLar8Q7o84EYiVsmklICIhXBeBPADQFSrfk9nxj9GFC1nkGQ2AKv96YIfaBRDwHfJSAAA5ougC6X7DBzf5XR74Cel7T/Q7YmBAEOcYCCAGkJICCVPCFGutvoX2L1PiD+T29iEJBeOFnP+0a/cyq9T/h/M/pzwKrbxQw4ddmLoL/600rcs4rB7NMLbhQ5f9jo5+lP5r9sRZCnOTGiZ4z+XEvuTSIEzgUt3bWS+HxChMASC71bzIABo98OC+6XhQCvEWT+y5YAZPE8I0a6zejH0PukTAR1YvhOUWwIaBOt/ThbMb+cueeXxzYEIIGyzQ4M6LuyNIit3hfEDGiIughWNx9hFQ29rLKhl1U1HmY1LUdZXWufn5CYzABIqoT/C5PfKcRuYYDfSj4XmlEQdRGsaOiVNk4IJ6em5Rjb0tofNQJcVs+dXOR43c/LYlkpjCB92zRjcoX/m6iHQIUJ+LLMMrZ87rogf1VjL9vcfJT91HKMbZVsl4dLAAY0U8R5pXQxBOmweY2AAeng99gt3udiTgAOMTP02bGpyRAuERCAAOlRwUDyognHdNlyGKW47+DE8FljXiVeMgKCCGk8zGq394VHgMWTiiCZq5gPZiA9JITxI2MfAuRL2YwJ2hLTN0MjFcFoEKC3mpa+sETQbDzmxXV9QWcEkG4SfV9Jb8aQ1Bk3RccrguMhgIdGpARoZTHZL9LcNPPWuHY6Tc7wUBjtJJeNdVvcDIIL4DKJCIbbIiXAv0MEyEHJhmi2UH8y8vxRFCV7qseuPyjStmbdjjGDHS8B+sEI3yO0Q++rxj5+JMb3AdUjc+h5TAllCHhe54ecuiaE3ayUeZzVbH3twbgToB+N8RcjJH1EG31SosTycBRDeo4/yDVjNSsu2hZXAvjhqN3qec8sfHzzU68JuA7EhICRjsfdCzew8s3746YBZnOnuG/AgP4sUuICJZ7v/mFIT/EHOzMKWCGpZxX1PXEn4OLUp7uk5wDxfEVmWWYZK6voihsBGNI0Af50WMIXl5ek0ryM5tWyjb5fYkqAIP+8empk8X6gTLTX5HLmlLDStZ0xI0Dd9wOkiM8CZSK/KJmPqtj62gMx04AJae4IUmZCEhBJykxoAsJJmQlPQKiUmTQESD+ZSUuiT2aMltQfTRktaT+bM9r/BEBND/hnsz2+nOT7dBZJPp7GgCxSksVs/NMXjQQ+E2L2+fx/5IwJrxmH5ZgAAAAASUVORK5CYII="
                    title="play audio"
                >
            </span>`;
}