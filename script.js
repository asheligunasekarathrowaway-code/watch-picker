document.querySelectorAll(".presets button").forEach(btn => {
  btn.addEventListener("click", () => {
    const preset = btn.dataset.preset; // "comfort", "chaos", etc.

    typeFilter.value = "";
    genreFilter.value = "";
    moodFilter.value = "";
    unwatchedOnly.checked = true;

    const mappedFeels = presetMapping[preset] || [];

    let filtered = data.filter(item => {
      const itemFeels = item.feels?.split(",").map(f => f.trim()) || [];

      // Match if any of the item's feels are in the preset mapping
      const matchPreset = mappedFeels.some(f => itemFeels.includes(f));
      if (!matchPreset) return false;

      if (unwatchedOnly.checked) {
        if (item.watched?.toLowerCase() === "yes" || item.status?.toLowerCase() === "completed") {
          return false;
        }
      }
      return true;
    });

    if (!filtered.length) {
      titleEl.textContent = "no matches found";
      metaEl.textContent = "";
      trailerEl.style.display = "none";
      result.classList.remove("hidden");
      return;
    }

    const pick = weightedRandom(filtered);

    titleEl.textContent = pick.title;
    metaEl.textContent = `${pick.type} • ${pick.genre}`;

    if (pick.trailer) {
      trailerEl.href = pick.trailer;
      trailerEl.style.display = "inline";
    } else {
      trailerEl.style.display = "none";
    }

    result.classList.remove("hidden");
  });
});
