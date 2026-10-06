-- Palette dei dipendenti più scura: i turni del calendario sono pieni nel colore con testo bianco sopra (≥ 4.5:1).
UPDATE "User" SET "color" = CASE "color"
  WHEN '#2f7fd6' THEN '#2a74c4'
  WHEN '#138a84' THEN '#127d78'
  WHEN '#a87a12' THEN '#8f6b0e'
  WHEN '#687990' THEN '#62728a'
  WHEN '#7d8a1c' THEN '#6b7618'
  WHEN '#d1547a' THEN '#c0446c'
  ELSE "color"
END;
